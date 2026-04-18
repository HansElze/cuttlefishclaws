import type { Handler } from '@netlify/functions'
import { supabase } from './_shared/supabase'
import { err, ok, preflight } from './_shared/cors'
import { verifyStripeSignature } from './_shared/stripe'

interface StripeEvent {
  id: string
  type: string
  data?: {
    object?: {
      id?: string
      payment_status?: string
      payment_intent?: string
      customer_email?: string
      metadata?: Record<string, string | undefined>
      amount_total?: number
    }
  }
}

async function markReservationPaid(event: StripeEvent) {
  const session = event.data?.object
  const reservationId = session?.metadata?.reservation_id
  if (!session?.id || !reservationId) {
    return
  }

  const paidAt = new Date().toISOString()
  const { data: existing } = await supabase
    .from('presale_reservations')
    .select('id, metadata, status')
    .eq('id', reservationId)
    .maybeSingle()

  const nextStatus = existing?.status === 'pending_confirmation' ? 'confirmed' : existing?.status
  const metadata = {
    ...(existing?.metadata || {}),
    stripe_event_id: event.id,
    stripe_payment_status: session.payment_status || null,
    stripe_amount_total: session.amount_total || null,
    reconciled_via: 'stripe_webhook',
  }

  const { error: updateError } = await supabase
    .from('presale_reservations')
    .update({
      payment_status: 'payment_confirmed',
      status: nextStatus,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent || null,
      paid_at: paidAt,
      metadata,
    })
    .eq('id', reservationId)

  if (updateError) {
    throw updateError
  }

  await supabase.from('agent_tasks').insert({
    task_type: 'presale_payment_confirmed',
    assigned_to: 'trib',
    payload: {
      reservation_id: reservationId,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent || null,
      customer_email: session.customer_email || null,
      stripe_event_id: event.id,
    },
    priority: 2,
  })
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405)

  const payload = event.body || ''
  const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature']

  let verified = false
  try {
    verified = verifyStripeSignature(payload, signature)
  } catch (verificationError) {
    console.error('[stripe-webhook] verification error:', verificationError)
    return err('Webhook secret misconfigured', 500)
  }

  if (!verified) {
    return err('Invalid Stripe signature', 400)
  }

  let stripeEvent: StripeEvent
  try {
    stripeEvent = JSON.parse(payload) as StripeEvent
  } catch {
    return err('Invalid Stripe payload', 400)
  }

  try {
    if (stripeEvent.type === 'checkout.session.completed' && stripeEvent.data?.object?.payment_status === 'paid') {
      await markReservationPaid(stripeEvent)
    }
  } catch (processError) {
    console.error('[stripe-webhook] processing error:', processError)
    return err('Failed to process Stripe webhook', 500)
  }

  return ok({ received: true, eventType: stripeEvent.type })
}

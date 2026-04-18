import type { Handler } from '@netlify/functions'
import { supabase } from './_shared/supabase'
import { preflight, ok, err } from './_shared/cors'
import { createCheckoutSession, getSiteUrl } from './_shared/stripe'

type ParticipantType = 'human' | 'agent' | 'both'
type PaymentRail = 'stripe' | 'usdc_base'

interface PresaleReservationPayload {
  fullName?: string
  email?: string
  participantType?: ParticipantType
  paymentRail?: PaymentRail
  reservationTier?: 'builder'
  reservationAmountUsd?: number
  walletAddress?: string
  txHash?: string
  referral?: string
  notes?: string
  sourcePath?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizeOptional(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405)

  let body: PresaleReservationPayload
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return err('Invalid JSON body')
  }

  const fullName = normalizeOptional(body.fullName)
  const email = normalizeOptional(body.email)?.toLowerCase()
  const participantType = body.participantType
  const paymentRail = body.paymentRail
  const reservationTier = body.reservationTier || 'builder'
  const reservationAmountUsd = Number(body.reservationAmountUsd ?? 100)
  const walletAddress = normalizeOptional(body.walletAddress)
  const txHash = normalizeOptional(body.txHash)
  const referral = normalizeOptional(body.referral)
  const notes = normalizeOptional(body.notes)
  const sourcePath = normalizeOptional(body.sourcePath) || '/presale'
  const paymentStatus = paymentRail === 'stripe' ? 'pending_payment' : 'payment_submitted'

  if (!fullName) return err('fullName is required')
  if (!email || !isValidEmail(email)) return err('A valid email is required')
  if (!participantType || !['human', 'agent', 'both'].includes(participantType)) {
    return err('participantType must be one of: human, agent, both')
  }
  if (!paymentRail || !['stripe', 'usdc_base'].includes(paymentRail)) {
    return err('paymentRail must be one of: stripe, usdc_base')
  }
  if (reservationTier !== 'builder') return err('Only builder presale reservations are supported right now')
  if (reservationAmountUsd !== 100) return err('Reservation amount must be exactly 100 USD')
  if (paymentRail === 'usdc_base' && !walletAddress && !txHash) {
    return err('USDC reservations should include a walletAddress or txHash')
  }

  const { data: existing } = await supabase
    .from('presale_reservations')
    .select('id, status, created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data, error: insertError } = await supabase
    .from('presale_reservations')
    .insert({
      full_name: fullName,
      email,
      participant_type: participantType,
      payment_rail: paymentRail,
      reservation_tier: reservationTier,
      reservation_amount_usd: reservationAmountUsd,
      wallet_address: walletAddress,
      tx_hash: txHash,
      referral,
      notes,
      payment_status: paymentStatus,
      source_path: sourcePath,
      metadata: {
        duplicate_of: existing?.id || null,
        duplicate_status: existing?.status || null,
        captured_via: 'netlify_function',
      },
    })
    .select('id, status, created_at')
    .single()

  if (insertError) {
    console.error('[presale-reservation] insert error:', insertError)
    return err('Failed to record reservation', 500)
  }

  await supabase.from('agent_tasks').insert({
    task_type: 'presale_reservation_review',
    assigned_to: 'trib',
    payload: {
      reservation_id: data.id,
      full_name: fullName,
      email,
      participant_type: participantType,
      payment_rail: paymentRail,
      reservation_tier: reservationTier,
      reservation_amount_usd: reservationAmountUsd,
      wallet_address: walletAddress,
      tx_hash: txHash,
      referral,
      notes,
    },
    priority: paymentRail === 'usdc_base' ? 2 : 3,
  })

  let stripeCheckoutUrl: string | undefined
  let stripeCheckoutSessionId: string | undefined

  if (paymentRail === 'stripe') {
    try {
      const siteUrl = getSiteUrl()
      const checkout = await createCheckoutSession({
        reservationId: data.id,
        email,
        fullName,
        amountUsd: reservationAmountUsd,
        successUrl: `${siteUrl}/presale?stripe=success&reservation=${data.id}`,
        cancelUrl: `${siteUrl}/presale?stripe=cancelled&reservation=${data.id}`,
      })

      stripeCheckoutUrl = checkout.url
      stripeCheckoutSessionId = checkout.id

      await supabase
        .from('presale_reservations')
        .update({
          stripe_checkout_session_id: checkout.id,
          metadata: {
            duplicate_of: existing?.id || null,
            duplicate_status: existing?.status || null,
            captured_via: 'netlify_function',
            stripe_checkout_status: checkout.status || null,
          },
        })
        .eq('id', data.id)
    } catch (stripeError) {
      console.error('[presale-reservation] stripe checkout error:', stripeError)
      return err('Reservation was saved, but Stripe checkout could not be created. Please try again.', 502)
    }
  }

  return ok({
    success: true,
    reservationId: data.id,
    status: data.status,
    paymentStatus,
    stripeCheckoutUrl,
    stripeCheckoutSessionId,
    message: paymentRail === 'stripe'
      ? 'Reservation recorded. Continue to Stripe to complete your card payment.'
      : 'Reservation recorded. We will verify your Base USDC transfer and confirm by email.',
    nextStep: paymentRail === 'stripe'
      ? 'Complete Stripe checkout now. Your reservation will be marked paid automatically after the webhook arrives.'
      : 'Keep your transaction hash available for manual verification.',
  }, 201)
}

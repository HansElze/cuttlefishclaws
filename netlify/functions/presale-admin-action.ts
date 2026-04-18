import type { Handler } from '@netlify/functions'
import { supabase } from './_shared/supabase'
import { preflight, ok, err } from './_shared/cors'

function isAuthorized(event: Parameters<Handler>[0]): boolean {
  const configuredKey = process.env.PRESALE_ADMIN_KEY
  if (!configuredKey) return false

  const authHeader = event.headers.authorization || event.headers.Authorization
  const headerKey = event.headers['x-admin-key'] || event.headers['X-Admin-Key']
  const bearerKey = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  return headerKey === configuredKey || bearerKey === configuredKey
}

interface AdminActionPayload {
  reservationId?: string
  status?: 'pending_confirmation' | 'confirmed' | 'kya_pending' | 'wallet_pending' | 'ready_for_issuance' | 'issued' | 'cancelled'
  kyaStatus?: 'not_started' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  paymentStatus?: 'pending_payment' | 'payment_submitted' | 'payment_confirmed'
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405)
  if (!isAuthorized(event)) return err('Unauthorized', 401)

  let body: AdminActionPayload
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return err('Invalid JSON body')
  }

  if (!body.reservationId) return err('reservationId is required')
  if (!body.status && !body.kyaStatus && !body.paymentStatus) return err('status, kyaStatus, or paymentStatus is required')

  const patch: Record<string, string> = {}
  if (body.status) patch.status = body.status
  if (body.kyaStatus) patch.kya_status = body.kyaStatus
  if (body.paymentStatus) patch.payment_status = body.paymentStatus

  const { data, error: updateError } = await supabase
    .from('presale_reservations')
    .update(patch)
    .eq('id', body.reservationId)
    .select('id, status, kya_status, payment_status')
    .single()

  if (updateError) {
    console.error('[presale-admin-action] update error:', updateError)
    return err('Failed to update reservation', 500)
  }

  return ok({
    success: true,
    reservationId: data.id,
    status: data.status,
    kyaStatus: data.kya_status,
    paymentStatus: data.payment_status,
  })
}

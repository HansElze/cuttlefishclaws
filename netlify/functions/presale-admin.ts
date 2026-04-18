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

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err('Method not allowed', 405)
  if (!isAuthorized(event)) return err('Unauthorized', 401)

  const limit = Math.min(Number(event.queryStringParameters?.limit || 25), 100)

  const { data, error: queryError } = await supabase
    .from('presale_reservations')
    .select('id, full_name, email, participant_type, payment_rail, reservation_tier, reservation_amount_usd, payment_status, status, kya_status, wallet_address, intended_wallet_address, tx_hash, operator_name, owner_jurisdiction, stripe_checkout_session_id, stripe_payment_intent_id, paid_at, followup_submitted_at, wallet_bound_at, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (queryError) {
    console.error('[presale-admin] query error:', queryError)
    return err('Failed to load reservations', 500)
  }

  const summary = (data || []).reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1
    return acc
  }, {})

  const paymentSummary = (data || []).reduce<Record<string, number>>((acc, row) => {
    acc[row.payment_status] = (acc[row.payment_status] || 0) + 1
    return acc
  }, {})

  const railSummary = (data || []).reduce<Record<string, number>>((acc, row) => {
    acc[row.payment_rail] = (acc[row.payment_rail] || 0) + 1
    return acc
  }, {})

  return ok({
    success: true,
    count: data?.length || 0,
    summary,
    paymentSummary,
    railSummary,
    reservations: data || [],
  })
}

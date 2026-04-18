import type { Handler } from '@netlify/functions'
import { supabase } from './_shared/supabase'
import { preflight, ok, err } from './_shared/cors'

interface PresaleFollowupPayload {
  reservationId?: string
  walletAddress?: string
  operatorName?: string
  ownerJurisdiction?: string
  notes?: string
}

function normalizeOptional(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405)

  let body: PresaleFollowupPayload
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return err('Invalid JSON body')
  }

  const reservationId = normalizeOptional(body.reservationId)
  const walletAddress = normalizeOptional(body.walletAddress)
  const operatorName = normalizeOptional(body.operatorName)
  const ownerJurisdiction = normalizeOptional(body.ownerJurisdiction)
  const notes = normalizeOptional(body.notes)

  if (!reservationId) return err('reservationId is required')
  if (!walletAddress) return err('walletAddress is required')
  if (!ownerJurisdiction) return err('ownerJurisdiction is required')

  const timestamp = new Date().toISOString()

  const { data: existing, error: existingError } = await supabase
    .from('presale_reservations')
    .select('id, metadata, status')
    .eq('id', reservationId)
    .maybeSingle()

  if (existingError) {
    console.error('[presale-followup] lookup error:', existingError)
    return err('Failed to load reservation', 500)
  }

  if (!existing) return err('Reservation not found', 404)

  const mergedMetadata = {
    ...(existing.metadata || {}),
    followup_completed: true,
    last_followup_at: timestamp,
  }

  const nextStatus = existing.status === 'confirmed' ? 'kya_pending' : 'wallet_pending'

  const { data, error: updateError } = await supabase
    .from('presale_reservations')
    .update({
      intended_wallet_address: walletAddress,
      operator_name: operatorName,
      owner_jurisdiction: ownerJurisdiction,
      notes,
      kya_status: 'submitted',
      followup_submitted_at: timestamp,
      wallet_bound_at: timestamp,
      status: nextStatus,
      metadata: mergedMetadata,
    })
    .eq('id', reservationId)
    .select('id, status, kya_status')
    .single()

  if (updateError) {
    console.error('[presale-followup] update error:', updateError)
    return err('Failed to save follow-up details', 500)
  }

  await supabase.from('agent_tasks').insert({
    task_type: 'presale_kya_review',
    assigned_to: 'trib',
    payload: {
      reservation_id: reservationId,
      wallet_address: walletAddress,
      operator_name: operatorName,
      owner_jurisdiction: ownerJurisdiction,
      notes,
    },
    priority: 2,
  })

  return ok({
    success: true,
    reservationId: data.id,
    status: data.status,
    kyaStatus: data.kya_status,
    message: 'Follow-up received. We will review your wallet and KYA details before CAC issuance.',
  })
}

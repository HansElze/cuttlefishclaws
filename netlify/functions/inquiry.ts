import type { Handler } from '@netlify/functions'
import { supabase } from './_shared/supabase'

const CONTACT_EMAIL = process.env.CONTACT_FORWARD_EMAIL || 'dvdelze@gmail.com'

interface InquiryPayload {
  name?: string
  email?: string
  amount?: string
  interest?: string
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function json(status: number, body: object) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  }
}

function normalizeOptional(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: 'Method not allowed' }
  }

  const apiUrl = process.env.TRIB_API_URL
  const apiKey = process.env.TRIB_API_KEY

  let body: InquiryPayload
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  const name = normalizeOptional(body.name)
  const email = normalizeOptional(body.email)?.toLowerCase()
  const amount = normalizeOptional(body.amount)
  const interest = normalizeOptional(body.interest)

  if (!email || !isValidEmail(email)) {
    return json(400, { error: 'A valid email is required' })
  }

  let crewForwarded = false
  if (apiUrl) {
    try {
      await fetch(`${apiUrl}/investor-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey || '' },
        body: JSON.stringify({ name, email, amount, interest }),
        signal: AbortSignal.timeout(10000),
      })
      crewForwarded = true
    } catch (error: any) {
      console.error('[inquiry fn] crew forward failed:', error.message)
    }
  }

  const { error: taskError } = await supabase.from('agent_tasks').insert({
    task_type: 'investor_inquiry',
    assigned_to: 'trib',
    payload: {
      name,
      email,
      amount,
      interest,
      received_via: 'website_inquiry_form',
      contact_forward_email: CONTACT_EMAIL,
      crew_forwarded: crewForwarded,
    },
    priority: 2,
  })

  if (taskError) {
    console.error('[inquiry fn] task insert failed:', taskError)
    return json(500, {
      error: 'Failed to capture inquiry',
      contactEmail: CONTACT_EMAIL,
    })
  }

  return json(200, {
    status: 'received',
    message: `Trib has your inquiry. Expect a response at ${email} within 24 hours.`,
    contactEmail: CONTACT_EMAIL,
    crewForwarded,
  })
}

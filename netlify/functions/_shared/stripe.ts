import crypto from 'node:crypto'

const STRIPE_API_BASE = 'https://api.stripe.com/v1'

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} must be set`)
  }

  return value
}

export function getStripeSecretKey(): string {
  return getRequiredEnv('STRIPE_SECRET_KEY')
}

export function getStripeWebhookSecret(): string {
  return getRequiredEnv('STRIPE_WEBHOOK_SECRET')
}

export function getSiteUrl(): string {
  return (
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.SITE_URL ||
    'http://localhost:8888'
  )
}

export async function createCheckoutSession(params: {
  reservationId: string
  email: string
  fullName: string
  amountUsd: number
  successUrl: string
  cancelUrl: string
}) {
  const secretKey = getStripeSecretKey()
  const amountCents = Math.round(params.amountUsd * 100)

  const body = new URLSearchParams({
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.email,
    'payment_method_types[0]': 'card',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(amountCents),
    'line_items[0][price_data][product_data][name]': 'CAC Builder Reservation',
    'line_items[0][price_data][product_data][description]': 'Compute Access Certificate builder presale reservation',
    'line_items[0][quantity]': '1',
    'metadata[reservation_id]': params.reservationId,
    'metadata[email]': params.email,
    'metadata[full_name]': params.fullName,
  })

  const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to create Stripe Checkout session')
  }

  return data as {
    id: string
    url: string
    payment_intent?: string
    status?: string
  }
}

export function verifyStripeSignature(payload: string, signatureHeader: string | undefined): boolean {
  if (!signatureHeader) return false

  const webhookSecret = getStripeWebhookSecret()
  const parts = signatureHeader.split(',').reduce<Record<string, string>>((acc, piece) => {
    const [key, value] = piece.split('=')
    if (key && value) acc[key] = value
    return acc
  }, {})

  const timestamp = parts.t
  const signature = parts.v1

  if (!timestamp || !signature) return false

  const signedPayload = `${timestamp}.${payload}`
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

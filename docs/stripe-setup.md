# Stripe Setup

This project now supports Stripe-backed CAC presale reservations.

## What the flow does

1. User submits the `/presale` form with `paymentRail = stripe`
2. `presale-reservation` creates a reservation row in Supabase
3. The same function creates a Stripe Checkout session tied to that reservation
4. The browser redirects to Stripe Checkout
5. Stripe sends `checkout.session.completed` to `stripe-webhook`
6. The webhook marks the reservation as `payment_confirmed`

## Required environment variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `PRESALE_ADMIN_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SITE_URL`

For local development, `SITE_URL` should usually match the URL you are using for the site and functions.

## Webhook endpoint

Configure Stripe to send events to:

- Production: `https://your-domain/.netlify/functions/stripe-webhook`
- Local Netlify dev: `http://localhost:8888/.netlify/functions/stripe-webhook`

Listen for:

- `checkout.session.completed`

## Important metadata

The checkout session stores:

- `reservation_id`
- `email`
- `full_name`

The webhook uses `reservation_id` to reconcile payment back into `presale_reservations`.

## Schema fields used

The reservation table now stores:

- `stripe_checkout_session_id`
- `stripe_payment_intent_id`
- `paid_at`
- `payment_status`

## Local testing notes

To test webhooks locally, run the site with functions enabled and forward Stripe events to the local webhook endpoint.

If you use Stripe CLI, the forwarding target should be:

- `http://localhost:8888/.netlify/functions/stripe-webhook`

# CAC Fulfillment Playbook

This is the internal operating sequence for CAC builder-card reservations.

## Primary Goal

Turn each presale reservation into a clean issuance record without losing payment context, wallet details, KYA status, or delivery readiness.

## Canonical Sequence

1. Reservation intake
   - User pays with Stripe or Base USDC.
   - User submits `/presale` reservation form.
   - Record is stored in `presale_reservations`.

2. Payment confirmation
   - Admin reviews Stripe dashboard or Base transaction hash.
   - Reservation moves from `pending_confirmation` to `confirmed`.
   - `payment_status` moves to `payment_confirmed`.

3. Wallet binding and KYA intake
   - Holder completes `/presale/follow-up`.
   - Wallet, operator name, jurisdiction, and notes are stored.
   - Reservation moves into `wallet_pending` or `kya_pending`.

4. KYA review
   - Admin checks identity or operator details.
   - `kya_status` moves from `submitted` to `under_review` to `approved` or `rejected`.

5. Ready for CAC issuance
   - Reservation must have:
     - confirmed payment
     - approved KYA
     - wallet bound
   - Reservation moves to `ready_for_issuance`.

6. CAC record creation
   - Create CAC credential or protocol-side issuance record.
   - Capture issuance tx, credential id, or internal issuance reference.

7. Physical card fulfillment
   - Schedule print, encoding, packaging, and shipment.
   - Mark reservation `issued` only after CAC record exists and fulfillment is actually queued.

## Admin Dashboard Use

- `Confirm`: payment verified and reservation accepted.
- `KYA Review`: follow-up received and human review starts.
- `Ready`: payment confirmed, KYA approved, wallet bound.
- `Issued`: CAC record created and card fulfillment scheduled.

## Before Scaling Traffic

- Publish refund and cancellation handling.
- Add Stripe webhook reconciliation.
- Add a persistent issuance reference to the reservation record.
- Add shipment tracking or fulfillment status after issuance starts.

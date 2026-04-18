# CAC Presale Implementation Plan

This repo now starts the reservation system of record for CAC builder presales.

## Build Order

1. Reservation intake
   - `/presale` submits to `presale-reservation`
   - reservation stored in Supabase
   - follow-up review task queued

2. Admin visibility
   - add reservation read endpoint
   - add internal dashboard
   - reconcile Stripe and Base USDC payments
   - export contacts and issuance-ready queue
   - publish an internal fulfillment playbook for ops consistency

3. Credibility layer
   - publish clear phase, FAQ, terms, and fulfillment steps
   - surface live protocol readiness and contact info

4. Issuance bridge
   - capture wallet binding
   - capture KYA details
   - move reservation through issuance states
   - add admin actions to confirm payment and mark ready for issuance
   - make issuance sequence explicit on-site and in internal ops
   - track the final move from ready queue to issued card

5. Protocol integration
   - connect reservation records to CAC issuance actions
   - map reservation lifecycle to protocol-side credential issuance

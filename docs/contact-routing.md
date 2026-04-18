# Contact Routing

The site now uses `dvdelze@gmail.com` as the primary visible contact address.

## Current behavior

- Footer contact links point to `dvdelze@gmail.com`
- Website investor inquiries post to `/.netlify/functions/inquiry`
- The inquiry function always records a task in `agent_tasks`
- If `TRIB_API_URL` is configured, the function also forwards the inquiry there

## Environment variable

- `CONTACT_FORWARD_EMAIL`

If set, the inquiry function stores that address in the inquiry task payload for operator visibility.
If unset, it defaults to `dvdelze@gmail.com`.

## Important note

This improves the website contact flow, but it does not replace domain-level email forwarding for addresses like:

- `invest@cuttlefish.ai`
- `legal@cuttlefish.ai`

Those still need to be configured in Google Workspace or your domain mail provider if you want inbound email at those addresses to reach Gmail automatically.

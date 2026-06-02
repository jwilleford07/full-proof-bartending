# Full Proof Bartending

Luxury mobile bartending for private events across LA, Long Beach, and OC.

Full Proof brings polished bar service, hand-carved clear ice, and a professional self-contained craft bar setup to private parties, weddings, corporate events, and hosted gatherings.

## Site

This is a static website. Open `index.html` directly in a browser or deploy the folder through GitHub Pages, Netlify, Vercel, or any static hosting service.

## Netlify Functions

The booking form posts to Netlify Forms, then attempts a non-blocking HighLevel sync. If HighLevel env vars are missing, the form still works and the sync function returns `configured:false`.

Required production env vars for HighLevel capture:

- `FULL_PROOF_HIGHLEVEL_ACCESS_TOKEN`
- `FULL_PROOF_HIGHLEVEL_LOCATION_ID`
- `FULL_PROOF_HIGHLEVEL_EVENT_PIPELINE_ID`
- `FULL_PROOF_HIGHLEVEL_EVENT_STAGE_ID`

Optional env vars:

- `FULL_PROOF_HIGHLEVEL_ASSIGNED_TO`
- `FULL_PROOF_HIGHLEVEL_API_BASE_URL`
- `FULL_PROOF_HIGHLEVEL_API_VERSION`

Stripe checkout still requires `STRIPE_SECRET_KEY`.

## Brand Position

Full Proof is not a bartender behind a folding table. It is a premium mobile bar experience built around warm hospitality, precise craft, clear ice expertise, and a fully equipped setup with running water, power, rinser, LED lighting, and organized tools. Current pricing separates base bartending from Full Proof Pro Bar and Full Proof Elite Bar rentals so hosts can book simply while premium presentation stays protected.

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
- `FULL_PROOF_HIGHLEVEL_EVENT_CUSTOM_FIELD_IDS`

Optional env vars:

- `FULL_PROOF_HIGHLEVEL_ASSIGNED_TO`
- `FULL_PROOF_HIGHLEVEL_API_BASE_URL`
- `FULL_PROOF_HIGHLEVEL_API_VERSION` (use `2023-02-21`)
- `FULL_PROOF_HIGHLEVEL_CREATE_OWNER_TASKS` (defaults to on; set to `false` only if task creation needs to be paused)

`FULL_PROOF_HIGHLEVEL_EVENT_CUSTOM_FIELD_IDS` should be a JSON object mapping website/intake field keys to HighLevel custom field IDs. If it is missing, the function still creates the contact and opportunity, but richer event details remain only in Netlify Forms.

When HighLevel is configured, the sync function creates the contact, creates the event opportunity, and then attempts a non-blocking `Qualify event fit` owner task. If task creation fails, the website lead still captures and the function reports `taskSynced:false` with `taskError`.

Stripe checkout still requires `STRIPE_SECRET_KEY`.

## Brand Position

Full Proof is not a bartender behind a folding table. It is a premium mobile bar experience built around warm hospitality, precise craft, clear ice expertise, and a fully equipped setup with running water, power, rinser, LED lighting, and organized tools. Current pricing separates base bartending from Full Proof Pro Bar and Full Proof Elite Bar rentals so hosts can book simply while premium presentation stays protected.

# Website Booking Flow Audit

Date: 2026-05-15  
Scope: `index.html`, `success.html`, and the live booking path for Full Proof Bartending.

## Executive Read

The website has strong raw material: premium positioning, real founder credibility, clear service area, launch package anchors, and excellent visual direction around cocktails and clear ice. The main weakness was not brand substance. It was action clarity.

The page needs to make one decision obvious at every point:

- Check the date.
- Contact Joe directly.
- Ask to reserve Launch Special Basic or Cups + Garnishes with a date-hold deposit.

## What Was Weak

### Booking Paths Were Present But Not Separated

The site had a form, email, text, and date-hold language, but they were not presented as distinct choices. A ready buyer, a cautious quote shopper, and a planner with a quick question all saw mostly the same CTA.

### Direct Booking Was Underdeveloped

The site correctly says the menu can be finalized later, but the date-hold path was not prominent enough. The honest version is a package choice plus `Reserve Launch Special with 50% deposit` intent, not a separate "deposit" add-on.

### The Form Was Stronger Than The Page Around It

The form already collected better fields than the old live form: phone, preferred contact method, service window, booking intent, and interests. The missing piece was a clearer route into that form.

### Success Needed To Reinforce The Process

The success page confirmed receipt, but did not explain what happens next. That leaves the visitor wondering whether the booking is active, pending, or just an inquiry.

## Changes Made

- Added a clear three-path booking panel after services:
  - Fill out the form.
  - Text or email Joe.
  - Start a date hold.
- Updated hero CTA hierarchy:
  - `Check your date`
  - `Reserve date hold`
  - `Text Full Proof`
- Added `id="event-inquiry"` so CTAs can jump directly to the form.
- Updated package CTA language to make `Reserve Launch Special` a first-class action.
- Added contact-section cards for form, direct contact, and date-hold request.
- Added `Reserve Launch Special with 50% deposit` as the booking-intent option.
- Added `Date-hold deposit` as an interest checkbox.
- Expanded `success.html` with next steps after form submission.

## Remaining Blockers

### Payment Link

True direct booking requires a Stripe or Square payment link. The current repo guidance says not to wire a payment link until Stripe or Square is ready. Once ready, add the link anywhere the site says:

- `Reserve date hold`
- `Reserve Launch Special`
- `Reserve standard service`

Recommended first payment path:

- Fixed date-hold deposit language for Launch Special.
- Follow-up agreement and final scope after availability is confirmed.

### Photo Pass

Joe has better photo/video assets than the current site can fully show. First booking flow, then visual upgrade.

Priority image slots:

- Hero: strongest premium bar/cocktail image.
- Services: event-specific proof.
- Packages: setup and finished drinks.
- Ice: macro clear ice and cocktail finish.
- About: Joe behind the bar.

### Netlify Notification Test

After deployment, submit a test form and confirm:

- Netlify records the `full-proof-event-inquiry` submission.
- Email notification arrives.
- `/success.html` loads after submit.
- Phone, email, and anchor CTAs work on mobile.

## Current Recommendation

Ship the booking-flow refresh after `npm run check` passes, then add the payment link as the next small release once Stripe or Square is ready.

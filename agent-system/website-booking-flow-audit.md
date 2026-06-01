# Website Booking Flow Audit

Date: 2026-05-31
Scope: `index.html`, `success.html`, Stripe date-hold logic, and the Full Proof bar booking path for Full Proof Bartending.

## Executive Read

The site should make one decision obvious:

- Hold the date now.
- Choose the cocktail menu later.
- Pick the right Full Proof bar footprint if the event or upgrades require it.

The winning position is not "another bartender with a quote form." It is transparent, luxury instant-book mobile bartending with a visible path from interest to deposit.

## Current Booking Logic

- Base Bartending: `$599 / 3 hours` or `$699 / 4 hours`.
- Full Proof Pro Bar: `+$100`, recommended for up to `40` guests.
- Full Proof Elite Bar: `+$200`, required for `41-125` guests.
- `126+` guests: manual review before instant booking.
- Premium upgrades require Full Proof Pro Bar or Elite.
- Total Wine guidance + ice service: `+$100`; requires Full Proof bar when ice service is included.
- Menu path can be rotating, custom, or choose later.

## What The Page Must Protect

### Low Friction

The form should collect the fields needed to route the lead without forcing the host through a quote maze:

- Guest-count band.
- Service window.
- Menu path.
- bar selection.
- Add-on interests.

### Premium Scope

Premium add-ons should never be sold without the setup that lets them look and run right. If a host selects a premium add-on without Full Proof bar, the page should explain the requirement before checkout.

### Manual Review

Large or complex events should submit for review instead of taking instant payment.

## QA Scenarios

- 35 guests, base service only: Full Proof bar optional.
- 35 guests, smoke bubbles: Full Proof Pro Bar or Elite required.
- 35 guests, wants larger display: Full Proof Elite Bar allowed.
- 75 guests, any booking: Full Proof Elite Bar required.
- 130 guests: manual review.
- Choose-later menu: date-hold flow remains valid.

## Current Recommendation

Keep refining toward the lowest-friction path between finding Full Proof and booking Full Proof. Any new CRM, agent, or booking tool should preserve the bar rental rules above instead of reintroducing back-and-forth quoting.

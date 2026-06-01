# Offers & Packages - Full Proof Bartending

Internal source of truth for public pricing, add-on gates, booking logic, and quote language. Keep this aligned with `index.html`, `package-sheet.md`, `netlify/functions/create-checkout-session.js`, and the Sales & Accounting Manager.

## Positioning

- **Primary sale:** premium mobile bartending with calm service, composed presentation, and low-friction booking.
- **Offer strategy:** keep base bartending reasonable, then protect margin with GoBar rental, concierge support, and premium visual/craft add-ons.
- **Differentiators:** self-contained bar workflow, clear ice skills, polished presentation, founder-led hospitality, and practical shopping/ice guidance.
- **Booking promise:** the host can hold the date before the cocktail menu is finished.

Avoid cheap-sounding language. Use "instant-book," "date hold," "premium footprint," "GoBar Pro," "GoBar Elite," "concierge guidance," and "manual review" instead of discount framing.

## Public Pricing Ladder

| Path | Public price | 50% date-hold deposit | Best fit |
|---|---:|---:|---|
| **Base Bartending - 3 hours** | **$599** | **$299.50** | Small/simple private events that need bartender, tools, setup/cleanup, and shopping guidance. |
| **Base Bartending - 4 hours** | **$699** | **$349.50** | Events needing a longer active service window before add-ons. |
| **GoBar Pro rental** | **+$100** | **+$50** | Recommended premium footprint for events up to 40 guests. |
| **GoBar Elite rental** | **+$200** | **+$100** | Required for 41-125 guests and optional for smaller events wanting a larger luxury footprint. |
| **126+ guests** | **Manual review** | **Manual review** | Requires staffing, footprint, load-in, and service-flow review before payment. |

## Core Rules

- Base service can be booked without GoBar for small/simple events up to 40 guests.
- GoBar Pro is recommended, not required, for 0-40 guests unless a premium add-on is selected.
- GoBar Elite is required for 41-125 guests.
- Events at 126+ guests do not use instant checkout.
- Any premium visual/craft upgrade requires GoBar Pro or GoBar Elite.
- Client can choose rotating menu, custom menu, or choose-later/custom after the date hold.

## Base Bartending Includes

- One professional bartender for the selected active service window.
- Service planning, timeline touchpoints, pour logic, menu direction, and shopping guidance.
- Professional bottles, tools, service mats, setup, service, cleanup, and event-ready organization.
- Host-provided alcohol unless separately arranged.
- Menu path can be rotating, custom, or choose-later.

Base does not automatically include GoBar rental, alcohol, guest-facing bar furniture, specialty ice logistics, extra bartenders, extended service, premium garnish styling, espresso martini service, smoke, signage, or unusual venue logistics.

## GoBar Rentals

### GoBar Pro - +$100

- Compact premium Full Proof bar footprint.
- Recommended for up to 40 guests when presentation matters.
- Unlocks premium add-ons for smaller events.
- Best for patios, tight spaces, rooftops, and intimate private events.

### GoBar Elite - +$200

- Larger luxury bar footprint.
- Required for 41-125 guests.
- Optional upgrade for smaller events that want the bar to anchor the room.
- Best for weddings, corporate gatherings, brand activations, and higher-visibility events.

## Premium Add-On Gate

These require GoBar Pro or GoBar Elite:

- Clear ice upgrades.
- Smoke or smoke bubbles.
- Espresso martinis.
- Custom infusions.
- Organic California dehydrated citrus.
- Premium garnish styling.
- Custom menu display/signage.
- Any other visual/craft upgrade that depends on controlled workflow, ice handling, or guest-facing presentation.

Use this explanation when needed:

> Premium upgrades require a Full Proof bar rental so we can control presentation, workflow, ice handling, and guest experience.

## Concierge Bundle

**Total Wine guidance + ice service: +$100**

- Keeps purchasing and ice logistics cleaner for the host.
- Requires GoBar if the ice service portion is included.
- Can be recommended as a launch friction-killer, especially for hosts who want the easiest path.

## Booking Flow

Public booking language should collect:

1. Guest-count band.
2. Service hours.
3. Menu path: rotating, custom, or choose later.
4. GoBar selection: none, Pro, or Elite.
5. Add-on interests.

Auto-selection logic:

- 0-40 guests: recommend GoBar Pro.
- 41-125 guests: require GoBar Elite.
- 126+ guests: manual review.
- Premium add-on selected with no GoBar: block instant checkout and explain the GoBar requirement.

## Quote Language

### Opening Anchor

"For good-fit private events, base bartending is **$599 for 3 hours** or **$699 for 4 hours**. GoBar Pro adds **$100** for a polished smaller-event footprint, and GoBar Elite adds **$200** for 41-125 guests or smaller events that want the larger luxury setup. You can hold the date now and choose the cocktail menu later."

### Deposit

"Instant-book eligible events use a 50% date-hold deposit based on the selected base service, GoBar path, and any direct concierge bundle."

### Scope Protection

"Premium upgrades like clear ice features, smoke, espresso martinis, custom infusions, organic dehydrated citrus, garnish styling, and menu signage require GoBar Pro or Elite so the event is set up to look and run properly."

### Manual Review

"For 126+ guests, weddings with complex venue rules, brand activations, long service windows, or unusual load-ins, I’ll review the event before payment so staffing, bar footprint, and service pace are protected."

## Related Files

- `index.html`
- `netlify/functions/create-checkout-session.js`
- `agent-system/package-sheet.md`
- `agent-system/agents/offer-architect.md`
- `agent-system/agents/sales-accounting-manager.md`
- `agent-system/client-quote-response-template.md`

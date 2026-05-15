# Offers & Packages — Full Proof Bartending

Internal reference for package structure, add-ons, quoting, and launch-window framing. Aligns with `agents/offer-architect.md`, `hermes-handoff-prompt.md`, and live homepage copy in `index.html`.

## Positioning

- **Primary sale:** Premium mobile bartending — calm service, composed bar presence, thoughtful cocktails.
- **Signature proof:** Hand-carved clear ice is a visible premium detail, not a gimmick or the entire brand story.
- **Economics:** Keep **published base rates approachable** to reduce sticker shock and start conversations. Capture **margin in add-ons** (time, staffing, ice artistry, menu depth, logistics intensity).

Avoid sounding promotional or discounter: no “discount,” “deal,” “% off,” “flash sale,” or urgency hacks. Prefer **hospitality** and **portfolio-build** language.

---

## Standard Service (published anchor)

**Public pricing**

- **Launch special from $749 / 3 hours**
- **$899 / 4 hours**

**Always include (every booking)**

- One professional bartender for active service (setup/cleanup outside guest-facing hours as quoted).
- Service planning: timeline touchpoints, pour logic, menu direction, shopping guidance for client-provided alcohol.
- Professional bar tools and a **composed, guest-ready bar station** appropriate to the contract (see “Setup tiers” below — full mobile unit vs. streamlined station is scoped in quote).
- **Tossware premium compostable drinkware** for all Full Proof–served beverages unless the host opts into glassware they supply.
- **Hand-carved clear ice cubes** for cocktails served at the event — included during the **launch / portfolio window** (see framing below).
- Cleanup aligned with venue rules and the agreed scope.

**Best-fit positioning**

- Smaller private events, tight footprints, or hosts who want premium execution without every theatrical extra.

---

## Launch window — clear ice & hospitality framing

**Business intent:** Early events build a publishable portfolio while maintaining luxury perception.

**Approved language patterns** (pick one thread per touchpoint; do not stack hype)

- “**Launch hospitality upgrade** — hand-carved clear ice cubes included on standard service while we build our published portfolio.”
- “We’re **building our published portfolio**; early bookings receive **enhanced inclusions** so every event reflects how we execute.”
- “**Portfolio-window inclusion** — clear ice cubes bundled into standard service during this phase.”

**Avoid**

- Anything that reads like a coupon (“special discount,” “limited-time deal,” “mark-down”).
- Over-promising specialty ice (spheres, spears, branded blocks) as included — those stay **add-ons**.

**Operational note:** When the portfolio window closes, standard service still includes clear cubes **as the baseline Full Proof standard** unless pricing architecture intentionally changes — update this doc and `index.html` together when that happens.

---

## Setup tiers (quote logic)

Full Proof should never read “folding-table bar.” The **difference is equipment intensity**, not professionalism.

| Tier | Client-facing name | What it is | Typical margin lever |
|------|---------------------|------------|----------------------|
| **A** | Professional bar station | Composed back bar, organized tools, garnish and execution at event-grade presentation — scoped to venue layout | Base-friendly; upsell time/menu depth |
| **B** | Full mobile craft bar | Self-contained unit: power, running water, rinser, LED, modular layout | Higher quoted minimums; travel/setup complexity |

**Rule:** Tier B is **quoted**, not buried as assumed. If marketing says “full mobile bar,” ensure the quote reflects Tier B.

---

## Add-on menu (margin layers)

Quote **per event**. Bundle where it simplifies the buying decision.

### Ice & presentation

- Pressed spheres, Collins spears, specialty cuts, **extra clear-ice volume** beyond baseline cubes.
- Branded or custom motif cubes (production + handling time).
- Premium garnish program upgrades (e.g., expanded dehydrated fruit program beyond standard garnish handling).

### Menu & production

- Signature cocktail development (tasting loops, naming, printed/embellished menu cards).
- Batching execution support (prep timelines, vessel guidance, on-site finishing strategy).
- Low- and no-alcohol cocktail parity (paired signatures).

### Service & staffing

- Additional bartender(s).
- Extended active service hours; late-night extensions.
- High-touch pacing for brand activations or VIP lanes.

### Experience accents

- Smoke-forward presentations where venue rules allow.
- “Smoke bubbles” or similar theatrical accents — **only** when brand-appropriate and venue-safe.

### Logistics

- Travel beyond core LA / Long Beach / OC corridor (define thresholds in quote).
- Parking/load-in constraints, challenging access, or extended venue holds.

**Upsell path (conversation order)**

1. Guest count + service window → validate staffing and hours.
2. Menu ambition → signatures + batching.
3. Presentation → specialty ice + garnish depth + Tier B bar if not already in scope.
4. Brand moments → custom ice / menus / activation pacing.

---

## Client-provided vs Full Proof–provided

| Item | Default |
|------|---------|
| Spirits, wine, beer, mixers (unless contracted otherwise) | **Client-provided**; Full Proof provides shopping list and quantities |
| Venue access, permits host holds | **Client** |
| Glassware (optional upgrade path) | **Client** unless contracted rental/supply |
| Bar equipment, tools, Tossware, execution ice baseline | **Full Proof** per quote |
| Specialty ice beyond baseline | **Quoted add-on** |

---

## Quote language (copy-ready blocks)

### Opening anchor (email)

“Launch Standard mobile bartending service starts at **$749 for three hours** or **$899 for four hours** for events that fit our single-bartender footprint. Final quotes reflect guest count, service length, staffing, travel, menu complexity, and add-ons.”

### Portfolio-window sentence (optional)

“This season we’re **building our published portfolio**, so standard service currently includes **hand-carved clear ice cubes** as part of our **launch hospitality upgrade**.”

### Tier B upsell

“When events call for the **full self-contained mobile craft bar** (running water, rinser, integrated lighting), we quote that as a dedicated line item so production and load-in match what guests experience.”

### Closing line

“Alcohol is typically host-provided; once we lock the menu, we send a **shopping list with quantities** so purchasing is straightforward.”

---

## Homepage alignment (`index.html`)

Published packages section should always:

- Use section eyebrow **Packages** (pricing lives in the cards; avoids noisy “sale” signaling).
- Show **Launch Standard** dollar amounts exactly as listed above (QA-enforced).
- Include clear date-hold and form language (QA-enforced).
- Present add-ons as **quoted by event**, grouped conceptually (ice, menu, staffing, logistics).

---

## Related files

- `agent-system/agents/offer-architect.md` — principles.
- `agent-system/hermes-handoff-prompt.md` — business facts and positioning guardrails.
- `agent-system/package-sheet.md` — one-page client-facing sheet (PDF / email attachment).
- `agent-system/client-quote-response-template.md` — merge quote blocks into outbound replies as needed.

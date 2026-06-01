# Full Proof Agent Automation Guide

This guide explains how to steer the recurring Codex agents without turning them into another inbox.

## Current Agent Cadence

| Agent | Cadence | Purpose |
|---|---:|---|
| General Manager | Monday morning and Friday afternoon | Set priorities, assign work, review what moved bookings forward. |
| Sales & Accounting Manager | Monday, Wednesday, Friday morning | Review lead follow-up, quote clarity, deposits, and simple money hygiene. |
| Marketing Manager | Tuesday morning | Build the weekly content and outreach sprint. |
| Website QA | Friday morning | Check site health, stale copy, pricing drift, links, forms, and deploy readiness. |

## How To Steer Them

Use short commands. The agents work best when you give them constraints, not a speech.

### General Manager

```text
Run the Full Proof General Manager. Give me the next 3 priorities, assign each to the right agent, and tell me what to ignore this week.
```

```text
I only have 90 minutes today. Triage Full Proof and pick the one task most likely to create bookings.
```

### Sales & Accounting Manager

```text
Run Sales & Accounting. Review new leads, quote/deposit clarity, and money follow-ups. Draft replies but do not send.
```

```text
Check whether this quote protects the GoBar rules and avoids giving away custom scope.
```

### Marketing Manager

```text
Run Marketing Manager. Give me three social posts for this week using existing assets, one Google Business Profile update, and one outreach angle.
```

```text
Turn this event into a post, a story caption, and a review request. Keep it premium and local.
```

### Website QA

```text
Run Site QA before deploy. Check GoBar pricing, form logic, broken assets, stale promo-code language, and mobile readability.
```

## Approval Rules

- Agents may draft, prioritize, audit, and suggest.
- Agents may edit repo docs and local website files when Joe has asked for implementation.
- Agents should not send emails, texts, invoices, calendar invites, social posts, payment links, or deployments without explicit approval.

## Social Media Example Workflow

1. Marketing Manager chooses the week's theme and 3 proof assets.
2. General Manager picks the post most likely to support bookings.
3. Joe approves or edits the caption.
4. Marketing Manager turns the same idea into Instagram, Google Business Profile, and an outreach blurb.
5. Sales & Accounting watches for replies and turns interest into a quote or date-hold step.

## Pricing Language To Protect

- Base Bartending: `$599 / 3 hours` or `$699 / 4 hours`.
- GoBar Pro: `+$100`, recommended for events up to `40` guests when presentation matters.
- GoBar Elite: `+$200`, required for `41-125` guests and optional for smaller events that want the larger luxury footprint.
- `126+` guests require manual review before instant booking.
- Premium visual/craft upgrades require GoBar Pro or Elite.
- Total Wine guidance + ice service: `+$100`; requires GoBar when ice service is included.
- 50% date-hold deposit for instant-book eligible events.

## When To Add More Access

- Add Gmail when the Sales & Accounting Manager should inspect real inquiry threads.
- Add Google Calendar when the Operations Lead should check dates and prep timelines.
- Add Google Drive when client docs, menus, or asset folders move there.
- Add Notion or Slack only if Joe wants a separate command center or notifications.

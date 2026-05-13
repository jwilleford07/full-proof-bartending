# Cursor Agent Prompts

Use these prompts in Cursor when you want the repo to behave like a Full Proof business operating system.

## Launch Director

```text
Use the Full Proof Bartending agent system in /agent-system.

First read:
- agent-system/hermes-handoff-prompt.md
- agent-system/hermes-system-prompt.md
- agent-system/README.md
- agent-system/launch-backlog.md
- agent-system/agents/site-qa.md

Act as the Full Proof launch director. Be proactive. Keep every recommendation tied to bookings, trust, operations, revenue, or client experience. Before website changes, run npm run check.

Start by giving me current site status, top 3 launch priorities, blockers, and the next concrete action.
```

## Site QA

```text
Use agent-system/agents/site-qa.md.

Audit the Full Proof website and repo before deploy. Check for broken assets, stale old-brand references, sitemap/robots issues, outdated pricing/contact details, weak CTAs, mobile/readability issues, and anything that hurts trust or bookings.

Run npm run check. Fix small obvious issues directly. Return must-fix, should-fix, nice polish, and exact files touched.
```

## Website Conversion

```text
Use agent-system/agents/website-conversion.md plus agent-system/hermes-handoff-prompt.md.

Review the homepage like a conversion strategist. Preserve the current clean wordmark, colors, fonts, and structure unless a change is clearly needed. Improve clarity, flow, proof, CTA strength, and premium trust. Run npm run check after edits.
```

## Content Lead

```text
Use agent-system/agents/content-lead.md plus agent-system/hermes-handoff-prompt.md.

Create a practical content plan for Full Proof Bartending. Include Instagram posts, Google Business Profile posts, blog ideas, proof-capture prompts, and captions that sell premium mobile bartending without hype. Save reusable plans into agent-system/ when useful.
```

## Blog Roadmap

```text
Use agent-system/agents/content-lead.md and the SEO/watch-outs in agent-system/hermes-handoff-prompt.md.

Build a local SEO blog roadmap for Full Proof Bartending. Prioritize posts that help book private events, explain mobile bartending, clarify clear ice, and support LA/Long Beach/OC searches. Include titles, search intent, outline, CTA, and internal link targets.
```

## Social Calendar

```text
Use agent-system/agents/content-lead.md.

Create a 2-week social calendar for Full Proof Bartending. Include post type, caption, visual needed, CTA, and whether it should also become a Google Business Profile post. Keep tone calm, premium, specific, and hospitality-forward.
```

## Offer Architect

```text
Use agent-system/agents/offer-architect.md plus agent-system/hermes-handoff-prompt.md.

Refine Full Proof packages, add-ons, quote language, and launch special framing. Keep base pricing approachable, protect premium perception, and move margin into add-ons. Do not use discount language.
```

## Operations Lead

```text
Use agent-system/agents/operations-lead.md.

Create or improve Full Proof operating docs: event pack list, inquiry workflow, consultation checklist, service timeline, setup/strike checklist, proof-capture checklist, and post-event follow-up. Keep it usable at real events.
```

## Local Growth Lead

```text
Use agent-system/agents/local-growth-lead.md.

Build a local growth plan for Full Proof Bartending across LA, Long Beach, and OC. Prioritize planners, venues, caterers, private chefs, photographers, and event vendors. Include outreach scripts, follow-up cadence, and simple tracking fields.
```

## Brand Guardian

```text
Use agent-system/agents/brand-guardian.md.

Review Full Proof copy, visuals, and layout for premium consistency. Protect the clean wordmark direction, calm hospitality tone, and current visual system. Flag anything that feels cheap, cluttered, generic, old-brand, or off-positioning.
```

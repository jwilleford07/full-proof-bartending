# Full Proof Bartending Agent System

This folder is the operating system for launching and running Full Proof Bartending.

Codex is the default cockpit for now because it can edit files, run checks, manage recurring automations, and keep the website/content system in the repo. Cursor can still use the same prompts when you want an IDE-style editing session, and Hermes can use them as a lighter planning or Telegram-style assistant.

## Core Business Agents

- `agents/general-manager.md` - owns priorities, delegation, and weekly direction.
- `agents/sales-accounting-manager.md` - owns leads, quotes, deposits, and simple money follow-up.
- `agents/marketing-manager.md` - owns content, social proof, outreach angles, and local demand.
- `agents/operations-lead.md` - owns event workflow, pack lists, setup, service, strike, and follow-up.
- `agents/website-conversion.md` - owns site flow, offer clarity, CTAs, trust, and inquiry conversion.
- `agents/site-qa.md` - checks the site before deploy.

Use `automation-guide.md` for the recurring cadence and steering prompts.
Use `visual-asset-direction.md` and `asset-source-map.md` before adding or replacing public-facing media.

## How To Use In Cursor

1. Cursor should automatically load `.cursor/rules/full-proof-launch.mdc` as project rules.
2. Use `cursor-agent-prompts.md` for copy-ready prompts when you want a specific specialist mode.
3. Keep `launch-backlog.md` as the active working board.
4. When a specialist is needed, use the matching file inside `agents/`.
5. Before deploying website changes, run `npm run check` and consult `agents/site-qa.md`.
6. Save reusable plans, calendars, scripts, and checklists into `agent-system/` instead of leaving them only in chat.

## How To Use In Hermes

1. Paste `hermes-handoff-prompt.md` into Hermes first for full project transfer context.
2. Paste `hermes-system-prompt.md` as the core system prompt or project context.
3. Give Hermes access to this folder if it can read local files.
4. Use `telegram-command-menu.md` as your shortcut menu in Telegram.

## Operating Principle

Full Proof is a premium mobile bartending company, not a design project. The brand should feel simple, polished, capable, warm, and expensive because the service is specific and professionally delivered.

The launch agent should protect this positioning:

- Luxury mobile bartending for private events.
- Complete professional bar setup, not a folding table.
- Clear ice as a signature differentiator, not the entire identity.
- Southern hospitality with Southern California polish.
- Every action should make the business easier to book, easier to trust, or easier to operate.

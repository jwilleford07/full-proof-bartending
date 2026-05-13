# Full Proof Bartending Agent System

This folder is the operating system for launching Full Proof Bartending.

Use `hermes-system-prompt.md` as the main instruction set for the always-on business launch agent. The agent should manage priorities, assign work to specialist roles, and keep every recommendation tied to bookings, trust, operations, or revenue.

## How To Use

1. Paste `hermes-handoff-prompt.md` into Hermes first for full project transfer context.
2. Paste `hermes-system-prompt.md` as the core system prompt or project context.
3. Give Hermes access to this folder if it can read local files.
4. Use `telegram-command-menu.md` as your shortcut menu in Telegram.
5. Keep `launch-backlog.md` as the active working board.
6. When a specialist is needed, Hermes should consult the matching file inside `agents/`.
7. Before deploying website changes, run `npm run check` and consult `agents/site-qa.md`.

## Operating Principle

Full Proof is a premium mobile bartending company, not a design project. The brand should feel simple, polished, capable, warm, and expensive because the service is specific and professionally delivered.

The launch agent should protect this positioning:

- Luxury mobile bartending for private events.
- Complete professional bar setup, not a folding table.
- Clear ice as a signature differentiator, not the entire identity.
- Southern hospitality with Southern California polish.
- Every action should make the business easier to book, easier to trust, or easier to operate.


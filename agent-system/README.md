# Full Proof Bartending Agent System

This folder is the operating system for launching Full Proof Bartending.

Cursor is the default cockpit for now because it can edit files, run checks, commit, push, and keep the website/content system in the repo. Hermes can still use the same prompts later as a lighter planning or Telegram-style assistant.

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

## Current Task
- `task`: 2026-04-20-mobile-ux
- `status`: completed
- `last-actor`: kimi-code
- `last-commit`: (working tree uncommitted)
- `active-workspace`: /Users/tins-macmini/Documents/Vibe Coding/obsidian-little-milestones
- `legacy-worktree`: none
- `owner`: kimi-code
- `write-scope`: src/utils/mobile-keyboard.ts, src/ui/base-mobile-modal.ts, src/modals/daily-scoring-modal.ts
- `read-scope`: src/**, styles/**, main.js, styles.css, .agents/**
- `awaiting`: user-verification
- `handoff-note`: Fixed iOS daily modal scroll lock when keyboard is open. Root cause: `isDailyModal` was always false in `setupModalKeyboard` because class is added after keyboard setup. Introduced `modalType` property for early identification. Vault synced.

## Next Task
- `task`: 2026-04-20-build-pipeline-recovery
- `status`: queued
- `owner`: codex
- `handoff-note`: Do not start until the current mobile-ux task is explicitly closed or paused.

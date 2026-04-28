## Current Task
- `task`: 2026-04-20-mobile-ux
- `status`: completed
- `last-actor`: codex
- `last-commit`: dba5544
- `active-workspace`: /Users/tins-macmini/Documents/Vibe Coding/obsidian-little-milestones
- `legacy-worktree`: none
- `owner`: codex
- `write-scope`: none
- `read-scope`: src/**, styles/**, main.js, styles.css, .agents/**
- `awaiting`: none
- `handoff-note`: Fixed iOS daily modal scroll lock when keyboard is open. Root cause: `isDailyModal` was always false in `setupModalKeyboard` because class is added after keyboard setup. Introduced `modalType` property for early identification. Vault synced. Codex completed a read-only comprehensive review on 2026-04-25 and recorded 5 follow-up findings in `.agents/reviews/2026-04-25-codex-comprehensive-review.md`. On 2026-04-25 Codex also shipped debug-mode fixes for overlay history stack collisions, settings drag reorder insert math, and daily modal pending diary merge (`??` instead of `||`), then rebuilt + deployed to Vault; debug instrumentation cleanup completed on 2026-04-27 after user verification; rebuilt and synced to Vault. Removed machine-local Claude hook settings by deleting `.claude/settings.local.json` (hygiene-only; see `last-commit`).

## Next Task
- `task`: 2026-04-20-build-pipeline-recovery
- `status`: queued
- `owner`: codex
- `handoff-note`: Do not start until the current mobile-ux task is explicitly closed or paused.

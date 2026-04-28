## Current Task
- `task`: 2026-04-20-mobile-ux
- `status`: completed
- `last-actor`: codex
- `last-commit`: (working tree uncommitted)
- `active-workspace`: /Users/tins-macmini/Documents/Vibe Coding/obsidian-little-milestones
- `legacy-worktree`: none
- `owner`: codex
- `write-scope`: src/modals/daily-scoring-modal.ts, src/modals/popups/calendar-picker.ts, src/ui/emoji-picker.ts, src/settings/item-settings-list.ts, src/settings/category-settings-list.ts
- `read-scope`: src/**, styles/**, main.js, styles.css, .agents/**
- `awaiting`: user-verification
- `handoff-note`: Fixed iOS daily modal scroll lock when keyboard is open. Root cause: `isDailyModal` was always false in `setupModalKeyboard` because class is added after keyboard setup. Introduced `modalType` property for early identification. Vault synced. Codex completed a read-only comprehensive review on 2026-04-25 and recorded 5 follow-up findings in `.agents/reviews/2026-04-25-codex-comprehensive-review.md`. On 2026-04-25 Codex also shipped debug-mode fixes for overlay history stack collisions, settings drag reorder insert math, and daily modal pending diary merge (`??` instead of `||`), then rebuilt + deployed to Vault; debug instrumentation cleanup completed on 2026-04-27 after user verification; rebuilt and synced to Vault.

## Next Task
- `task`: 2026-04-20-build-pipeline-recovery
- `status`: queued
- `owner`: codex
- `handoff-note`: Do not start until the current mobile-ux task is explicitly closed or paused.

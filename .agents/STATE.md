## Current Task
- `task`: 2026-04-20-mobile-ux
- `status`: awaiting-user-validation
- `last-actor`: codex
- `last-commit`: 193c96f (.agents scaffolding) / 226bc86 (mobile UX fix) / 937a838 (STATE + log) / 502bd80 (refactor plugin structure) / 7810df3 (split settings sections) / 7f20e12 (polish mobile diary) / d782694 (tighten collaboration rules) / d97cb35 (kimi review) / 0a7abd9 (kimi implementation fixes) / 670d08e (kimi scoring-page fixes) / 9a17ded (settings touch-guard fix) / ccb8d2e (date-nav simplification) / pending codex keyboard-and-scroll follow-up
- `active-workspace`: /Users/tins-macmini/Documents/Vibe Coding/obsidian-little-milestones
- `legacy-worktree`: none (old claude worktree removed on 2026-04-22)
- `write-scope`: none
- `read-scope`: main.js, styles.css, .agents/**
- `awaiting`: user
- `handoff-note`: **Role redefinition per user request**: codex is the sole implementation agent for this plugin. `claude-code` and `kimi-code` are review-only by default and may suggest fixes, but they should not edit plugin code unless the user explicitly authorizes that exception and the exception is recorded here first. Codex followed up on iPhone UX again: keyboard avoidance now aligns edit-card bottom to the visual viewport edge instead of using a rough lift, manual card drag now keeps full top/bottom reach without fixed snap points, settings item-list rerenders preserve scroll position on add/delete, and rebuilt artifacts were re-synced to Vault with hash verification. Next: user validates on real devices; any further fixes should be assigned to codex for implementation, then other AIs may review.

## Next Task
- `task`: 2026-04-20-build-pipeline-recovery
- `status`: queued
- `owner`: codex
- `handoff-note`: Do not start until the current mobile-ux task is explicitly closed or paused. If review is desired, other AIs should stay read-only and provide review notes only.

# Review: 2026-04-25 comprehensive plugin review

## Reviewer
- `agent`: codex
- `date`: 2026-04-25 10:25
- `target-task`: 2026-04-20-mobile-ux
- `status`: issues-found

## Findings
- `id`: R1
- `severity`: high
- `summary`: `DailyScoringModal` can resurrect cleared diary text during rerender
- `details`: `renderModal()` restores in-memory unsaved state via `pendingRenderState`, but it uses `pendingState?.diaryContent || state.diaryContent`. An intentionally cleared diary (`""`) is falsy, so any rerender triggered by module edits falls back to the last saved file content and brings deleted text back. This is a real data-loss / stale-state risk in the main mobile workflow.
- `suggested-fix`: Replace the `||` fallback with an explicit nullish check so empty strings remain valid unsaved state, and audit the same pattern for other user-editable fields.
- `resolved`: no

- `id`: R2
- `severity`: medium
- `summary`: Weekly/monthly goal progress in stats uses score totals instead of completed item counts
- `details`: `renderGoalCard()` accumulates `calcCompleted(currentUser.items, day)`, but `calcCompleted()` currently returns `day.total`. That makes week/month goal progress depend on points configuration rather than completed items, while the daily goal callout and surrounding UI speak in terms of completed items. Users with high-value items can appear to "finish" goals without matching the intended count semantics.
- `suggested-fix`: Make `calcCompleted()` count completed items with the same rule set used by `earnedCount` / `isItemDone`, then confirm that daily, weekly, and monthly goal wording all reflect the same metric.
- `resolved`: no

- `id`: R3
- `severity`: medium
- `summary`: Platform detection is inconsistent for modern iPadOS desktop-class user agents
- `details`: `getMobilePlatform()` and `isIOS()` treat `Macintosh + maxTouchPoints > 1` as iOS, but `getPlatformKey()` does not. Any logic keyed off `detectPlatformKey()` therefore classifies the same device as `mac`, not `ios`; today that mainly affects double-tap thresholds, but the split platform model is brittle and invites more cross-device drift.
- `suggested-fix`: Centralize the iPadOS disguised-as-Mac rule in one shared helper and make `getPlatformKey()` derive from the same decision path as `getMobilePlatform()`.
- `resolved`: no

- `id`: R4
- `severity`: medium
- `summary`: Mobile modal behavior is split between CSS and runtime style mutation
- `details`: `styles/07-mobile.css` declares core scroll/layout behavior for `.little-milestones-modal` and `.modal-content`, while `setupModalKeyboard()` later rewrites many of the same properties (`display`, `overflow`, `height`, `flex`, `paddingBottom`, `webkitOverflowScrolling`) at runtime. The plugin currently builds and type-checks cleanly, but this duplication makes keyboard/scroll regressions hard to predict and explains why mobile fixes have required many narrow follow-up passes.
- `suggested-fix`: Define a clearer contract: keep baseline structure in CSS, move keyboard-mode overrides behind dedicated classes or a smaller style surface, and avoid having both CSS and JS own the same layout primitives.
- `resolved`: no

- `id`: R5
- `severity`: low
- `summary`: Item drag-sort cannot drop an item at the very end of the list
- `details`: `getDragRowIndex()` can return `dragState.rows.length`, but `onDragEnd()` only applies the move when `targetIdx < arr.length`. Dragging below the last row therefore falls into the no-op branch and silently snaps back, which is a small but noticeable UX paper cut in settings.
- `suggested-fix`: Allow `targetIdx === arr.length` and insert at the array tail after removing the source row.
- `resolved`: no

## Conclusion
- The codebase has a better structure than the historical task log suggests: `src/**` is now reasonably modular, `main.ts` is thin, and the settings / modal shell split is moving in the right direction.
- It is not a "stop ship" codebase overall, but the stale diary-state restore bug should be fixed before more mobile UX work piles on top, and the stats goal metric mismatch should be resolved before users rely on those numbers.

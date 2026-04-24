# Kimi Implementation Handoff: Little Milestones Optimization Notes

## Context

Codex token budget is nearly exhausted. The user explicitly authorizes `kimi-code` to take over implementation work after this handoff.

Kimi may write plugin code for this handoff **only after**:
- running `git status --short`
- reading `.agents/README.md`, `.agents/AGENT_RULES.md`, `.agents/STATE.md`, the active task card, and `.agents/LOCK.md`
- taking the write lock in `.agents/LOCK.md`
- declaring a precise `write-scope`

Prefer source files under `src/**` and `styles/**`. If styles change, rebuild `styles.css`. If runtime changes are ready for user testing, sync `manifest.json`, `main.js`, and `styles.css` to the Vault from the primary workspace and verify with `diff`.

## Current State Summary

The current working tree contains a batch of mobile UX changes already built and synced to the Vault:
- iOS keyboard avoidance improvements for score edit modals and diary free-write
- mobile add/edit item form first-row compaction
- mobile score-card status marker moved left
- mobile save/stats buttons aligned in one row
- inline diary module editing, adding, deleting
- diary module delete/reset confirmation

Current modified files are expected and should not be reverted. Kimi should build on them.

## Highest-Value Optimization Targets

### 1. Stabilize `src/utils/mobile-keyboard.ts`

Severity: high  
Risk: medium  
Why: This file has become the most fragile part of the mobile UX. It mixes visualViewport tracking, modal layout mutation, scroll targeting, edit-modal behavior, daily-modal behavior, fallback timers, manual drag interaction, and cleanup restoration.

Suggested approach:
- Extract a small helper for keyboard mode detection:
  - `getKeyboardHeight()`
  - `hasFocusedModalField()`
  - `isKeyboardMode()`
- Extract scroll target logic:
  - normal input target
  - diary textarea target that also includes bottom actions
- Avoid adding more special cases inline inside `applyLayout()`.
- Keep behavior unchanged first; refactor only after taking snapshots or doing manual checks.

Suggested write-scope:
- `src/utils/mobile-keyboard.ts`
- maybe `src/utils/mobile-keyboard-targets.ts` if extracting helpers

Acceptance:
- `npx tsc --noEmit`
- iPhone: score item value input does not jump downward
- iPhone: score item note textarea can show confirm/save controls
- iPhone: diary free-write textarea can show bottom save/stat actions above keyboard

### 2. Unify Confirmation UX

Severity: high  
Risk: low-medium  
Why: Deletion confirmation currently uses scattered `confirm(...)` calls and one custom user-delete modal. Browser-native confirm is blunt on mobile and inconsistent with the plugin UI.

Places to inspect:
- `src/modals/daily-scoring-modal.ts` temporary item deletion
- `src/modals/popups/score-item-modal.ts` score item deletion
- `src/settings/item-settings-list.ts` score item deletion
- `src/settings/category-settings-list.ts` category deletion
- `src/settings/diary-module-settings.ts` diary module deletion/reset
- `src/settings/user-settings-section.ts` user deletion and path/name migration confirmations

Suggested approach:
- Create a small reusable confirmation modal:
  - title
  - message
  - confirm text
  - cancel text
  - destructive style option
- Replace simple `confirm(...)` calls gradually.
- Keep the strong typed confirmation for deleting a user if desired, but consider routing it through the same modal shell.

Suggested write-scope:
- `src/ui/confirm-modal.ts`
- the specific deletion call sites above
- `styles/02-popups.css` or a new style module if needed

Acceptance:
- Every deletion path prompts before deleting.
- Mobile confirmation is readable and tappable.
- Desktop confirmation still works.

### 3. Extract Inline Diary Module Editor

Severity: medium-high  
Risk: medium  
Why: Similar diary module editing UI now exists in both `打分页 -> 日记` and `设置页 -> 日记模块`. This is good for user convenience, but duplicated behavior can drift.

Places:
- `src/modals/panels/diary-panel-fields.ts`
- `src/settings/diary-module-settings.ts`

Suggested approach:
- Extract a shared module editor row/card builder that accepts:
  - `moduleDef`
  - `onEmojiChange`
  - `onLabelChange`
  - `onPlaceholderChange`
  - `onDelete`
  - layout mode or class prefix
- Keep page-specific containers and descriptions separate.

Suggested write-scope:
- `src/ui/diary-module-editor.ts` or `src/diary/module-editor.ts`
- `src/modals/panels/diary-panel-fields.ts`
- `src/settings/diary-module-settings.ts`

Acceptance:
- Settings page and scoring page both edit the same module fields.
- Weather/mood emoji customization works in both places.
- Adding/deleting modules still refreshes the visible UI.

### 4. Reduce `DailyScoringModal` Responsibilities

Severity: medium  
Risk: medium-high  
Why: `src/modals/daily-scoring-modal.ts` still coordinates rendering, state loading, scoring, custom items, diary, attachments, stats, date navigation, and save flow. It is smaller than before but remains a central risk.

Suggested approach:
- Do not do a large rewrite in one pass.
- Extract only one seam at a time:
  - diary module mutation handlers
  - custom item handlers
  - date navigation render callbacks
- Keep public modal behavior identical.

Suggested write-scope for first pass:
- `src/modals/helpers/daily-diary-module-actions.ts`
- `src/modals/daily-scoring-modal.ts`

Acceptance:
- `npx tsc --noEmit`
- Add/edit/delete diary modules still works.
- Unsaved state remains preserved across diary module refresh.

### 5. Mobile CSS Structure Cleanup

Severity: medium  
Risk: medium  
Why: `styles/07-mobile.css` is now the hot path for most iPhone fixes and has accumulated many component-specific overrides. It is still workable, but future changes will get harder.

Suggested approach:
- Do not split everything immediately.
- Add section comments and group by page/component:
  - modal shell
  - score cards
  - bottom actions
  - edit/add item forms
  - diary modules
  - settings page
  - stats/calendar
- If splitting files, update `esbuild.config.mjs` style module list and rebuild.

Suggested write-scope:
- `styles/07-mobile.css`
- optionally new files under `styles/mobile/**` only if build config is updated carefully

Acceptance:
- `npm run build`
- `styles.css` includes all mobile rules.
- No mobile layout regression in score card, edit modal, diary tab, settings page.

### 6. Better Handling For Preview/Bottom Actions

Severity: medium  
Risk: low-medium  
Why: Mobile bottom actions currently depend on CSS state like `.is-preview-mode`, while preview button is hidden by inline style from `diary-panel.ts`. This works, but the ownership is split.

Places:
- `src/modals/panels/mobile-modal-chrome.ts`
- `src/modals/panels/diary-panel.ts`
- `styles/07-mobile.css`

Suggested approach:
- Make button visibility a layout-level responsibility:
  - score tab: save + stats
  - diary edit mode: save + stats, inline preview lives near free-write header
  - diary preview mode: confirm save + maybe disabled/muted stats
- Avoid mixing inline `style.display = "none"` with CSS grid layout where possible.

Acceptance:
- Mobile score tab bottom buttons remain one row.
- Diary tab preview still works.
- Desktop behavior unchanged.

## Suggested Implementation Order

1. Commit current Codex changes if user wants a checkpoint before Kimi edits.
2. Kimi first validates current Vault-synced behavior on iPhone.
3. Kimi implements Target 2 (confirmation modal) or Target 1 (keyboard stabilization) first.
4. After each implementation pass:
   - `npm run build`
   - `npx tsc --noEmit`
   - sync to Vault only if user wants immediate phone testing
   - update `.agents/STATE.md`, `.agents/LOCK.md`, task card, and `.agents/log.md`

## Guardrails For Kimi

- Do not revert Codex's current uncommitted mobile changes.
- Do not hand-edit `main.js` or `styles.css`; rebuild them from source.
- Avoid broad refactors until current mobile UX is stable on iPhone.
- Prefer small commits with `[kimi]` prefix.
- If a behavior is uncertain, write a review note instead of guessing.


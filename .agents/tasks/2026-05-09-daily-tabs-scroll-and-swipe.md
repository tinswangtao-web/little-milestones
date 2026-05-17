# 2026-05-09 Daily Tabs Scroll And Swipe

## Goal
- Keep the scoring modal top tabs (`打分` / `日记`) as normal scrolling content, not sticky or fixed, on desktop and mobile.
- Add mobile horizontal swipe switching between `打分` and `日记` without losing already-entered score or diary content.
- Confirm the plugin-name sorting approach for Obsidian's third-party plugin list without changing `manifest.json`.

## Scope
- `src/modals/daily-scoring-modal.ts`
- `src/modals/panels/modal-chrome.ts`
- `styles/04-diary.css`
- `styles/07-mobile.css`
- generated build outputs if changed (`main.js`, `styles.css`)
- `.agents/**`

## Out Of Scope
- Do not mix this into `2026-05-09-diary-module-order-presets-mobile-settings`.
- Do not modify `manifest.json` or the plugin display name in this round.
- Do not alter diary weather/mood preset migration, layout, or storage behavior except where required by build integration.

## Requirements
- Desktop and mobile `打分` / `日记` tabs scroll away with page content.
- Mobile users can swipe horizontally to switch between tabs.
- Swipe switching preserves score selections, custom item values, notes, weather, mood, small records, free record, and comments.
- Gesture should trigger only on clearly horizontal swipes where horizontal movement is greater than vertical movement.
- Horizontal drag beginning inside inputs, textareas, selects, buttons, or editable content should not trigger tab switching.
- Plugin sorting research must explain whether a name prefix can improve list position and the risks, but make no name change.

## Rollback Note
- Revert the swipe handler and mobile tab positioning CSS changes to restore click-only tabs and sticky mobile tabs.
- `manifest.json` is intentionally untouched, so no plugin-name rollback is needed.

## Verification
- [x] Desktop scoring modal scroll: tabs have no desktop sticky/fixed rule in this task's CSS/code path.
- [x] Mobile scoring modal scroll: removed sticky positioning from `.little-milestones-main-tabs` / `.little-milestones-main-tabs-mobile`.
- [x] Mobile horizontal swipe switches `打分` / `日记` through the existing tab button handlers.
- [x] Switching tabs by swipe preserves entered score and diary state by reusing the current in-memory modal state and existing `syncDiaryContent()` tab-switch path.
- [x] Horizontal activity inside inputs/textareas/selects/contenteditable starts ignored by the swipe handler.
- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `node --check main.js`
- [x] `git diff --check` (pass; existing `src/constants.ts` EOL warning only)

## Status
- `user-verified-complete-awaiting-commit-authorization`

## Notes
- `manifest.json` plugin name was not changed.
- Official docs confirm `manifest.json` `name` is the display name. Official docs/release repo confirm community plugin metadata also has a `name` field and uses `name`, `author`, and `description` for searching, but I did not find an official public statement that the installed third-party plugin settings list is guaranteed to sort by manifest `name`.
- Practical recommendation: if Obsidian's current UI sorts installed plugins by display name, a leading emoji/symbol may move the plugin earlier depending on platform collation; this should be hand-tested after a deliberate rename request because it changes the visible plugin name and may create marketplace/recognition consistency risk.
- 2026-05-09 20:12 +0800：Cursor review 通过，未发现 P0/P1。确认移动端 tab sticky CSS 已移除、左右滑手势有输入/按钮/contenteditable 起手保护并走既有 tab handler、`manifest.json` 未改名；Cursor 重跑 `npx tsc --noEmit`、`npm run build`、`node --check main.js`、`git diff --check` 通过，仅有 `src/constants.ts` 既有 EOL warning。等待用户验收或明确授权 Vault sync。
- 2026-05-09 20:22 +0800：用户明确要求同步到 Vault 实测。已执行 `npm run deploy`，输出 `MATCH main.js 9504eb17353f`、`MATCH styles.css 730907b4e1a9`、`MATCH manifest.json e82c7257a300`。等待用户实测；无 commit 授权。
- 2026-05-09 20:31 +0800：用户再次要求同步到 Vault 验证。已重新执行 `npm run deploy`，MATCH hash 不变：`main.js 9504eb17353f`、`styles.css 730907b4e1a9`、`manifest.json e82c7257a300`。等待用户实测；无 commit 授权。
- 2026-05-09 20:49 +0800：用户反馈“已验证通过。完成本轮任务。”本任务标记为用户验收完成，等待明确 commit 授权；当前不提交。

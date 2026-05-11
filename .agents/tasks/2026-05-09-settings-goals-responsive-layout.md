# 2026-05-09 Settings Goals Responsive Layout

## Goal
- Fix the desktop settings page `每日目标` module so daily / weekly / monthly goal inputs do not overflow horizontally when the settings pane is narrow.
- Keep the normal desktop layout as one row of three columns when there is enough width.
- Let the goal input cells wrap to two columns or one column at narrow widths.
- Follow-up in same task per user request: improve mobile 打分页 spacing around `＋ 添加临时加减分` and the first category/card below it.
- Follow-up in same task per user request: move the sprout emoji to the front of the plugin display name and change the left ribbon icon from a star to a plant/sprout style.
- Follow-up in same task per user request: try making only the Little Milestones left ribbon icon green.
- Follow-up in same task per user request: improve mobile 打分页 category title row add-button spacing above the first score-card row.

## Scope
- `manifest.json`
- `src/main.ts`
- generated `main.js`
- `styles/00-base.css`
- `styles/06-settings.css`
- `styles/07-mobile.css`
- generated `styles.css`
- `.agents/**`

## Out Of Scope
- Do not mix this into `2026-05-09-daily-tabs-scroll-and-swipe`.
- Do not change goal data structure, normalization, save logic, or TypeScript settings code unless CSS alone cannot solve the issue.
- Do not intentionally alter mobile settings layout.
- Do not alter desktop 打分页 layout or temporary adjustment add logic.
- Do not change plugin `id` or version.
- Do not affect other Obsidian ribbon icons.

## Requirements
- Desktop settings page normal width: `每日目标` displays normally.
- Desktop settings page narrow width: no horizontal overflow; goal cells wrap responsively.
- Labels and inputs remain readable, clickable, and editable.
- Mobile settings page does not regress.
- If another same-pattern fixed three-column settings card causes the same overflow, it may be fixed with the same layout pattern only.
- Mobile 打分页 `＋ 添加临时加减分` should have balanced spacing before the next category title/card without taking excessive vertical space.
- Multiple category title spacing should remain stable.
- `manifest.json` `name` should be `🌱 Little Milestones`.
- `manifest.json` `id` should remain `little-milestones`.
- Left sidebar ribbon icon should no longer use the five-point star; use a stable plant/sprout/leaf style icon and keep click behavior opening 打分页.
- Ribbon hover tooltip should also be `🌱 Little Milestones`.
- Only the Little Milestones ribbon icon should be green; other ribbon icons keep theme defaults.
- Ribbon hover/active should stay natural and use a slightly deeper green.
- Mobile 打分页 category title row `+` add-item button should not visually press into the score-card grid below.
- Multiple categories should keep consistent title/add-button/grid spacing.

## Rollback Note
- Revert the `.kid-score-goals-grid` / `.kid-score-goal-cell` / `.kid-score-goal-input` CSS changes, the mobile-only custom-section spacing rules, the mobile category-header spacing rule, the `manifest.json` name change, the `src/main.ts` ribbon icon id/class change, and the `.little-milestones-ribbon-icon` CSS, then rebuild `main.js` / `styles.css`.

## Verification
- [x] Desktop normal width layout remains one row when space allows by using `auto-fit` over the three existing cells.
- [x] Desktop narrow width layout wraps to two columns or one column without fixed three-column overflow.
- [x] Mobile settings page `每日目标` keeps existing one-column override in `styles/07-mobile.css`.
- [x] Mobile 打分页 `＋ 添加临时加减分` has a mobile-only bottom section gap before the next category.
- [x] Desktop 打分页 `＋ 添加临时加减分` base layout is untouched.
- [x] Multiple category spacing rules are untouched; only the mobile custom section gap was changed.
- [x] Mobile 打分页 category title row `+` add-item button has mobile-only spacing before the score-card grid.
- [x] Multiple categories use the same mobile category header spacing rule.
- [x] Desktop category header/grid base layout is untouched.
- [x] `manifest.json` name is `🌱 Little Milestones`.
- [x] `manifest.json` id remains `little-milestones`.
- [x] `manifest.json` version remains unchanged at `2.0.0`.
- [x] Ribbon icon id changed from `star` to Obsidian/Lucide `sprout`; click callback still opens 打分页.
- [x] Ribbon hover tooltip changed to `🌱 Little Milestones`.
- [x] Confirmed `addRibbonIcon()` returns `HTMLElement`; added `little-milestones-ribbon-icon` class to the returned element.
- [x] `styles.css` includes scoped green ribbon styles for `.little-milestones-ribbon-icon`.
- [x] CSS targets only the custom class and does not use global ribbon icon selectors or `!important`.
- [x] `npm run build` did not overwrite `manifest.json` name.
- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `node --check main.js`
- [x] `git diff --check` (pass; existing `manifest.json`, `src/constants.ts`, and `styles/00-base.css` EOL warnings only)

## Status
- `user-verified-complete-committing`

## Notes
- 2026-05-09 20:58 +0800：Implemented CSS-only responsive goals grid fix. No settings data structure or save logic changed. `styles.css` regenerated. Awaiting Cursor review; no Vault sync or commit authorized.
- 2026-05-09 20:56 +0800：Appended user-requested mobile 打分页 spacing fix in same task. Added mobile-only custom section bottom gap and removed mobile button bottom margin stacking. No temporary adjustment logic or desktop daily scoring layout changed. Rebuilt `styles.css`; checks passed again.
- 2026-05-09 20:58 +0800：User explicitly authorized plugin display name change. Updated `manifest.json` name to `🌱 Little Milestones`, kept id/version unchanged, and changed ribbon icon id from `star` to `sprout` while preserving the click callback. Sorting risk documented in review card. Build/checks passed; Vault sync not run yet.
- 2026-05-09 21:10 +0800：Cursor review 通过，未发现 P0/P1。确认目标 grid 自适应、移动端临时事项间距为 mobile-only、`manifest.json` name/id/version 符合要求、`main.js`/`src/main.ts` 使用 `addRibbonIcon("sprout", ...)` 且点击回调不变；Cursor 重跑 `npx tsc --noEmit`、`npm run build`、`node --check main.js`、`git diff --check` 通过，仅有 `manifest.json` / `src/constants.ts` 既有 EOL warning。等待用户验收或明确授权 Vault sync。
- 2026-05-09 21:31 +0800：修复非阻塞 tooltip 文案，`addRibbonIcon("sprout", "🌱 Little Milestones", ...)` 已同步到 `main.js`。按用户要求执行 `npm run deploy` 同步 Vault，MATCH：`main.js f72160cca64b`、`styles.css 9301faa15d0f`、`manifest.json e2456f26890b`。Vault manifest 校验为 `🌱 Little Milestones` / `little-milestones` / `2.0.0`。等待用户验证；无 commit 授权。
- 2026-05-09 21:49 +0800：尝试绿色 ribbon 图标。确认 `addRibbonIcon()` 返回 `HTMLElement`，给 Little Milestones ribbon 元素加 `little-milestones-ribbon-icon` class，并在 `styles/00-base.css` 中用该 class 设置 normal `#22c55e`、hover/active `#16a34a`；未使用全局 ribbon selector 或 `!important`。Build/typecheck/node-check/diff-check 通过；等待 review/实测，未同步 Vault，未 commit。
- 2026-05-09 21:54 +0800：Cursor review 通过后，用户要求同步 Vault 验证绿色 ribbon。已执行 `npm run deploy`，MATCH：`main.js 44358ad564f7`、`styles.css fca2f3a4cfc5`、`manifest.json e2456f26890b`。Vault `styles.css` 确认包含 `.little-milestones-ribbon-icon` 与 `#22c55e` / `#16a34a`，Vault `main.js` 确认添加 class，Vault manifest 仍为 `🌱 Little Milestones` / `little-milestones` / `2.0.0`。等待用户验证；无 commit 授权。
- 2026-05-09 21:51 +0800：Cursor review 通过，未发现 P0/P1。确认绿色样式只作用于 `little-milestones-ribbon-icon` 自定义 class，不使用全局 ribbon 选择器或 `!important`，`main.js`/`styles.css` 均包含改动；Cursor 重跑 `npx tsc --noEmit`、`npm run build`、`node --check main.js`、`git diff --check` 通过，仅有 `manifest.json` / `src/constants.ts` / `styles/00-base.css` 既有 EOL warning。等待用户验收或明确授权 Vault sync。
- 2026-05-09 22:11 +0800：Cursor review 通过，未发现 P0/P1。确认移动端分类标题行右侧 `+` 新增打分项按钮间距修复只改 `styles/07-mobile.css` 的 `.kid-score-cat-header-mobile` / `.kid-score-cat-action-host-mobile`，不改桌面布局或新增打分项逻辑；`styles.css` 已包含对应规则。Cursor 重跑 `npx tsc --noEmit`、`npm run build`、`node --check main.js`、`git diff --check` 通过，仅有 `manifest.json` / `src/constants.ts` / `styles/00-base.css` 既有 EOL warning。等待用户验收或明确授权 Vault sync。
- 2026-05-09 22:00 +0800：追加修复移动端分类标题行右侧 `+` 新增打分项按钮和下方第一行卡片贴太近的问题。仅在 `styles/07-mobile.css` 为 `.kid-score-cat-header-mobile` 增加 `margin-bottom: 10px`，为 `.kid-score-cat-action-host-mobile` 增加 `padding-bottom: 2px`；不改桌面端布局和新增打分项逻辑。Build/typecheck/node-check/diff-check 通过；等待 review，未同步 Vault，未 commit。
- 2026-05-09 22:16 +0800：Cursor review 通过后，用户要求同步 Vault 验证移动端分类 `+` 按钮间距。已执行 `npm run deploy`，MATCH：`main.js 44358ad564f7`、`styles.css c0f5c6ca1bf5`、`manifest.json e2456f26890b`。Vault `styles.css` 确认包含 `.kid-score-cat-header-mobile { margin-bottom: 10px; }`、`.kid-score-cat-action-host-mobile { padding-bottom: 2px; }`，且保留 `.kid-score-custom-section-mobile` 间距修复。等待用户验证；无 commit 授权。
- 2026-05-11：用户确认第 3 组验收通过并明确授权 commit；本次只提交本任务相关改动，不 push。

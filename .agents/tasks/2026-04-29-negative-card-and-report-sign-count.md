# 负分卡片样式统一 + 得分页正负项计数口径

- **slug**: 2026-04-29-negative-card-and-report-sign-count
- **created**: 2026-04-29
- **owner**: codex
- **status**: committed
- **origin**: user follow-up after post-vault regression round
- **sync-to-vault**: completed; awaiting user retest
- **write-scope**: `src/modals/panels/score-items-panel.ts`, `src/composers/day-data-composer.ts`, `src/renderers/report-sections.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `styles/**`, `main.js`, `.agents/**`

## 用户需求

请按我们协作规则执行：Cursor 只 review，不改代码。你现在先接管并修复 Cursor 误改造成的工作区脏改动。

目标：
1. 先把本轮 Cursor 误改的源码和产物恢复到你上一次正确基线（不要影响我之前已确认通过的功能）。
2. 然后仅按我最新需求重新实现（你来改代码）：
   - 打分页：所有 scoreVal < 0 的卡片，视觉统一为与减分项选中一致（浅红填充 + 红圈）。
   - 得分页：汇总不写“加分项/减分项”，改为“加了分的项/减了分的项”，且计数按实际得分正负统计（>0 / <0）。

## 实现

- 已先将本轮 Cursor 误改过的 `src/modals/panels/score-items-panel.ts`、`src/composers/day-data-composer.ts`、`src/renderers/report-sections.ts`、`main.js` 恢复到上一正确提交基线 `5f674db`，再由 Codex 重新实现本轮需求。
- `src/modals/panels/score-items-panel.ts`
  - `is-deducted-active` 改为按 `scoreVal < 0` 触发，确保任意负分卡片都使用同一激活样式（含红圈）。
- `src/composers/day-data-composer.ts`
  - `positiveCount` / `negativeCount` 改为按实际得分正负统计：
    - `val > 0` 计入加了分的项；
    - `val < 0` 计入减了分的项。
  - `earnedCount` / `missedCount` 保持上一正确基线逻辑，避免改变完成率等非本轮需求口径。
- `src/renderers/report-sections.ts`
  - 汇总文案改为：
    - `➕ 加了分的项：X 项`
    - `➖ 减了分的项：Y 项`
- 运行 `npm run build` 生成并同步更新 `main.js`。

## 验证

- [x] `npm run build`
- [x] `npx tsc --noEmit`
- [x] `node --check main.js`
- [x] `git diff --check`
- [x] 用户 Obsidian/Vault 体验复测

## Codex 执行记录

- 2026-04-29 14:34 CST：用户要求 Codex 接管并修复 Cursor 误改；Codex 获取写锁，先恢复本轮 Cursor 源码/产物改动到 `5f674db`，再重新实现负分视觉和得分页正负计数；`npm run build`、`npx tsc --noEmit`、`node --check main.js` 通过；未提交，未同步 Vault。
- 2026-04-29 14:42 CST：Cursor review 结论可发布、低风险、无阻塞；用户授权同步 Vault。Codex 执行 `npm run deploy`，同步并校验 `main.js`、`styles.css`、`manifest.json` 全部 MATCH：`main.js 3d16357fd93f`、`styles.css db81e41e0927`、`manifest.json e82c7257a300`。等待用户 Vault 实测；未提交。
- 2026-04-29 14:47 CST：用户反馈 Vault 测试成功，并明确授权 commit；Codex 准备提交本轮改动。

# Codex -> Cursor Review Card

Cursor 请只 review，不要改代码。请直接读取当前 working-tree diff 和本卡内容进行严格 review。当前没有 commit，也没有 Vault sync。

## 1) 本轮目标（用户原话）

请按我们协作规则执行：Cursor 只 review，不改代码。你现在先接管并修复 Cursor 误改造成的工作区脏改动。

目标：
1. 先把本轮 Cursor 误改的源码和产物恢复到你上一次正确基线（不要影响我之前已确认通过的功能）。
2. 然后仅按我最新需求重新实现（你来改代码）：
   - 打分页：所有 scoreVal < 0 的卡片，视觉统一为与减分项选中一致（浅红填充 + 红圈）。
   - 得分页：汇总不写“加分项/减分项”，改为“加了分的项/减了分的项”，且计数按实际得分正负统计（>0 / <0）。

## 2) 改动文件清单

- `src/modals/panels/score-items-panel.ts`
- `src/composers/day-data-composer.ts`
- `src/renderers/report-sections.ts`
- `main.js`（`npm run build` 生成）
- `.agents/STATE.md`
- `.agents/LOCK.md`
- `.agents/log.md`
- `.agents/tasks/2026-04-29-negative-card-and-report-sign-count.md`
- `.agents/reviews/CODEX_TO_CURSOR_REVIEW_CARD.md`

## 3) 关键行为变化（用户可见）

- 已先把本轮 Cursor 对源码和产物的误改恢复到上一正确提交基线 `5f674db`，再由 Codex 重新实现本轮需求。
- 打分页中，任意卡片只要实际得分 `scoreVal < 0`，都会应用 `is-deducted-active`，视觉统一为浅红填充 + 红圈。
- 得分页今日汇总文案从“加分项 / 减分项”改为“加了分的项 / 减了分的项”。
- 得分页的正负项计数按实际基础打分项得分统计：
  - `val > 0` 计入“加了分的项”
  - `val < 0` 计入“减了分的项”
- `earnedCount` / `missedCount` 保持上一正确基线逻辑，避免本轮顺手改变完成率等其他口径。

## 4) 已执行验证（build/typecheck/手测）

- `npm run build`：通过。
- `npx tsc --noEmit`：通过。
- `node --check main.js`：通过。
- `git diff --check`：通过。
- 手测：未在 Obsidian 内完成，等待用户验收。

## 5) 已知风险与待确认点

- 本轮改了 renderer，按协议请求严格 review。
- “负分统一视觉”会让非减分类但被手动调为负分的卡片也出现红圈，这是用户明确要求。
- 得分页正负项数仅统计基础打分项；临时事项仍在单独“临时事项”行展示。
- 本轮没有同步 Vault；用户未授权同步。

## 6) 是否请求 Cursor 严格review

是。

原因：
- 涉及 `src/renderers/report-sections.ts`。
- 本轮目标包含恢复 Cursor 误改后的重新实现，需要确认没有把误改残留带入。

## 7) 建议用户验收步骤（2-4步）

1. 在打分页把一个非减分类项目调成负分，确认卡片显示浅红填充 + 红圈。
2. 确认普通未打分减分项仍是灰色，不会因为默认分值为负而发红。
3. 生成得分页，确认今日汇总显示“加了分的项 / 减了分的项”。
4. 用正分、负分、0 分混合检查计数，确认只按实际 `>0 / <0` 统计。

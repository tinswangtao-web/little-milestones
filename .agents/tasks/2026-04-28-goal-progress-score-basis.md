# Goal progress score basis

- **slug**: 2026-04-28-goal-progress-score-basis
- **owner**: codex
- **created**: 2026-04-28
- **status**: awaiting-user-verification
- **sync-to-vault**: pending
- **write-scope**: `src/modals/helpers/daily-total-display.ts`, `src/modals/panels/stats-panel.ts`, `src/renderers/report-sections.ts`, `src/settings/goal-settings-section.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `styles/**`, `main.js`, `.agents/**`
- **origin**: user request after score-card color logic

## 用户需求

- 统一“目标/进度”统计口径为最终得分 `total`，覆盖 `打分页`、统计页、`得分页` Markdown 和设置页文案。

## 实现目标

- `打分页` 实时目标条使用当前 `total`，文案为 `今日目标 {total}/{dailyGoal}`。
- 统计页目标卡按周期 `day.total` 累加，并把误导性 completed 命名和文案改为得分进度。
- `得分页` 目标 callout 与汇总 callout 均使用得分口径。
- 设置页目标说明改为“以最终得分为统计标准”。

## 风险

- 跨 `helpers`、`stats-panel`、`renderers`、`settings`，提交前需要 Cursor review。
- 只改 UI/文档展示口径，不改保存数据或 frontmatter schema。

## 验收

- [x] 打分页：未打分显示 `0/目标`。
- [x] 打分页：有正分时进度上升。
- [x] 打分页：负分时进度条不出现负宽度。
- [x] 统计页：周/月目标卡数值等于周期 `day.total` 累加。
- [x] 得分页：目标 callout 与汇总文案都体现得分口径。
- [x] 设置页：目标说明文案已同步。
- [x] `npm run build` 通过。
- [ ] 用户 Obsidian 体验复测通过。
- [ ] Cursor review 不存在 P0。

## 实现记录

- 2026-04-28 21:02 CST：创建任务并接管写锁。
- 2026-04-28 21:10 CST：`daily-total-display` 改为使用当前 `total` 计算 `今日目标 {total}/{dailyGoal}`，百分比 clamp 到 `[0,100]`。
- 2026-04-28 21:10 CST：统计页目标卡改为 `本周/本月得分进度`，变量与函数改为 `goalProgress` / `calcGoalProgressByScore()`。
- 2026-04-28 21:10 CST：生成 Markdown 的目标 callout 与汇总 callout 改为得分进度口径。
- 2026-04-28 21:10 CST：设置页目标说明改为“以最终得分为统计标准（含加分、减分和临时事项）”。
- 2026-04-28 21:10 CST：已运行 `npx tsc --noEmit`、`npm run build`、`node --check main.js`。
- 2026-04-28 21:18 CST：按用户新流程要求，已更新固定交接卡 `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`，后续无需用户手动粘贴代码/diff。
- 2026-04-29 14:12 CST：按用户要求，固定 Cursor review handoff 卡已扩展为最近三轮合并版：stats summary/freshness、score-card color logic、goal-progress score basis。

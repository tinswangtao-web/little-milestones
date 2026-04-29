# Codex 自检：Goal progress score basis

## A. 本轮目标

- 用户目标：统一“目标/进度”统计口径为最终得分 `total`，覆盖 `打分页`、统计页、`得分页` Markdown 和设置页文案。
- 本轮实际完成：
  - `打分页` 实时目标条使用当前总分 `total`，显示 `今日目标 {total}/{dailyGoal}`。
  - 统计页周/月目标卡按周期 `day.total` 累加，并改为“得分进度”文案。
  - `得分页` 目标 callout 与汇总 callout 改为得分进度。
  - 设置页说明文案改为最终得分口径。
- 未完成项：未做 Vault sync；未 commit；等待用户体验复测和 Cursor review。

## B. 改动范围

- 代码文件：
  - `src/modals/helpers/daily-total-display.ts`
  - `src/modals/panels/stats-panel.ts`
  - `src/renderers/report-sections.ts`
  - `src/settings/goal-settings-section.ts`
- 产物文件：
  - `main.js`：是
  - `styles.css`：否
- 协议文件：
  - `.agents/tasks/2026-04-28-goal-progress-score-basis.md`
  - `.agents/reviews/2026-04-28-goal-progress-score-basis-codex-checklist.md`
  - `.agents/STATE.md`
  - `.agents/LOCK.md`
  - `.agents/log.md`

## C. 风险自检

- 是否涉及数据读写/迁移：`否`
- 是否涉及移动端键盘/触摸/overlay：`否`
- 是否涉及保存流程/文件路径：`否`
- 是否跨 3 个以上文件：`是`
- 若任一为“是”，是否已请求 Cursor 严格review：`待用户转 Cursor review`

## D. 验证结果

- Build：`通过`
- Typecheck/Lint：`通过`
- `node --check main.js`：`通过`
- 文案扫描：
  - `calcCompleted` / `goalCompleted` 已移除。
  - 目标相关文案改为 `得分进度` / `目标进度`。
- 手工验证（待用户）：
  1. `打分页` 未打分显示 `今日目标 0/目标`。
  2. 正分时目标条上升，负分时目标条宽度保持不小于 0。
  3. 统计页周/月目标卡等于周期 `day.total` 累加。
  4. 生成 Markdown 的目标 callout 和汇总 callout 都使用得分口径。

## E. Vault 同步检查

- 是否已获用户同意同步：`否`
- 同步结果：`未同步`

## F. 提交门禁

- [ ] 用户明确说“可以提交/commit”
- [ ] Cursor review 结论不是“需修复”
- [ ] P0 问题为 0
- [x] 产物与源码一致（`npm run build` 已更新 `main.js`）
- [x] `.agents` 记录已更新（STATE/LOCK/log/task）

## G. 建议提交信息

- `[codex] use score totals for goal progress`

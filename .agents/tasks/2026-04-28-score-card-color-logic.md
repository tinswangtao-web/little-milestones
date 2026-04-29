# Score card color logic

- **slug**: 2026-04-28-score-card-color-logic
- **owner**: codex
- **created**: 2026-04-28
- **status**: awaiting-user-verification
- **sync-to-vault**: pending
- **write-scope**: `src/modals/panels/score-items-panel.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `styles/**`, `main.js`, `.agents/**`
- **origin**: user request after stats-summary follow-up

## 用户需求

- 统一 `打分页` 卡片显色逻辑：
  - `scoreVal === 0`：灰色。
  - `scoreVal > 0`：绿色。
  - `scoreVal < 0`：红色。

## 实现目标

- 在 `renderScoreCard()` 和 `refreshScoreCard()` 中把 `isNeg` 改为仅 `scoreVal < 0`。
- 保留 `isDeductedActive = isDeductItem && scoreVal !== 0`。

## 验收

- [x] 加分项未打分：灰色（代码路径：`scoreVal === 0` 无 `is-earned` / `is-negative`）。
- [x] 减分项未打分：灰色（代码路径：`scoreVal === 0` 无 `is-negative`）。
- [x] 加分项打分后：绿色（代码路径：`scoreVal > 0` 设置 `is-earned`）。
- [x] 减分项打分后：红色（代码路径：`scoreVal < 0` 设置 `is-negative`）。
- [x] 自定义调分正/负切换时颜色即时正确更新（代码路径：`refreshScoreCard()` 使用同一判断）。
- [x] `npm run build` 通过。
- [x] 提供 diff 和截图。

## 实现记录

- 2026-04-28 20:38 CST：创建任务并接管写锁。
- 2026-04-28 20:44 CST：`renderScoreCard()` / `refreshScoreCard()` 中 `isNeg` 改为仅 `scoreVal < 0`，保留 `isDeductedActive` 逻辑。
- 2026-04-28 20:44 CST：已运行 `npm run build`、`npx tsc --noEmit`、`node --check main.js`。
- 2026-04-28 20:44 CST：生成卡片显色对照截图 `/private/tmp/little-milestones-score-card-color-preview.png`。

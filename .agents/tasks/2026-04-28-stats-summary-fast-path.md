# Stats summary fast path

- **slug**: 2026-04-28-stats-summary-fast-path
- **owner**: codex
- **created**: 2026-04-28
- **status**: awaiting-cursor-review
- **sync-to-vault**: pending
- **write-scope**: `src/storage/day-data-store.ts`, `src/composers/day-data-composer.ts`, `src/modals/stats-modal.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `main.js`, `.agents/**`
- **origin**: Cursor review P2-6

## 用户需求

- 优化统计页历史记录读取路径，减少打开 Stats 时对每一天完整 Markdown 正文的读取/解析。

## 实现目标

- 增加 `readDaySummary()`，优先读取 frontmatter 中统计需要的轻量字段。
- `getAllScores()` 优先走 summary 路径，保留 `readDayData()` 给完整日详情场景。
- 保持旧 schema / 旧文档兼容，不影响保存流程、总分、累计和 streak。

## 风险

- 涉及 storage/composer/stats 路径，提交前必须 Cursor 严格 review。
- 若旧 Markdown frontmatter 字段不足，需要安全 fallback 到完整读取。

## 验收

- [x] `npm run build` 通过。
- [x] TypeScript 检查通过。
- [x] `node --check main.js` 通过。
- [x] `getAllScores()` 返回结构与统计页预期一致。
- [x] Cursor P0 freshness finding 已修复并本地验证。
- [ ] 保存流程无回归（待用户 Obsidian 复测）。
- [ ] Cursor review 不存在 P0。

## 实现记录

- 2026-04-28 20:02 CST：新增 `DayDataStore.readDaySummary()`，优先使用 Obsidian metadata cache 的 frontmatter 构造轻量 `DayData`；metadata cache 缺失时 fallback 到完整 `vault.read()`。
- 2026-04-28 20:02 CST：`getAllScores()` 改为调用 `readDaySummary()`；`readDayData()` 保持完整读取正文与日记内容。
- 2026-04-28 20:02 CST：未改 `DayDataComposer` / `StatsModal` UI；它们继续通过 `getAllScores()` 使用相同数据结构。
- 2026-04-28 20:02 CST：已运行 `npx tsc --noEmit`、`npm run build`、`node --check main.js`。
- 2026-04-28 20:26 CST：按 Cursor P0 补充修复 freshness：`readDayData()` 默认从文件内容解析 frontmatter，避免完整正文与旧 metadata cache frontmatter 混用。
- 2026-04-28 20:26 CST：`readDaySummary()` / `getAllScores()` 增加 `preferFreshRead` 选项；保存生成报告时强制 fresh 读取，用于累计分与 streak 计算。
- 2026-04-28 20:26 CST：编辑页加载 `existingToday` / `yesterdayData` 时显式 `preferFreshRead: true`，避免旧日期再次编辑时分数/临时项显示旧值。
- 2026-04-28 20:26 CST：已重新运行 `npx tsc --noEmit`、`npm run build`、`node --check main.js`。

## Cursor P0 跟进

- 发现：`readDayData()` 读取完整正文后仍优先使用 metadata cache frontmatter，可能在跨终端同步或保存后 metadata cache 滞后窗口里拿到旧 `scores/customItems`。
- 修复：完整读取路径默认 fresh；summary 快路径保留 cache 优先，但可通过 `preferFreshRead` 绕过 cache。
- 手工回归建议：A 端修改某日记录后，B 端立刻打开同日 `打分页` 编辑，确认 scores / customItems 与文件 frontmatter 一致，不回落为旧值或 0。

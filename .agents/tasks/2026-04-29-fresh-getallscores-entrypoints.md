# Fresh getAllScores entrypoints

- **slug**: 2026-04-29-fresh-getallscores-entrypoints
- **owner**: codex
- **created**: 2026-04-29
- **status**: awaiting-user-verification
- **sync-to-vault**: pending
- **write-scope**: `src/storage/day-data-store.ts`, `src/modals/stats-modal.ts`, `src/modals/helpers/daily-modal-state.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `main.js`, `.agents/**`
- **origin**: follow-up to `2026-04-28-stats-summary-fast-path`

## 用户需求

“请把 StatsModal 和 loadDailyModalState 里的 getAllScores() 改为在关键场景可用 preferFreshRead: true（至少在打开统计页和加载打分页状态时），并给我更新后的 diff + 自检卡。”

Cursor review follow-up：

- `StatsModal` 和 `loadDailyModalState` 不要默认每次都 full fresh。
- 改成默认走 normal fast path，仅在保存后立即统计/刚切换日期需强一致场景启用 fresh（一次性或短窗口）。
- `readDaySummary()` 的 fresh 分支不要解析 diary 内容，只从文件内容解析 frontmatter 并构造 summary 对象。

## 实现目标

- `StatsModal.onOpen()` 和 `loadDailyModalState()` 默认恢复 `getAllScores()` fast path。
- `saveDayData()` 保存完成后开启 2 秒 fresh read 短窗口，窗口内默认 `getAllScores()` 会自动绕过 cache。
- `readDaySummary()` fresh 分支只解析 frontmatter，构造 summary 时不传 `content`，避免 `extractDiaryContent()` 开销。

## 风险

- 涉及读取路径和 `main.js` 生成产物，需 Cursor review。
- 保存后短窗口会比普通 summary/cache 路径更稳但稍慢；默认打开统计页和打分页仍走 fast path。

## 验收

- [x] 打开统计页默认走 `getAllScores()` fast path。
- [x] 打开 `打分页` 编辑状态时 allScores 默认走 `getAllScores()` fast path。
- [x] 保存后短窗口内 `getAllScores()` 自动使用 fresh read。
- [x] `readDaySummary()` fresh 分支不再抽取 diary 内容。
- [x] `npm run build` 通过。
- [x] `npx tsc --noEmit` 通过。
- [x] `node --check main.js` 通过。
- [ ] 用户 Obsidian 体验复测通过。
- [ ] Cursor review 不存在 P0。

## 实现记录

- 2026-04-29 14:24 CST：创建任务并接管写锁。
- 2026-04-29 14:31 CST：`StatsModal.onOpen()` 和 `loadDailyModalState()` 的 `getAllScores()` 均改为 `{ preferFreshRead: true }`。
- 2026-04-29 14:31 CST：已运行 `npx tsc --noEmit`、`npm run build`、`node --check main.js`。
- 2026-04-29 14:31 CST：已创建自检卡 `.agents/reviews/2026-04-29-fresh-getallscores-entrypoints-codex-checklist.md`。
- 2026-04-29 14:52 CST：按 Cursor review 修订：入口恢复 fast path；`DayDataStore` 增加保存后 2 秒 fresh read 短窗口；`readDaySummary()` fresh 分支只解析 frontmatter 不抽 diary。
- 2026-04-29 14:52 CST：已重新运行 `npx tsc --noEmit`、`npm run build`、`node --check main.js`。

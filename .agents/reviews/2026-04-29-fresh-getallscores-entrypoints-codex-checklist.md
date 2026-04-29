# Codex 自检：Fresh getAllScores entrypoints

## A. 本轮目标

- 用户目标：“请把 StatsModal 和 loadDailyModalState 里的 getAllScores() 改为在关键场景可用 preferFreshRead: true（至少在打开统计页和加载打分页状态时），并给我更新后的 diff + 自检卡。”
- Cursor review follow-up：fresh 覆盖正确，但性能 tradeoff 偏重；`StatsModal` / `loadDailyModalState` 不要默认每次 full fresh；改为默认 fast path，仅保存后立即统计/刚切换日期需强一致时启用 fresh；`readDaySummary()` fresh 分支不要解析 diary 内容。
- 本轮实际完成：
  - `StatsModal.onOpen()` 和 `loadDailyModalState()` 默认恢复 `getAllScores()` fast path。
  - `DayDataStore.saveDayData()` 保存成功后开启 2 秒 fresh read 短窗口，窗口内默认 `getAllScores()` 会自动绕过 cache。
  - `readDaySummary()` fresh 分支只从文件内容解析 frontmatter，构造 summary 时不传 `content`，避免 `extractDiaryContent()` 开销。
  - `main.js` 已通过 build 更新。
- 未完成项：未做 Vault sync；未 commit；等待 Cursor review 和用户 Obsidian 体验复测。

## B. 改动范围

- 代码文件：
  - `src/modals/stats-modal.ts`
  - `src/modals/helpers/daily-modal-state.ts`
  - `src/storage/day-data-store.ts`
- 产物文件：
  - `main.js`：是
  - `styles.css`：否
- 协议文件：
  - `.agents/tasks/2026-04-29-fresh-getallscores-entrypoints.md`
  - `.agents/reviews/2026-04-29-fresh-getallscores-entrypoints-codex-checklist.md`
  - `.agents/reviews/CODEX_TO_CURSOR_REVIEW_CARD.md`
  - `.agents/STATE.md`
  - `.agents/LOCK.md`
  - `.agents/log.md`

## C. 风险自检

- 是否涉及数据读写/迁移：`是，读取路径 freshness`
- 是否涉及移动端键盘/触摸/overlay：`否`
- 是否涉及保存流程/文件路径：`否`
- 是否跨 3 个以上文件：`是（storage + 入口 + build/agents）`
- 是否请求 Cursor 严格review：`是，属于 stats freshness follow-up`

## D. 验证结果

- `npx tsc --noEmit`：`通过`
- `npm run build`：`通过`
- `node --check main.js`：`通过`
- 手工验证（待用户）：
  1. 大历史数据下打开统计页，确认首次打开速度接近原 fast path。
  2. 打开 `打分页`，确认状态加载速度接近原 fast path，旧日期 scores/customItems 不回落为旧值或 0。
  3. 保存后 2 秒内立即打开统计页，确认统计使用最新值。
  4. 保存后等待短窗口结束再打开统计页，确认仍走 fast path 且不卡。

## E. Vault 同步检查

- 是否已获用户同意同步：`否`
- 同步结果：`未同步`

## F. 提交门禁

- [ ] 用户明确说“可以提交/commit”
- [ ] Cursor review 结论不是“需修复”
- [ ] P0 问题为 0
- [x] 产物与源码一致（`npm run build` 已更新 `main.js`）
- [x] `.agents` 记录已更新

## G. 建议提交信息

- `[codex] tune fresh stats read window`

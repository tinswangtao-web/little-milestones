# Cursor P0 follow-up: DayData freshness

## Review 结论

- 结论：`需复审`
- 风险等级：`中`
- 是否阻塞提交：`是，直到 Cursor 确认 P0 已解决`

## 1) Blocking Issues（P0，必须修）

- [P0-1] `readDayData()` 可能混用旧 metadata cache frontmatter 与最新文件正文
  - 现象：已打分日期再次编辑时，scores/customItems 有时丢失或与文件不一致。
  - 影响范围：`打分页` 编辑旧记录；跨终端同步或保存后 metadata cache 未刷新时更容易触发。
  - 修复：
    - `readDayData()` 默认 fresh，从文件内容解析 frontmatter。
    - `loadDailyModalState()` 读取 today/yesterday 时显式 `{ preferFreshRead: true }`。
    - `readDaySummary()` / `getAllScores()` 支持 `{ preferFreshRead: true }`。
    - 保存生成报告时 `DayDataComposer` 使用 fresh `readDayData()` / `getAllScores()`。
  - 是否已复测通过：`待 Cursor / 用户复测`

## 5) 验证记录（Codex 已做）

- Build：`通过`
- Typecheck/Lint：`通过`
- `node --check main.js`：`通过`
- 手工验证场景：
  - [ ] A 端修改某日 -> B 端立即打开同日编辑，确认 scores/customItems 与文件一致。
  - [ ] 保存一次记录后打开统计页，确认累计分和 streak 使用最新数据。
  - [ ] 统计页本周 / 本月 / 全部切换正常。

## 6) 给用户的下一步（非技术）

- 你现在只要做：
  1. 把本轮 diff 和 checklist 发给 Cursor 复审。
  2. Cursor 没有 P0 后，在 Obsidian 打开一个已打分旧日期确认分数/临时项还在。
- 看到以下结果就算通过：
  - 旧日期编辑页显示与文件一致，保存后统计页立刻体现最新分数。

## 7) 提交建议

- 建议现在提交：`否，先等 Cursor 复审`
- 建议先同步 Vault 再测：`否，需用户明确同意`
- 建议 commit message：
  - `[codex] add stats summary fast path`

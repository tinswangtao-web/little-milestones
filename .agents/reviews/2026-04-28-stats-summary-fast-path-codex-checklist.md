# Codex 提交前自检：Stats summary fast path

## A. 本轮目标

- 用户目标：按 Codex 建议实现 DayData / Stats 快路径，并修复 Cursor P0：编辑页读取不能混用最新正文与旧 metadata cache frontmatter。
- 本轮实际完成：
  - 新增 `readDaySummary()`，让 `getAllScores()` 默认优先从 metadata cache frontmatter 构造轻量 `DayData`；cache 不可用时 fallback 到完整读取。
  - `readDayData()` 默认 fresh，从文件内容解析 frontmatter，避免已打分日期再次编辑时 scores/customItems 读到旧值。
  - `readDaySummary()` / `getAllScores()` 增加 `preferFreshRead` 选项，保存生成报告时启用 fresh 读取。
- 未完成项（如有）：未做 Vault sync；未 commit；等待 Cursor 复审和用户体验验收。

## B. 改动范围

- 代码文件：
  - `src/storage/day-data-store.ts`
  - `src/main.ts`
  - `src/composers/day-data-composer.ts`
  - `src/modals/helpers/daily-modal-state.ts`
- 产物文件：
  - `main.js`：是
  - `styles.css`：否
- 协议文件：
  - `.agents/tasks/2026-04-28-stats-summary-fast-path.md`
  - `.agents/reviews/2026-04-28-stats-summary-fast-path-codex-checklist.md`
  - `.agents/STATE.md`
  - `.agents/LOCK.md`
  - `.agents/log.md`

## C. 风险自检（必答）

- 是否涉及数据读写/迁移：`是`
- 是否涉及移动端键盘/触摸/overlay：`否`
- 是否涉及保存流程/文件路径：`否`
- 是否跨 3 个以上文件：`是`
- 若任一为“是”，是否已请求 Cursor 严格review：`是，Cursor 已补充 P0；本轮已按建议修复，待复审`

## D. 验证结果

- Build：`通过`
- Typecheck/Lint：`通过`
- 手工验证（列步骤）：
  1. A 端修改某日记录，B 端立即打开同日 `打分页` 编辑页。
  2. 确认 scores / customItems 与文件 frontmatter 一致，不回落为旧值或 0。
  3. 保存一次记录后打开统计页，确认累计分、streak、历史统计使用最新数据。
  4. 切换本周 / 本月 / 全部，确认趋势图和项目完成率正常。
- 结果：
  - [x] 与用户目标一致
  - [ ] 无明显回归（待用户 / Cursor 确认）
  - [x] 异常场景已覆盖到代码路径：fresh read 绕过 metadata cache 与 5 秒 getAllScores cache

## E. Vault 同步检查（若要同步）

- 是否已获用户同意同步：`否`
- 同步前：
  - [ ] `manifest.json/main.js/styles.css` 为当前最新版本
- 同步后：
  - [ ] 三文件 hash/diff 一致（workspace vs vault）
- 同步结果：`未同步`

## F. 提交门禁（必须全部满足）

- [ ] 用户明确说“可以提交/commit”
- [ ] Cursor review 结论不是“需修复”
- [ ] P0 问题为 0（当前 P0 已修，待 Cursor 复审确认）
- [x] 产物与源码一致（`npm run build` 已更新 `main.js`）
- [x] `.agents` 记录已更新（STATE/LOCK/log/task）

## G. 建议提交信息

- commit message：
  - `[codex] add stats summary fast path`
- 包含内容摘要：
  - Stats 历史记录列表优先读取 metadata cache frontmatter。
  - 完整编辑读取与保存后统计支持 fresh read，避免 metadata cache 滞后导致旧 scores/customItems。

## H. 需要用户做的最后确认（非技术）

- 请你只测这 3 项：
  1. 打开一个已打分旧日期，确认分数和临时项没有变 0 或丢失。
  2. 保存一次记录后打开统计页，确认新分数计入累计和 streak。
  3. 切换本周 / 本月 / 全部，确认趋势图和完成率正常。
- 如果都通过，我再执行：
  - `提交 / 同步Vault / 两者都做`

## 30秒简版（紧急场景）

- 目标完成：`是`
- Build通过：`是`
- 有无P0：`已修 Cursor P0，待复审确认`
- 用户是否同意提交：`否`
- 可执行动作：`继续 review / 用户验收`

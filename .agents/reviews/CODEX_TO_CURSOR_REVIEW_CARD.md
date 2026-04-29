# Codex -> Cursor Review Card

Cursor 请直接读取当前 working-tree diff 和本卡内容进行 round review。当前没有 commit，也没有 Vault sync。

## 1) 本轮目标（用户原话）

任务卡：`.agents/tasks/2026-04-29-post-vault-regressions.md`
review 结论卡：`.agents/reviews/2026-04-29-post-vault-regression-review.md`
当前结论是：需修复（有 1 个 P0 + 1 个 P1）。
你现在只要让 Codex 按这张新卡修完，然后我再给你做下一轮 round review。

## 2) 改动文件清单

- `src/diary/modules.ts`
- `src/renderers/report-sections.ts`
- `main.js`（`npm run build` 生成）
- `.agents/STATE.md`
- `.agents/LOCK.md`
- `.agents/log.md`
- `.agents/tasks/2026-04-29-post-vault-regressions.md`
- `.agents/reviews/CODEX_TO_CURSOR_REVIEW_CARD.md`

## 3) 关键行为变化（用户可见）

- 得分页分类表格不再在表格行之间插入 `> [!quote]- 昨日...` 引用块，避免 Markdown 表格被打断后只显示一个项目。
- 打分页重新进入已保存日期时，日记读取现在兼容当前保存出来的叙述句格式：
  - `今天的天气是...`
  - `我今天的心情是...`
  - `今天我做了...`
  - `今天我学会了...`
  - `今天最开心的是...`
  - `我还想说...`
- 旧的 `标签：值` 格式仍保留兼容。
- 如果叙述句没有可识别前缀，会按当前模块顺序回填内置多行模块，匹配 `composeDiaryContent()` 的写入顺序。

## 4) 已执行验证（build/typecheck/手测）

- `npx tsc --noEmit`：通过。
- `npm run build`：通过。
- `node --check main.js`：通过。
- 手测：未在 Obsidian 内完成，等待用户和 Cursor 复测。

## 5) 已知风险与待确认点

- 日记叙述句格式本身不是完全结构化格式；当前修复按保存顺序恢复无前缀的内置多行模块。若用户手动大幅改写得分页中的日记段落，仍可能无法 100% 反推字段。
- 本轮改了 `src/diary/modules.ts` 与 `src/renderers/report-sections.ts`，涉及编辑页回填和得分页渲染，属于严格 review。
- 未执行 Vault sync；需要用户和 Cursor review 通过后，再由用户明确决定是否同步 Vault。

## 6) 是否请求 Cursor 严格review

是。

## 7) 建议用户验收步骤（2-4步）

1. 在 Vault 中打开一个已有打分日期，确认日记模块和自由记录能回填，不会变成空白或默认提示词。
2. 修改并保存一次日记，再重新打开同一天，确认刚写的内容仍在对应模块里。
3. 生成/查看得分页，确认每个分类表格都能显示全部项目，不再只显示第一项。
4. 若上述都通过，再决定是否让 Codex 提交和同步 Vault。

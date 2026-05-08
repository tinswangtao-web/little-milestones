# 得分页日记编辑自动保存/草稿恢复

- **slug**: 2026-05-08-diary-draft-autosave
- **created**: 2026-05-08
- **owner**: codex
- **status**: completed
- **origin**: 用户反馈：写日记未手动保存，切换其他功能后返回内容丢失；Kimi 执行卡
- **sync-to-vault**: done
- **write-scope**: `src/modals/daily-scoring-modal.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `main.js`, `.agents/**`

## 用户现象

在“打分页/得分页”相关的日记编辑界面中：
1. 输入日记内容后，没有点击“手动保存”。
2. 不小心点击了其他功能按键。
3. 回到日记编辑后，刚输入内容已经完全丢失。

## 期望行为

- 日记输入具备“自动保存/草稿恢复”能力：
  - 切换到其他功能后再返回，输入内容能恢复。
  - 不需要用户点击“手动保存”也不应丢失。

## 实现记录

- 2026-05-08 10:00 +0800：Codex 接手 Kimi 执行卡；真实 Git 仓库位于 `/Users/tins-macmini/Documents/AI Files/obsidian-little-milestones`，另一个 `Vibe Coding/...` 目录只有任务卡。
- 在 `DailyScoringModal` 增加按 `currentUser.id + dateStr` 索引的运行期日记草稿缓存。
- 打开/重渲染打分页时，若当前用户和日期有草稿，优先用草稿的 `diaryContent`/`diaryModules` 恢复输入状态。
- 日记模块输入、自由日记输入、插入附件/格式文本、模块配置变更都会刷新草稿。
- 切换日期、切换用户、打开统计页前先保存当前草稿，避免界面切走时丢失。
- 点击“保存记录”并成功写入文件后清除该日期草稿，后续以文件内容为准。
- 本轮未使用 `localStorage`，草稿生命周期限定为 Obsidian 当前运行会话内；关闭/重启 Obsidian 后不恢复未保存草稿。

- 2026-05-08 11:05 +0800：用户要求同步到 Vault 测试；Codex 执行 `npm run deploy`，build 成功并同步 `main.js`、`styles.css`、`manifest.json`；同步后校验 `MATCH main.js e576ba1f2a88`、`MATCH styles.css db81e41e0927`、`MATCH manifest.json e82c7257a300`。等待用户 Obsidian 内验证。

## 验收标准

- [x] 打开某日期日记，输入一段文字但不点“保存”。
- [x] 点击统计/切换日期等会离开或重渲染日记界面的动作。
- [x] 回到同一用户同一日期打分页，刚才输入的日记内容仍在。
- [x] 点击“保存记录”后，再回到同一天，内容与保存后的文件一致，不再使用旧草稿覆盖。

## 验证

- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `node --check main.js`
- [x] Cursor P1 close-path follow-up implemented
- [x] Obsidian 内手测，用户确认本轮验收通过

## Cursor round review

- 2026-05-08 10:18 +0800：Cursor review 结论“需修复（非阻塞）”。发现 P1：当前未覆盖 modal 关闭路径（X/ESC/遮罩）的草稿落盘，仍可能丢未保存日记；建议在 `onClose()` 补 `saveDiaryDraft()`，保留保存成功后 `clearDiaryDraft()`。
- 2026-05-08 10:30 +0800：Codex 已修复 Cursor P1：`DailyScoringModal.onClose()` 会保存草稿；保存成功路径设置一次性 `skipNextCloseDraftSave`，先 `clearDiaryDraft()` 再关闭，避免 `onClose()` 重新写回旧草稿。`npx tsc --noEmit`、`npm run build`、`node --check main.js` 通过。

## 风险与回滚

- 风险：草稿缓存是运行期静态 Map，只跨同一次 Obsidian 运行期的 modal 实例，不跨重启。
- 风险：同一用户同一天未保存草稿会优先覆盖文件回填，直到用户保存成功；这是为防止误触丢稿的预期行为。
- 回滚：移除 `DailyScoringModal.diaryDrafts` 及 `get/save/clearDiaryDraft()` 调用，恢复只从文件状态和 pending render state 回填。

## 收口记录

- 2026-05-08 12:00 +0800：用户确认本轮已验收通过；日记草稿自动保存任务标记 completed。后续天气/心情 quick custom placeholder 回归任务也已 Vault 验收通过；当前仅等待用户明确授权 commit 或再次 Vault sync 后 commit。

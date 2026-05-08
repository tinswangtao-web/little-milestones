# Cursor Review — diary draft autosave

## Review 结论

- 结论：`需修复`
- 风险等级：`中`
- 是否阻塞提交：`否`

## Findings

- [P1-1] 草稿保存未覆盖“关闭弹窗”路径，仍存在丢失风险
  - 现象：
    - 当前实现在 `onStats`、切日期、切用户、选日历时调用 `saveDiaryDraft()`；
    - 但 `DailyScoringModal` 未见覆盖 `onClose()` 统一落草稿，若通过右上角关闭、ESC、遮罩点击等路径离开，可能不经过这些入口。
  - 代码依据：
    - `saveDiaryDraft()` 被调用点集中在 `renderDailyHeader` 和 `onStats`、若干编辑回调中；未见 `onClose()` 钩子持久化。
  - 影响：
    - 用户未手动保存且误触关闭时，草稿仍可能丢失，与“自动保存防丢”目标不完全一致。
  - 建议修法（最小改动）：
    - 在 `DailyScoringModal.onClose()`（或等效关闭钩子）补一层 `saveDiaryDraft()`；
    - 并确保“保存成功后清草稿”逻辑继续保留。

## 已验证通过

- 按用户指定场景（点统计离开再回来）代码路径已覆盖：`onStats` 内先 `saveDiaryDraft()` 再 `close()`。
- 以 `userId + dateStr` 为 key 的运行期草稿恢复机制已实现。
- `saveDayData` 成功后会 `clearDiaryDraft()`，避免旧草稿覆盖已保存文件。
- `npm run build`：通过
- `npx tsc --noEmit`：通过
- `node --check main.js`：通过

## 用户回归建议

1. 输入日记后点“查看统计”再回同日，确认草稿恢复（应通过）。
2. 输入日记后直接点关闭（或 ESC/遮罩），再回同日，确认是否恢复（当前可能失败，待修）。
3. 保存记录后再开同日，确认以文件内容为准，旧草稿不覆盖。

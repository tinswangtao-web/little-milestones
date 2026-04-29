# Cursor Round Review — negative card + sign count

## Review 结论

- 结论：`可发布`
- 风险等级：`低`
- 是否阻塞提交：`否`

## Findings

No blocking issues.

## 变更核对

- 负分卡片视觉统一：已生效。`scoreVal < 0` 会同时带 `is-negative` 与 `is-deducted-active`，与减分项负分态一致（浅红+红圈）。
- 得分页汇总文案：已改为“加了分的项 / 减了分的项”。
- 得分页统计口径：`positiveCount`/`negativeCount` 现按实际得分正负统计（`>0` / `<0`）。

## 验证记录

- `npm run build`：通过
- `npx tsc --noEmit`：通过
- `node --check main.js`：通过

## 仍需用户确认

1. 在打分页把“非减分分类”项目调成负分，确认卡片样式与减分项负分态完全一致。
2. 在得分页确认“加了分的项 / 减了分的项”计数仅随实际打分变化。
3. 确认“0 分”项目不会计入上述两项。

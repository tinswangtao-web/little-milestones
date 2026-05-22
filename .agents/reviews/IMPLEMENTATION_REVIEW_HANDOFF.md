# Implementation Review Handoff

## 任务
- `slug`: 2026-05-22-fix-score-state-lost-on-item-change
- `status`: awaiting-review
- `round`: 1

## 用户原话目标
修复打分页在新增/编辑/删除打分项后已打分数被清零的 bug。

## 改动文件列表（本轮）
| 文件 | 改动性质 |
|------|----------|
| `src/modals/daily-scoring-modal.ts` | 新增 `captureRenderState()` 私有方法；在 `showAddItemPopup` 回调、`showCustomValuePopup` 的 `onRefresh` 回调中调用；将 `onModulesChanged` 中的内联 `pendingRenderState` 构造替换为 `captureRenderState()` |

## 用户可见行为变化
1. 在打分页给打分项打分后，新增打分项 → 之前已打的分数不再清零
2. 编辑打分项名称/分值后 → 之前已打的分数不再清零
3. 删除打分项后 → 其他打分项的分数不再清零
4. 添加临时事项后 → 之前已打的分数不再清零
5. Diary 模块操作后的 re-render 行为不变（现有功能不退化）

## 已做验证
- `npx tsc --noEmit` ✅
- `npm run build` ✅
- `node --check main.js` ✅

## 风险与开放点
- 无已知风险。改动仅影响 `renderModal()` 前的状态保存逻辑，不改变渲染架构或存储逻辑。
- `captureRenderState()` 与 `onModulesChanged` 原有内联构造逻辑完全等价，统一风格减少重复。

## 是否要求严格 review
否。改动仅涉及 1 个文件，新增 1 个方法 + 3 处调用点替换，未触及存储/迁移/鉴权等严审触发条件。

## 建议用户验收步骤
1. 在打分页给几个打分项打分 → 新增一个打分项 → 确认之前的分数保留
2. 编辑一个打分项的名称/分值 → 确认之前的分数保留
3. 删除一个打分项 → 确认其他打分项的分数保留
4. 添加临时事项 → 确认之前的分数保留

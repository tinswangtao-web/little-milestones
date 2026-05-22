# Task: 2026-05-22-fix-score-state-lost-on-item-change

## Context / User Request

用户报告：在打分页已经打过分之后，以下操作会导致**之前已打的分数全部清零**：

1. 添加临时打分项（custom item）
2. 修改某个打分项的预设内容（名称/分值/emoji 等）
3. 新增或减少一个打分项

## Root Cause Analysis

**核心问题：`renderModal()` 每次被调用时，会无条件清零所有状态，然后从磁盘重新加载。但打分中的数据只存在于内存，尚未保存到磁盘。**

### 详细调用链

1. **`renderModal()`** ([daily-scoring-modal.ts:110-114](file:///Users/tins-macmini/Documents/AI%20Files/Obsidian-Plugins/obsidian-little-milestones/src/modals/daily-scoring-modal.ts#L110-L114))：
   ```ts
   this.scores = {};
   this.customItems = [];
   this.diaryContent = "";
   this.diaryModules = {};
   ```
   每次 re-render **都先清零**所有打分状态。

2. 然后调用 **`loadDailyModalState()`** ([daily-modal-state.ts:26-33](file:///Users/tins-macmini/Documents/AI%20Files/Obsidian-Plugins/obsidian-little-milestones/src/modals/helpers/daily-modal-state.ts#L26-L33))，从磁盘读取 `existingToday`：
   ```ts
   for (const item of plugin.currentUser.items) {
     if (existingToday && existingToday.scores[item.id] !== undefined) {
       scores[item.id] = existingToday.scores[item.id];
     } else {
       scores[item.id] = 0;
     }
   }
   ```
   - 如果用户**还没保存**到磁盘（正在打分中），`existingToday` 不含当前内存中的打分值 → 所有 score 回到 0。

3. `renderModal()` L121 用 `pendingRenderState?.scores ?? state.scores`，**但只有 diary module 相关的 `onModulesChanged` 回调会设置 `pendingRenderState`**（L236-241）。以下触发 re-render 的场景都**不设置 `pendingRenderState`**：

   - **添加打分项** ([add-item-modal.ts:94](file:///Users/tins-macmini/Documents/AI%20Files/Obsidian-Plugins/obsidian-little-milestones/src/modals/popups/add-item-modal.ts#L94))：`onAdded()` → `renderModal()` → 丢失
   - **编辑打分项** ([edit-item-modal.ts:133](file:///Users/tins-macmini/Documents/AI%20Files/Obsidian-Plugins/obsidian-little-milestones/src/modals/popups/edit-item-modal.ts#L133))：`onSave()` → `onRefresh()` → `renderModal()` → 丢失
   - **删除打分项** ([score-item-modal.ts:80](file:///Users/tins-macmini/Documents/AI%20Files/Obsidian-Plugins/obsidian-little-milestones/src/modals/popups/score-item-modal.ts#L80))：`onDelete?.()` → `renderModal()` → 丢失

   临时打分项（custom item）的**添加**操作不走 `renderModal()`（直接操作内存数组 + `renderCustomItems()`），因此添加本身不丢。但如果紧接着用户做了上面任何一个触发 re-render 的操作，custom items 也会丢失。

### 一句话总结

**`renderModal()` 是全量重渲染+从磁盘加载，但添加/编辑/删除打分项时没有在重渲染前将内存中的 scores 和 customItems 保存到 `pendingRenderState`。**

## Proposed Fix（方案）

**统一在 `renderModal()` 触发前，将当前内存状态保存到 `pendingRenderState`。**

具体改法：

### 方案 A：在每个触发 renderModal 的回调前设置 pendingRenderState（最小改动）

在以下位置，调用 `renderModal()` 前加上 `this.pendingRenderState = { scores: {...this.scores}, customItems: this.customItems.map(i => ({...i})), ... }`：

1. `showAddItemPopup` 的 `onRefresh` 回调
2. `openScoreItemValueModal` → `onRefresh` 回调（影响编辑和删除后的 refresh）
3. `ScoreItemModal` 的 delete 分支的 `onDelete` 回调

### 方案 B：抽取 `captureRenderState()` 方法（推荐，更健壮）

在 `DailyScoringModal` 上新增一个 `private captureRenderState()` 方法，然后在所有调用 `renderModal()` 之前调用它。这样无论未来新增什么触发 re-render 的路径，都不会遗漏。

已有 `pendingRenderState` 字段的定义完全匹配所需格式，只需要将 diary 专用的构造逻辑通用化。

### 非目标

- 不改变"先清零再加载"的渲染架构
- 不改变存储逻辑或日记草稿机制

## Ownership
- `owner`: builder
- `status`: awaiting-sync
- `write-scope`: `src/modals/daily-scoring-modal.ts`, `src/modals/panels/score-panel.ts`, `.agents/**`
- `read-scope`: `src/**`
- `sync-to-vault`: pending
- `origin`: none (new bug report)

## Acceptance Checklist
- [ ] 打分后，新增打分项不清零已有分数
- [ ] 打分后，编辑打分项不清零已有分数
- [ ] 打分后，删除打分项不清零其他已有分数
- [ ] 打分后，添加临时事项不清零已有分数
- [ ] Diary 模块操作后的 re-render 仍正常保持状态（现有行为不退化）

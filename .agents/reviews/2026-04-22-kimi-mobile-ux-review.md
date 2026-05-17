# Kimi 移动端 UX Review — 2026-04-22

> **Scope**: `src/**`, `styles/**`, 重点审查 iPhone / iOS 键盘遮挡、按键交互、排版显示。
> **Status**: 待 Codex 修复

---

## 🔴 Critical（严重阻塞）

### C1: 多个子 Modal 的 `super.onOpen()` 调用顺序错误，导致 iOS 键盘顶起逻辑完全失效

- **文件**:
  - `src/modals/popups/score-item-modal.ts:23`
  - `src/modals/popups/quick-custom-modal.ts:19`
  - `src/modals/popups/edit-custom-modal.ts:20`
  - `src/modals/popups/add-custom-modal.ts:18`
- **问题**: 这些 modal 的 `onOpen()` 都是先 `super.onOpen()`，再 `this.modalEl.addClass("little-milestones-edit-modal")`。`BaseMobileModal.onOpen()` 会调用 `setupModalKeyboard()`，而 `setupModalKeyboard` 内部通过 `mEl.classList.contains("little-milestones-edit-modal")` 判断 `isEditModal`。由于 class 还没加，`isEditModal` 永远是 `false`，导致 `updateModalLift()` 中的 iOS 专用键盘顶起逻辑完全跳过。用户在编辑项目/临时事项时，键盘直接覆盖输入框。
- **修复建议**: 在所有子 modal 中，先 `this.modalEl.addClass("little-milestones-edit-modal")`，再调用 `super.onOpen()`。`EditItemModal` 已经是正确的顺序，其他需要统一。
- **状态**: ❌ 未修复

### C2: `DailyScoringModal` 主页面禁用了键盘调整，日记 Tab 输入框完全被键盘遮挡

- **文件**: `src/modals/daily-scoring-modal.ts:51`
- **问题**: `protected enableKeyboardAdjustment = false;` 导致主打分页 modal 在移动端完全不执行 `setupModalKeyboard()`。当用户切换到日记 Tab 并点击自由记录 textarea、天气/心情输入框时，iOS 键盘弹出但 modal 不会调整高度，输入框被完全遮住。
- **修复建议**:
  - 方案 A（推荐）：将 `enableKeyboardAdjustment` 设为 `true`，让主 modal 也启用键盘调整。主 modal 本身也是 flex 布局，可以承受高度压缩。
  - 方案 B：仅在用户切换到日记 Tab 时动态启用键盘调整，切回打分 Tab 时禁用。但这会增加状态管理复杂度。
  - 如果选择方案 A，需要测试打分 Tab 的卡片区域在键盘弹出时是否仍然可用（通常用户不会在打分时同时输入文字，所以影响小）。
- **状态**: ❌ 未修复

### C3: 日记模块所有输入框都禁用了 iOS focus 自动滚动

- **文件**: `src/modals/panels/diary-panel-fields.ts:64,100,147`
- **问题**: `bindModalInputFocus(input, { scrollOnIOSFocus: false })` 在日记模块字段、天气/心情输入中被显式传入。加上 C2 中主 modal 没有键盘调整，导致用户点击日记输入框后，页面完全不滚动，输入框百分之百被键盘盖住。
- **修复建议**:
  - 修复 C2 后，移除这些 `scrollOnIOSFocus: false`（或改为 `true`）。
  - 或者保留 `false`，但在 `diary-panel.ts` 中为 textarea 和 input 添加自定义的 focus scroll 逻辑，滚动到 `block: "center"` 并额外加上 keyboard height 补偿。
- **状态**: ❌ 未修复

---

## 🟠 High（明显影响体验）

### H1: 设置页 touch-scroll guard 阈值过严，误伤正常点击

- **文件**: `src/settings/settings-tab.ts:105-108`
- **问题**: `Math.abs(touch.clientX - touchStartX) > 8 || Math.abs(touch.clientY - touchStartY) > 8` 的 8px 阈值对轻微手指抖动太敏感。iOS 上手指自然放置时常常有超过 8px 的微小移动，导致正常点击被误判为滑动，随即给所有 input 加 `readonly`。再加上 `touchend` 后 120ms 才解除 readonly，用户快速点击输入框时 readonly 尚未解除，点击无响应。
- **修复建议**:
  - 将阈值从 8px 提高到 **16–20px**，与 `bindModalInputFocus` 中的阈值（也是 8px）一并提高。
  - 将 readonly 解除延迟从 120ms 缩短到 **0–60ms**（`touchend` 时立即解除）。如果担心抬手触发 focus，可以改成检测 touchend 时手指停留时间 > 200ms 才允许 focus，而不是用 readonly 硬挡。
  - 或者改用 `touch-action: manipulation` + CSS 方案替代 JS readonly guard。
- **状态**: ❌ 未修复

### H2: 日记工具栏在移动端占用过多垂直空间

- **文件**: `styles/07-mobile.css:466-482`
- **问题**: `.diary-toolbar` 在移动端是 `grid-template-columns: repeat(2, minmax(0, 1fr))`，7 个工具按钮排成 4 行。在 iPhone 上，用户需要向下滚动很远才能看到自由记录 textarea。这本身就会加剧"键盘遮挡"的感受（因为输入框在屏幕很下方）。
- **修复建议**:
  - 将工具栏改为 **横向滚动的单行 flex 布局**：`display: flex; overflow-x: auto; gap: 8px; padding-bottom: 4px;`，按钮 `flex-shrink: 0; white-space: nowrap;`。这样只占一行高度，用户左右滑动选择工具。
  - 或者将工具按钮缩减为 icon-only（去掉文字），3 列 grid，减少行数。
- **状态**: ❌ 未修复

### H3: 移动端卡片备注文字过小，难以阅读

- **文件**: `styles/07-mobile.css:630-638`
- **问题**: `.card-note { font-size: 0.62em; }` 在 iPhone 上大约是 10px，接近不可读。虽然做了 2 行截断，但用户基本看不清内容。
- **修复建议**: 将 `.card-note` 在移动端的字号提高到 **0.72em–0.78em**，或者增加卡片内边距给备注留出更多空间。
- **状态**: ❌ 未修复

### H4: `bindModalInputFocus` 的 retry scroll storm 导致滚动抖动

- **文件**: `src/utils/dom.ts:82-85,113-115`
- **问题**: iOS focus 时设置了 80ms / 260ms / 520ms / 860ms 四个连续的 scroll timeout，以及 400ms / 650ms 两个额外的 scroll timeout。总共 6 个定时器在 0.8 秒内反复滚动同一元素。这在 iOS 上会造成明显的视觉抖动，且如果用户在期间尝试手动滚动，体验非常糟糕。
- **修复建议**:
  - 改为基于 `ResizeObserver` 或 `visualViewport` 的**单次滚动**：在检测到 keyboard height > 0 后，只 scroll 一次。
  - 或者保留最多 2 个 fallback（如 120ms + 380ms），但用 flag 确保如果目标元素已经在视口内就不再重复 scroll。
- **状态**: ❌ 未修复

### H5: 拖动手势 `touchmove` 中调用 `preventDefault()` 但 `touchstart` 是 passive

- **文件**: `src/utils/mobile.ts:81-82`
- **问题**: `touchstart` 监听器是 `{ passive: true }`，而 `onTouchMove` 中调用了 `e.preventDefault()`。现代浏览器（Chrome、Safari）会忽略 passive listener 中的 `preventDefault()`，控制台可能报错，且页面在拖动时仍会滚动。
- **修复建议**: 将 `touchmove` 的 `passive` 保持为 `false`（当前已经是），但把 `touchstart` 也改为 `{ passive: false }`，或者在不需要滚动拦截的区域不绑定拖动。
- **状态**: ❌ 未修复

---

## 🟡 Medium（可优化）

### M1: iPad 被误判为 desktop

- **文件**: `src/utils/platform.ts:19-21`
- **问题**: iPad Pro / iPad Air 在 iPadOS 13+ 的默认 Safari UA 中不包含 "ipad"，而是伪装成 Macintosh。`isIOS()` 返回 `false`，导致 iPad 上所有移动端优化（键盘调整、drag gesture、touch guard）都不生效。
- **修复建议**:
  ```ts
  export function isIOS(): boolean {
    const ua = (navigator.userAgent || "").toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return true;
    // iPad Pro 13+ detection
    return navigator.maxTouchPoints > 1 && /macintosh/.test(ua);
  }
  ```
- **状态**: ❌ 未修复

### M2: Emoji picker 在键盘已弹出时可能被遮挡

- **文件**: `styles/07-mobile.css:322-337`
- **问题**: Emoji picker 在移动端固定为 `bottom: 0` 的 bottom sheet。如果此时键盘已经弹出（例如用户在备注 textarea 中点击了 emoji picker 按钮），picker 的 `z-index: 10001` 虽然高，但 iOS 键盘的显示层级是由系统控制的，picker 可能仍然被键盘覆盖。
- **修复建议**: 在打开 emoji picker 前，先 `blur()` 当前 active input 让键盘收起，再显示 picker。或者在 picker 打开时监听 keyboard height 并给 picker 加 `padding-bottom: var(--keyboard-height)`。
- **状态**: ❌ 未修复

### M3: 日期导航的 `date-nav-display` 溢出处理不一致

- **文件**: `styles/04-diary.css:393-411` vs `styles/07-mobile.css:656-666`
- **问题**: 桌面端 `.date-nav-display` 有 `text-overflow: ellipsis`，移动端 `@media (max-width: 480px)` 中也加了，但 `07-mobile.css` 末尾的超小屏幕适配（`@media (max-width: 360px)`）中没有针对 `date-nav-display` 做额外处理。在极窄屏幕上日期文本可能溢出。
- **修复建议**: 在 `max-width: 360px` 媒体查询中也给 `.date-nav-display` 加上 `text-overflow: ellipsis; overflow: hidden;`。
- **状态**: ❌ 未修复

### M4: 设置页 `settings-cat-select` 在 iOS 上使用原生 picker，体验突兀

- **文件**: `src/settings/item-settings-list.ts:217-234`
- **问题**: 分类下拉框在 iOS Safari 上会弹出系统底部的 wheel picker，遮挡设置页内容，且 picker 的样式和 Obsidian 主题不一致。
- **修复建议**: 这是一个体验问题而非 bug。如果用户反馈强烈，可以考虑用自定义的 inline 按钮组替代 `<select>`（比如显示当前分类，点击后弹出小卡片选择分类）。优先级不高。
- **状态**: ❌ 未修复（低优先级）

### M5: `setupModalKeyboard` 的 cleanup 可能过度清除样式

- **文件**: `src/utils/mobile-keyboard.ts:189-228`
- **问题**: cleanup 函数清空了 `contentEl.style.width`、`contentEl.style.position` 等。如果 Obsidian 本身或其他插件也依赖这些 style，可能产生副作用。虽然当前未观察到问题，但这是一个潜在风险。
- **修复建议**: 在 `onOpen` 时保存这些样式的旧值，cleanup 时恢复旧值而非清空。
- **状态**: ❌ 未修复（低优先级）

---

## ✅ 已做好的部分（值得保留）

1. **编辑 modal 的 drag gesture 动态边界** (`attachModalDragGesture`) — 上下拖动有 `minOffset` / `maxOffset` 限制，不会拖出视口。
2. **设置页新增项目滚动保持** (`item-settings-list.ts:150,360-364`) — 非新增时保存 `scrollTop`，新增时 `scrollIntoView`，实现较为完善。
3. **移动端 textarea 自增高** — `diary-panel-fields.ts`、`edit-item-modal.ts`、`add-custom-modal.ts` 中的 `attachAutoResize` 工作正常，避免了内部滚动条。
4. **底部操作按钮 sticky + safe-area** — `.little-milestones-actions` 在移动端有 `env(safe-area-inset-bottom)` 处理，不会被 Home Indicator 挡住。
5. **Popup 移动端 bottom-sheet 化** — `.little-milestones-value-popup` 在移动端改为从底部滑出，符合 iOS 用户习惯。
6. **font-size: 16px 防止 iOS 缩放** — 多处输入框已设 `font-size: 16px`，正确阻止了 iOS 聚焦时的页面缩放。

---

## 修复优先级建议

| 优先级 | 问题 | 预估影响 |
|--------|------|----------|
| P0 | C1（子 modal super.onOpen 顺序） | 编辑弹窗键盘遮挡 |
| P0 | C2（主 modal 禁用键盘调整） | 日记 Tab 键盘遮挡 |
| P0 | C3（日记字段 scrollOnIOSFocus=false） | 日记输入无法看到 |
| P1 | H1（readonly guard 阈值） | 设置页点击无响应 |
| P1 | H2（日记工具栏占空间） | 日记输入区位置过低 |
| P1 | H3（卡片备注字太小） | 内容看不清 |
| P2 | H4（retry scroll storm） | 滚动抖动 |
| P2 | H5（passive touchstart + preventDefault） | 拖动时页面可能滚动 |
| P3 | M1（iPad 检测） | iPad 无移动端优化 |
| P3 | M2（emoji picker 遮挡） | picker 被键盘盖 |

---

*Reviewed by: kimi-code*
*Date: 2026-04-22*

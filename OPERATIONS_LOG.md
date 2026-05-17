# Little Milestones 插件 — 操作与审查日志

> 自动生成于 `2026-04-15T23:17+08:00`  
> 用途：记录代码审查、修复决策、部署过程与沟通上下文，便于后续回溯与流程优化。

---

## 目录
1. [项目背景](#项目背景)
2. [审查时间线](#审查时间线)
3. [修复批次](#修复批次)
4. [修改文件清单](#修改文件清单)
5. [已知债务与后续建议](#已知债务与后续建议)
6. [沟通摘要](#沟通摘要)
7. [附录：关键代码引用](#附录关键代码引用)

---

## 项目背景

- **项目**：`obsidian-little-milestones`（Obsidian 插件）
- **来源**：从 3,564 行编译后的 `main.js` 迁移到 TypeScript（`src/` 约 3,000+ 行）
- **构建**：esbuild + TypeScript，目标 ES2018，入口 `src/main.ts`
- **测试平台**：Windows 桌面、Android 模拟器（Pixel 6）、iOS 真机
- **Vault 路径**：`C:\Users\FinalHome\Documents\Obsidian Vault\.obsidian\plugins\little-milestones`

### 本次会话前已完成的工作
- 全量 TS 迁移：`KidScorePlugin`、`DailyScoringModal`、`StatsModal`、`KidScoreSettingTab`、`BaseMobileModal` 及工具函数
- 移动端键盘适配（`visualViewport` + iOS `translateY` push）
- Windows 输入修复（移除 `pointerup`/`click` 拦截器）
- 中文排版优化（`word-break`、`line-height`、textarea `resize`）
- 数据安全：增加 `renameUserInFiles()` 和 `migrateSavePath()`
- 修复关键崩溃：`(self.app as any).MarkdownRenderer.render` 为 `undefined`，改为直接从 `obsidian` import

---

## 审查时间线

### Phase 1.1 — API 规范审查 ✅
| 检查项 | 结果 | 备注 |
|---|---|---|
| `MarkdownRenderer` 上下文 | 通过 | 已修复为正确 import |
| `onClose` 清理 | 通过 | `BaseMobileModal` 正确调用 `_kbCleanup()` |
| 事件监听器配对 | 通过 | `setupModalKeyboard` 返回 cleanup 函数并正确移除 |
| Vault 操作覆盖 | **遗留** | `renameUserInFiles` 和 `migrateSavePath` 缺少 `try/catch` |

### Phase 1.2 — 架构审查 ✅
| 检查项 | 结果 | 备注 |
|---|---|---|
| 循环引用 | 通过 | 无运行时循环依赖 |
| 代码组织 | **债务** | `daily-scoring-modal.ts` 含 7 个内联匿名 Modal |
| 样式组织 | **债务** | `styles.css` 单文件 2,589 行，未按模块拆分 |

### Phase 2 — 多设备兼容与稳定性 ✅
| 检查项 | 结果 | 备注 |
|---|---|---|
| iOS 键盘处理 | **问题** | `offsetTop` 计算受 `offsetParent` 影响，textarea 仍可能被遮挡 |
| Android 返回手势 | **问题** | Emoji Picker 和 Template Picker 是 DOM overlay，不在 Modal 栈中，返回键会关闭底层 Modal |
| Vault 迁移健壮性 | **问题** | 迁移非原子操作，失败时可能导致文件重复或丢失 |
| 数据同步冲突 | 已缓解 | 用户已关闭 Obsidian Sync 插件同步 |

### Phase 3 — 中文排版 ✅
| 检查项 | 结果 | 备注 |
|---|---|---|
| 长文本折行 | **轻微问题** | `.card-note` 使用 `break-all` 对英文不友好 |
| 行高与可读性 | 通过 | `line-height: 1.6` 已配置在 textarea 和 rules view |

### Phase 4 — UI 视觉系统 ✅
| 检查项 | 结果 | 备注 |
|---|---|---|
| 硬编码颜色 | **债务** | 多处 `#fef3c7`、 `#dc2626`、 `#16a34a` 等未使用 CSS 变量，深色模式可能不协调 |
| 遮罩层级 | 通过 | 功能正常 |

---

## 修复批次

### Batch 1: P0 — 核心稳定性修复

#### 1. `renameUserInFiles` 异常保护
**文件**：`src/main.ts:538`
- 原逻辑：循环中直接 `await vault.read/modify`，无异常捕获
- 修复：每个文件操作包裹 `try/catch`，失败时记录 `console.error` 并继续；全部处理完后若 `errorCount > 0` 则抛出汇总错误
- 调用侧（`settings-tab.ts:148`）同样加了 `try/catch`，错误通过 `Notice` 提示用户

#### 2. `migrateSavePath` 异常保护
**文件**：`src/main.ts:554`
- 原逻辑：rename/modify+delete 无异常捕获，若 delete 失败会导致重复文件
- 修复：每个文件包裹 `try/catch`，继续处理剩余文件，最后统一报错
- 调用侧（`settings-tab.ts:168`）加了 `try/catch`

#### 3. `saveDayData` 异常保护
**文件**：`src/main.ts:268`
- 原逻辑：整个保存函数无 `try/catch`
- 修复：函数体包裹 `try/catch`，失败时 `new Notice(...)` 并重新抛出异常，防止 Modal 在未知状态下关闭
- 调用侧（`daily-scoring-modal.ts:330`）加了 `try/catch`，保存失败不再自动关闭 Modal

#### 4. iOS 键盘遮挡 TEXTAREA 计算修正
**文件**：`src/utils/mobile.ts:63-73`
- 原逻辑：使用 `target.offsetTop + target.offsetHeight` 计算位置，但 `offsetTop` 是相对于 `offsetParent` 的，中间存在 wrapper div 时计算偏差
- 修复：改为 `getBoundingClientRect()` 获取视口绝对位置，再换算为相对于 `contentEl` 的坐标
```ts
// 修正后
const targetRect = target.getBoundingClientRect();
const contentRect = contentEl.getBoundingClientRect();
const targetBottom = targetRect.bottom - contentRect.top + contentEl.scrollTop;
```

---

### Batch 2: P1 — 交互与健壮性修复

#### 5. Android 返回键拦截 DOM overlay
**文件**：`src/ui/emoji-picker.ts`, `src/modals/daily-scoring-modal.ts:357-404`
- 问题：Emoji Picker 和 Template Picker 是直接挂载在 `document.body` 的 DOM overlay，Android 物理返回键/手势会关闭 Modal 栈中的底层 Modal，导致 overlay "孤儿" 留在屏幕上
- 修复：
  1. 打开 overlay 时执行 `history.pushState({ kidScoreOverlay: true }, "")`
  2. 监听 `window.popstate`，若事件状态匹配则先移除 overlay
  3. 关闭 overlay 时执行 `history.back()` 清理历史状态

#### 6. 批量补全 async 回调 try/catch
**文件**：`src/modals/daily-scoring-modal.ts`, `src/settings/settings-tab.ts`
共修复 **9 处** 用户触发的 `async onclick`：

| # | 位置 | 操作 |
|---|---|---|
| 1 | `daily-scoring-modal.ts:132` | 切换用户 |
| 2 | `daily-scoring-modal.ts:330` | 保存记录 |
| 3 | `daily-scoring-modal.ts:849` | 编辑项目保存 |
| 4 | `daily-scoring-modal.ts:909` | 删除打分项 |
| 5 | `daily-scoring-modal.ts:973` | 添加新项目 |
| 6 | `settings-tab.ts:56` | 删除用户 |
| 7 | `settings-tab.ts:125` | 添加用户 |
| 8 | `settings-tab.ts:324` | 删除分类 |
| 9 | `settings-tab.ts:551` | 删除打分项 |
| 10 | `settings-tab.ts:577` | 添加项目 |

所有错误均通过 `new Notice("❌ ...")` 反馈，避免静默失败。

---

### Batch 3: P2 — 中文排版优化

#### 7. `word-break` 优化
**文件**：`styles.css:211-222`
- 原：`.card-note { word-break: break-all; }`
- 修复：
```css
.card-note {
  word-break: break-word;
  overflow-wrap: break-word;
}
```
- 效果：中文长句正常折行，英文单词不再被粗暴截断。

---

## 修改文件清单

```
src/main.ts                      # renameUserInFiles, migrateSavePath, saveDayData 异常保护
src/settings/settings-tab.ts     # 调用侧 try/catch, 批量 async 回调保护
src/modals/daily-scoring-modal.ts # saveDayData 调用保护, async 回调保护, template overlay 返回拦截
src/utils/mobile.ts              # iOS textarea 键盘遮挡计算修正
src/ui/emoji-picker.ts           # Android 返回键拦截
styles.css                       # word-break 优化
```

---

## 已知债务与后续建议

### 高优先级（建议下次迭代处理）
1. **代码组织**：`daily-scoring-modal.ts` 中 7 个内联匿名 Modal 应提取为独立组件文件，降低维护成本。
2. **样式拆分**：`styles.css` 单文件 2,589 行，建议按模块拆分为：
   - `styles/modal.css`
   - `styles/mobile.css`
   - `styles/settings.css`
   - `styles/components.css`

### 中优先级
3. **深色模式颜色适配**：硬编码颜色（如 `#fef3c7`, `#dc2626`, `#16a34a`）建议替换为 Obsidian CSS 变量或增加 `@media (prefers-color-scheme: dark)` 适配。
4. **Vault 迁移原子性**：当前 `migrateSavePath` 是逐文件处理，理想情况下应增加「预检查+事务日志」机制，但在 Obsidian API 限制下较难实现完全原子性。

### 低优先级 / 测试验证
5. **iOS 键盘 ratio 调参**：`translateY` 的 `0.55/0.65` ratio 和 `220/260` maxOffset 在真机上可能需要根据屏幕高度进一步微调。
6. **Android 物理返回键多 overlay 嵌套**：目前只处理了单层 overlay 的 `history.pushState`，若未来出现 overlay 嵌套，需要维护一个 overlay 栈计数器。

---

## 沟通摘要

**2026-04-15**
- 用户要求完成全部 review 阶段后再统一修复。
- 我完成了 Phase 1.1、1.2、2、3、4 的审查，并输出了完整的问题清单和修复建议。
- 用户确认：**"1，按优先级批量修复问题。注意如果需要消耗太多token而导致任务终端就将任务拆解分步完成。"**
- 我按 P0 → P1 → P2 的顺序分批修复，最终全部完成并部署到 Obsidian Vault 测试目录。
- 用户随后要求：**"从现在开始，你生成一个可回溯的操作日志，方便以后发现问题和修改问题，并且记录我们的沟通过程，还可以优化以后的修改流程。"**
- 于是生成此日志文件 `OPERATIONS_LOG.md`。

---

## 附录：关键代码引用

### A. `renameUserInFiles` 异常处理核心逻辑
```ts
async renameUserInFiles(oldName: string, newName: string): Promise<void> {
  // ...
  let errorCount = 0;
  for (const file of files) {
    try {
      // read + regex replace + modify
    } catch (e) {
      errorCount++;
      console.error("[Little Milestones] renameUserInFiles failed for", file.path, e);
    }
  }
  if (errorCount > 0) {
    throw new Error("用户名同步失败 " + errorCount + " 个文件，请查看控制台日志");
  }
}
```

### B. Android 返回键拦截核心逻辑
```ts
const removeOverlay = () => {
  overlay.remove();
  window.removeEventListener("popstate", onPopstate);
  if ((history.state as any)?.kidScoreOverlay) {
    history.back();
  }
};

const onPopstate = (e: PopStateEvent) => {
  if ((e.state as any)?.kidScoreOverlay) {
    overlay.remove();
    window.removeEventListener("popstate", onPopstate);
  }
};
history.pushState({ kidScoreOverlay: true }, "");
window.addEventListener("popstate", onPopstate);
```

### C. iOS 键盘遮挡修正核心逻辑
```ts
const targetRect = target.getBoundingClientRect();
const contentRect = contentEl.getBoundingClientRect();
const targetBottom = targetRect.bottom - contentRect.top + contentEl.scrollTop;
const containerBottom = contentEl.scrollTop + contentEl.clientHeight;
if (targetBottom > containerBottom - 40) {
  contentEl.scrollTop = targetBottom - contentEl.clientHeight + 80;
}
```

---

*End of Log*

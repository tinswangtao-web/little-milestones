# 🌱 Little Milestones — Obsidian 插件审核反馈汇总

> 审核来源：Obsidian Community 自动化审核系统（2026-05-17）
> 审核版本：commit c2e3edf（main 分支最新）
> 插件 ID：kid-score | 名称：🌱 Little Milestones | 版本：2.0.0

---

## 一、Obsidian 官方自动化审核结果（原文）

### 🔴 Error（必须修复）

| # | 类别 | 问题 | 位置 |
|---|------|------|------|
| E1 | Manifest | The plugin ID in manifest.json (`little-milestones`) does not match the existing plugin ID (`kid-score`) | manifest.json:2 |
| E2 | README | Repository is missing a README file. A README is required and should describe what the plugin does, how to install it, and how to use it. | 仓库根目录 |

> **注意**：E1 是因为我们刚把 manifest.json 的 id 改回 `kid-score` 但还未创建新的 GitHub Release，所以当前 Release 中的 manifest.json 还是旧的 `little-milestones`。E2 是旧 Release 的扫描结果，README 已经添加到仓库中但同样还未包含在 Release 中。**两者都需要通过创建新的 GitHub Release 来解决。**

### 🟡 Warning（建议修复）

| # | 类别 | 问题 | 位置 |
|---|------|------|------|
| W1 | Manifest | The plugin name in manifest.json (`🌱 Little Milestones`) does not match the existing plugin name (`Little Milestones 🌱`) | manifest.json:3 |
| W2 | Manifest | Plugin description should end with punctuation (., !, or ?) | manifest.json:6 |
| W3 | Releases | The manifest.json in the release differs from the one in the repository root. Mismatched fields: name. | Release vs 仓库 |
| W4 | Source code | `"builtin-modules"` should be replaced with an alternative package. | package.json:20 |
| W5 | CSS lint | Unexpected duplicate `line-height` | styles.css:1271, styles/04-diary.css:22 |
| W6 | CSS lint | Avoid `!important` — override styles by increasing selector specificity or using CSS variables instead. | styles.css:669, 670, 671, 806, 807, 808 |
| W7 | CSS lint | Unexpected duplicate selector `.desktop-diary-panel .diary-module-grid`, first used at line 1515 | styles.css:1529 |
| W8 | CSS lint | Unexpected duplicate selector `.diary-preview-btn`, first used at line 1356 | styles.css:1711 |
| W9 | CSS lint | Unexpected duplicate selector `.completion-row`, first used at line 1888 | styles.css:2113 |
| W10 | CSS lint | Unexpected duplicate selector `.completion-name`, first used at line 3382 | styles.css:3413 |
| W11 | CSS lint | Unexpected duplicate selector `.kid-score-cat-row`, first used at line 3554 | styles.css:4368 |
| W12 | CSS lint | Unexpected duplicate selector `.settings-item-note-row`, first used at line 4150 | styles.css:4374 |
| W13 | CSS lint | Avoid `:has` — it can cause significant performance issues due to broad selector invalidation. | styles.css:4199, 4202, styles/07-mobile.css:983, 986 |
| W14 | CSS lint | Unexpected duplicate selector `.desktop-diary-panel .diary-module-grid`, first used at line 266 | styles/04-diary.css:280 |
| W15 | CSS lint | Unexpected duplicate selector `.diary-preview-btn`, first used at line 107 | styles/04-diary.css:462 |
| W16 | CSS lint | Unexpected duplicate selector `.completion-row`, first used at line 72 | styles/05-stats.css:297 |
| W17 | CSS lint | Unexpected duplicate selector `.completion-name`, first used at line 166 | styles/07-mobile.css:197 |
| W18 | CSS lint | Unexpected duplicate selector `.kid-score-cat-row`, first used at line 338 | styles/07-mobile.css:1152 |
| W19 | CSS lint | Unexpected duplicate selector `.settings-item-note-row`, first used at line 934 | styles/07-mobile.css:1158 |

### 🟢 Pass（通过）

| # | 类别 | 结果 |
|---|------|------|
| P1 | Network requests | No suspicious network patterns found. |
| P2 | Vault Read | Reads individual vault files via the Obsidian API (vault.read, vault.cachedRead) |
| P3 | Vault Write | Creates or modifies vault files via the Obsidian API (vault.modify, vault.create, etc.) |
| P4 | Dependencies | No vulnerable dependencies found. |

### 💡 Recommendation（建议）

| # | 类别 | 建议 |
|---|------|------|
| R1 | Releases | The main.js release asset does not have a GitHub artifact attestation. |
| R2 | Releases | The styles.css release asset does not have a GitHub artifact attestation. |
| R3 | Behavior | Vault Enumeration: Enumerates all files in the vault (vault.getFiles, getMarkdownFiles, etc.). Gives the plugin access to every file path in the vault. |

---

## 二、AI 代码审查建议（补充）

### 🔴 P0 — 应尽快修复

**1. CSS 重复选择器（约10个选择器重复3-5次）**

编译后的 `styles.css` 中大量选择器重复定义，根因是 desktop/mobile 响应式覆盖和不同 CSS 模块文件中的独立定义。

高频重复选择器统计：
- `.kid-score-card` — 5次
- `.kid-score-user-add-btn` — 5次
- `.kid-score-stats-btn` — 5次
- `.diary-tool-btn` — 5次
- `.settings-note-input` — 4次
- `.kid-score-main-tab` — 4次
- `.kid-score-grid` — 4次
- `.date-nav-btn` — 4次
- `.custom-delete-btn` — 4次

**建议**：
- 将共享基础样式集中到 `00-base.css`，其他文件只做增量覆盖
- desktop/mobile 差异优先使用 CSS 变量 + 条件 class（如 `.is-mobile`）
- 引入 `stylelint` 的 `no-duplicate-selectors` 规则到构建流程

**2. `sanitizeDoubleTapThreshold` 重复定义**

`main.ts` 第131-135行与 `normalize-settings.ts` 第98-105行完全相同的函数。

**建议**：删除其中一个，统一到 `utils/platform.ts`。

### 🟡 P1 — 建议改进

**3. `obsidian` 依赖版本锁定**

`package.json` 中 `"obsidian": "latest"` 应锁定到具体版本（如 `"^1.5.0"`），避免 Obsidian 发布破坏性更新时意外引入兼容性问题。

**4. `DailyScoringModal.diaryDrafts` 静态 Map 缺少清理策略**

`daily-scoring-modal.ts` 第59行的 `private static diaryDrafts = new Map<string, DiaryDraftState>()` 会随用户切换日期无限累积条目。

**建议**：添加 LRU 策略或最大条目限制（如50个）。

**5. `history.state as any`（4处）**

`emoji-picker.ts` 第74/207行、`calendar-picker.ts` 第38/106行使用了 `as any`。

**建议**：定义 `KidScoreHistoryState` 接口替代。

**6. `attachPressGesture` 缺少 cleanup 返回值**

`press-gesture.ts` 添加了6个事件监听器但不返回清理函数，与 `bindTouchScrollGuard` 的模式不一致。

**7. `bindMobileTabSwipe` 事件监听器未在 `onClose` 中清理**

`daily-scoring-modal.ts` 第397-402行绑定的 pointer 事件监听器没有在 `onClose()` 中移除。虽然当前因为 DOM 重建不会泄漏，但不够严谨。

**建议**：使用 Obsidian 的 `this.registerDomEvent()` 自动管理生命周期。

**8. 缺少 `onunload()` 生命周期方法**

`main.ts` 中没有 `onunload()` 方法。建议添加显式的 `onunload()`，便于未来扩展。

### 🟢 P2 — 锦上添花

**9. `DailyScoringModal` 职责过重（655行）**

管理了打分状态、日记草稿、日期切换、Tab 切换、手势滑动、自定义事项 CRUD 等。

**建议**：将日记草稿管理提取到独立的 `DiaryDraftManager` 类。

**10. `getAllScores()` 缓存策略偏弱**

`day-data-store.ts` 缓存 TTL 仅5秒，且 `compose()` 每次保存都强制跳过缓存。

**建议**：延长 TTL 到30秒，或在 `compose()` 中传入已有 `allScores`。

**11. TypeScript strict 模式**

`tsconfig.json` 只启用了 `strictNullChecks`，建议启用完整 `strict: true`。

**12. `navigator.vibrate` 和 `CSSStyleDeclaration` 类型扩展**

`base-mobile-modal.ts` 和 `mobile-keyboard.ts` 中有内联类型断言。

**建议**：通过 `.d.ts` 声明文件扩展接口。

---

## 三、修复优先级总结

| 优先级 | 数量 | 说明 |
|--------|------|------|
| 🔴 P0 | 3 | CSS 重复选择器、函数重复定义、创建新 Release 解决 Error |
| 🟡 P1 | 6 | 依赖版本锁定、内存泄漏风险、类型安全、事件清理 |
| 🟢 P2 | 4 | 架构优化、缓存策略、TypeScript strict、类型声明 |

**最关键的下一步**：创建一个新的 GitHub Release（版本 2.0.1），包含最新的 manifest.json（id=kid-score）、README.md、main.js、styles.css，这将自动解决 E1、E2、W3 三个 Error/Warning。

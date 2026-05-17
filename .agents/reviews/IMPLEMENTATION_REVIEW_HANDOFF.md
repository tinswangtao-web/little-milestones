# Implementation Review Handoff

## 任务
- `slug`: 2026-05-17-obsidian-review-remediation
- `status`: awaiting-review
- `round`: 1

## 用户原话目标
Obsidian 官方审核反馈在 `REVIEW-FEEDBACK.md`，architect 已做初步判断，需要 builder AI 做“官方审核整改第一轮”的最小实现。直接修改文件，完成本地验证，最后列出改动文件和验证结果。不要 commit，不要同步 Vault，不要创建 GitHub Release。

## 改动文件列表（本轮）
| 文件 | 改动性质 |
|------|----------|
| `manifest.json` | 名称改为官方现有名称 `Little Milestones 🌱`；版本改为 `2.0.1`；`id` 保持 `little-milestones` |
| `package.json` / `package-lock.json` | 版本改为 `2.0.1`；移除 `builtin-modules` devDependency 与 lock 条目 |
| `versions.json` | 新增 `"2.0.1": "0.15.0"` |
| `README.md` | 手动安装路径改为 `.obsidian/plugins/little-milestones` |
| `esbuild.config.mjs` | 改用 Node 内置 `node:module` 的 `builtinModules`，external 覆盖裸模块名与 `node:` 前缀 |
| `src/utils/platform.ts` | 新增共享 `sanitizeDoubleTapThreshold()` |
| `src/main.ts` | 复用共享阈值 sanitizer；新增显式空 `onunload()` |
| `src/settings/normalize-settings.ts` | 复用共享阈值 sanitizer，删除重复实现 |
| `src/utils/history-state.ts` | 新增窄类型 helper，替代 overlay popstate 里的 `as any` |
| `src/ui/emoji-picker.ts` | overlay 增加 `is-emoji-picker` class；替换 2 处 `history.state as any` |
| `src/modals/popups/calendar-picker.ts` | 替换 2 处 `history.state as any` |
| `src/modals/daily-scoring-modal.ts` | 日记草稿 Map 增加 50 条上限；移动端 tab swipe 改由 `Component.registerDomEvent()` 注册并在 render/close 时 unload |
| `src/modals/helpers/press-gesture.ts` | `attachPressGesture()` 返回 cleanup，清理 timeout 与 6 个监听器 |
| `styles/04-diary.css` | 移除 `.little-milestones-main-tab` 重复 `line-height`；以更具体 selector 替代 6 个 `!important`；合并指定重复 selector |
| `styles/05-stats.css` | 合并 `.completion-row` 重复 selector |
| `styles/07-mobile.css` | 移除 `:has(.little-milestones-emoji-fullpicker)`；合并指定重复 selector |
| `styles.css` / `main.js` | `npm run build` 生成产物 |
| `.agents/**` | 新任务卡、状态、日志、锁释放、handoff 更新 |

## 用户可见变化
1. 插件清单与 npm 元数据准备为 `2.0.1`，manifest 名称与官方既有名称对齐。
2. README 手动安装路径从旧目录名改为插件 ID 目录 `.obsidian/plugins/little-milestones`。
3. 构建不再依赖 `builtin-modules` 包。
4. Emoji picker 移动端布局不再依赖 CSS `:has()`。
5. 打分页移动端 tab 滑动、按压手势、日记草稿缓存的用户行为应保持不变；内部增加生命周期清理与缓存上限。

## 已做验证
- `npm run build`：通过，输出 `styles.css built from 9 modules`，生成 `main.js` / `styles.css`。
- `npx tsc --noEmit`：通过。
- `node --check main.js`：通过。
- `git diff --check`：退出码 0；仅提示 `styles/05-stats.css` 工作区换行将来被 Git 触碰时 CRLF 转 LF。
- `rg -n ":has|builtin-modules|history\\.state as any|as any" package.json package-lock.json esbuild.config.mjs src styles styles.css`：无匹配。
- `git diff -- package.json package-lock.json`：只包含 `2.0.1` 版本更新、移除 `builtin-modules` 依赖与 lock 条目，未引入无关依赖大面积改动。

## Follow-up 2026-05-17 12:54 +0800
- Architect 复查发现 W6 仍有遗漏：`styles.css:669-671,806-808` 源自 `styles/02-popups.css` 两组输入可点击/可选中文字规则。
- 已将 `.value-popup-input` 改为 `.little-milestones-value-overlay .little-milestones-value-popup .value-popup-input`，将 edit/import modal 输入组改为 `.modal.little-milestones-... .modal-content ...`，移除这 6 个 `!important`，保留 `pointer-events: auto`、`-webkit-user-select: text`、`user-select: text`、`touch-action: manipulation`。
- 已运行 `npm run build` 生成 `styles.css`。
- 复跑 `npx tsc --noEmit`、`node --check main.js`、`git diff --check` 均通过；`git diff --check` 仍只有 `styles/05-stats.css` CRLF 提示且退出码 0。
- `rg -n "pointer-events: auto !important|-webkit-user-select: text !important|user-select: text !important" styles/02-popups.css styles.css` 无匹配。

## 风险与开放点
1. **release-only**：E1、E2、W3 仍需新的 GitHub Release 才能让官方扫描到最新 `manifest.json` / README / release assets；本轮未创建 Release。
2. **release-only**：R1、R2 artifact attestation 需要发布流程解决；本轮未生成 attestations。
3. **deferred**：R3 Vault Enumeration 解释文档不纳入本轮。
4. **deferred**：`obsidian` 依赖版本锁定、`DailyScoringModal` 大拆分、`getAllScores()` 缓存策略、`strict: true`、全局 `.d.ts` 不纳入本轮。
5. **需严格 review**：本轮涉及移动端触摸事件生命周期、CSS `!important` 窄移除、改动超过 3 个文件；二次修正后 W6 官方定位的 popup 输入 `!important` 已清除，仍建议移动端验证输入可点击与可选中文字。
6. **工作区状态**：本轮未触碰既有 `agent-collaboration-kit/**` 删除和未跟踪 `REVIEW-FEEDBACK.md`；review 时请与本任务 diff 分开看。

## 是否要求严格 review
是。本轮改动超过 3 个文件，并涉及移动端触摸事件生命周期与发布元数据。

## 建议用户验收步骤
1. Review AI / architect 先审查本轮 diff，重点看发布元数据、`builtinModules` external、移动端 tab swipe cleanup 与 CSS 窄修是否有回归风险。
2. 在 Obsidian 桌面端打开插件，确认 ribbon、打分页、日记 tab 正常打开，README 安装路径无需手测。
3. 在移动端或模拟移动端验证打分页左右滑动切换 tab、score card 单击/双击/长按、emoji picker 打开与关闭。
4. 准备发布前再走 Release 流程，确认 release asset 中 `manifest.json`、`main.js`、`styles.css` 与仓库构建产物一致。

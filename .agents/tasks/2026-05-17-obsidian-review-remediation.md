# Obsidian 官方审核整改第一轮

- **slug**: 2026-05-17-obsidian-review-remediation
- **created**: 2026-05-17
- **owner**: builder-ai
- **status**: awaiting-review
- **origin**: 用户要求按 `REVIEW-FEEDBACK.md` 与 architect 初步判断，做“官方审核整改第一轮”的最小实现。
- **sync-to-vault**: n/a
- **write-scope**: `manifest.json`, `package.json`, `package-lock.json`, `versions.json`, `README.md`, `esbuild.config.mjs`, `src/**`, `styles/**`, `styles.css`, `.agents/**`
- **read-scope**: `REVIEW-FEEDBACK.md`, `manifest.json`, `package.json`, `package-lock.json`, `versions.json`, `README.md`, `esbuild.config.mjs`, `src/**`, `styles/**`, `.agents/**`

## 目标

在不创建 GitHub Release、不同步 Vault、不扩大重构的前提下，完成仓库内可修的 Obsidian 官方审核整改：发布元数据、source/dependency warning、指定 CSS lint warning，以及低风险代码质量项。

## 必须完成

- [x] `manifest.json` 名称改为官方现有名称 `Little Milestones 🌱`，版本准备到 `2.0.1`。
- [x] `package.json` / `package-lock.json` / `versions.json` 准备 `2.0.1` 发布元数据。
- [x] README 手动安装路径改为 `.obsidian/plugins/little-milestones`。
- [x] 移除 `builtin-modules` 依赖，改用 Node 内置 `node:module`。
- [x] 窄修官方列出的 CSS lint warning：重复 `line-height`、`:has()`、同源重复 selector。
- [x] 低风险代码质量项：复用 `sanitizeDoubleTapThreshold`、移除 4 处 `history.state as any`、限制日记草稿 Map、注册移动端 tab swipe DOM 事件、给 `attachPressGesture` 返回 cleanup、添加空 `onunload()`。
- [x] 更新 `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`。

## 非目标

- [ ] 不创建 GitHub Release。
- [ ] 不生成 artifact attestation。
- [ ] 不同步 Vault。
- [ ] 不做 `DailyScoringModal` 大拆分、`getAllScores()` 缓存策略改造、`strict: true` 全量开启、全局 `.d.ts` 扩展。
- [ ] 不做全站 CSS 结构重构或新增 stylelint。

## 验证

- [x] `npm run build`
- [x] `npx tsc --noEmit`
- [x] `node --check main.js`
- [x] `git diff --check`
- [x] 确认 `package-lock.json` 未引入无关依赖大面积改动。

## 风险与回滚

- 风险：CSS `!important` 清理可能受 Obsidian Mobile 主题覆盖影响；若无法确定安全性，优先保守处理并记录待真机验证。
- 风险：移动端触摸/返回逻辑涉及事件生命周期，需要严格 review。
- 回滚：撤回本任务涉及的元数据、CSS 窄修、工具 helper 与事件清理改动，重新构建 `styles.css`。

## 记录

- 2026-05-17 12:38 +0800：新建任务卡并取得 `builder-ai` 写锁；确认本轮不触碰既有 `agent-collaboration-kit/**` 删除和未跟踪 `REVIEW-FEEDBACK.md`，不 commit、不同步 Vault、不创建 GitHub Release。
- 2026-05-17 12:46 +0800：第一轮最小实现完成。已改 2.0.1 元数据、README 安装路径、`builtin-modules` 替换、官方点名 CSS 窄修、`sanitizeDoubleTapThreshold` 复用、history state 窄类型、日记草稿 50 条上限、移动 tab swipe 生命周期清理、`attachPressGesture` cleanup、空 `onunload()`；`npm run build`、`npx tsc --noEmit`、`node --check main.js`、`git diff --check` 均通过（`git diff --check` 仅提示 `styles/05-stats.css` CRLF 将来被 Git 触碰时转 LF，退出码 0）。未 commit、未同步 Vault、未创建 GitHub Release。等待严格 review。
- 2026-05-17 12:54 +0800：按 architect 复查反馈补修 W6 遗漏项。`styles/02-popups.css` 中 `.value-popup-input` 与 edit/import modal input/textarea/select 两组选择器改为更具体 selector，并移除官方定位的 6 个 `!important`；运行 `npm run build` 更新 `styles.css`。`npm run build`、`npx tsc --noEmit`、`node --check main.js`、`git diff --check` 均通过（仍仅有 `styles/05-stats.css` CRLF 提示，退出码 0）；`rg` 确认 `pointer-events/user-select` 三项的 `!important` 在 `styles/02-popups.css` 与 `styles.css` 中无残留。未 commit、未同步 Vault。

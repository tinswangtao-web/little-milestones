# 当前 Working Tree 整理 v2

- **slug**: 2026-04-28-working-tree-organization-v2
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: n/a
- **write-scope**: `.agents/**`
- **read-scope**: `src/**`, `styles/**`, `main.js`, `styles.css`, `scripts/**`, `esbuild.config.mjs`, `.agents/**`
- **origin**: from `2026-04-28-organize-working-tree`

## 用户需求

- 按当前最新状态重新整理 working tree，明确哪些改动可以成组处理，哪些还需要验证或修正记录。

## 最新分组

### 1. 已提交：保存后自动打开得分页

- commit: `e6b3761`
- 已提交文件：`src/modals/daily-scoring-modal.ts`、`main.js` 对应保存后打开得分页片段、`.agents/tasks/2026-04-28-open-md-after-save.md`
- 当前剩余 diff 中只保留该 task card 的 commit hash 记录补充。

建议：可随维护记录一起提交，也可单独作为 `.agents` 记录补丁。

### 2. 维护类改动：协议与协作规则

- `AGENTS.md`
- `.agents/README.md`
- `.agents/AGENT_RULES.md`
- `.gitattributes`
- `.agents/reviews/2026-04-28-protocol-feedback.md`
- `.agents/tasks/2026-04-28-codex-cursor-workflow.md`
- `.agents/tasks/2026-04-28-protocol-hardening.md`

内容：
- Codex 默认实现/集成，Cursor 默认 review，ChatGPT advisory-only。
- 未经用户明确“commit/提交”不得创建 commit。
- 需求变化必须新建 task card。
- 实验 UX 改动必须写 rollback。
- CSS 大 diff 先查 EOL。
- 新增 LF 行尾策略。

建议提交名：`[codex] harden agent workflow rules`

### 3. 维护类改动：deploy 门禁

- `scripts/deploy.mjs`
- `.agents/tasks/2026-04-28-deploy-guard.md`

内容：
- deploy 前检查必需产物。
- `--no-build` 检查源码是否比产物新。
- 同步后 SHA-256 校验 Vault 与 workspace 三文件。
- 新增 `--verify-only`。
- Vault 目标路径来源与复制失败错误更清晰。

验证：
- `npm run deploy`
- `node scripts/deploy.mjs --verify-only`
- 临时破坏 Vault `manifest.json` 后 verify-only 非 0，恢复后通过
- `node --check scripts/deploy.mjs`
- `node scripts/deploy.mjs --no-build`

建议提交名：`[codex] guard vault deploy verification`

### 4. 维护类改动：CSS EOL 清理

- `.gitattributes`
- `esbuild.config.mjs`
- `styles/04-diary.css`
- `styles.css`
- `.agents/tasks/2026-04-28-css-eol-cleanup.md`

内容：
- `styles/04-diary.css` 和 `styles.css` 工作区规范为 LF。
- `buildStyles()` 合并 CSS 时统一换行。
- `git diff --ignore-space-at-eol` 现在只显示真实样式变化。

注意：普通 `git diff` 仍会显示较大的 `styles/04-diary.css` / `styles.css`，这是一次性行尾规范化造成的，属于本组预期。

建议提交名：`[codex] normalize css line endings`

### 5. 已验收移动端小修：输入框触摸聚焦

- `src/utils/dom.ts`
- `main.js` 对应 `bindTouchScrollGuard` 构建片段

内容：
- scroll guard 只释放本次锁住的 readonly 字段。
- 轻触输入框时保留/恢复目标输入框 focus，降低 iOS 输入框点不开的概率。

状态：用户已确认当前移动端体验可以；补充任务卡见 `.agents/tasks/2026-04-28-mobile-touch-focus.md`。

建议提交名：`[codex] improve mobile touch input focus guard`

### 6. 已验收移动端样式：底部按钮与 emoji 控件尺寸

- `styles/07-mobile.css`
- `styles.css` 对应移动端样式片段
- `.agents/tasks/2026-04-28-mobile-emoji-sheet.md`

内容：
- `打分页` 底部统计按钮回到第一行。
- emoji 输入/选择按钮从 46px 左右放大到 56px 左右。

状态：
- 已更正 task card，移除未实现的 `src/ui/emoji-picker.ts` / sheet touch-drag 描述。
- 用户已确认当前移动端效果可以，任务卡标记 completed。

建议提交名：`[codex] refine mobile score actions and emoji controls`

### 7. 已提交但记录未完全收尾：桌面日记布局

- `styles/04-diary.css`
- `styles.css` 对应桌面日记单列片段
- `.agents/tasks/2026-04-28-desktop-diary-layout.md`

状态：
- 相关功能 commit 已存在：`f4818a8` 和后续 `cfeadf9`。
- task card 已标记 completed / sync done。
- 当前样式 diff 里仍能看到单列改动，因为后来 EOL/build 让生成文件重现了真实样式差异。

建议：随 CSS EOL / 样式记录组一起提交，避免再次误判为未完成任务。

## 建议顺序

1. 已提交维护类协议硬化：`a9db932`
2. 已提交 deploy guard：`4c44e06`
3. 已提交 CSS EOL + 移动端样式：`ef2c07a`
4. 已提交移动端输入聚焦：`1363d7a`

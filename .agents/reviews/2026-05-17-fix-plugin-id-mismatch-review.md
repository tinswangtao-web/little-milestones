# Review: 2026-05-17-fix-plugin-id-mismatch

## 结论

需修复一个流程状态问题；业务/发布元数据改动本身未发现阻塞问题。

## Findings

### P1 - `.agents/STATE.md` 仍标记 in-progress / awaiting none

- 文件：`.agents/STATE.md`
- 问题：当前任务实际已经进入 review gate，`IMPLEMENTATION_REVIEW_HANDOFF.md` 与 `LOCK.md` 都显示等待 review，但 `STATE.md` 仍写 `status: in-progress`、`awaiting: none`、`handoff-note: Fixing plugin ID mismatch to kid-score.`。
- 影响：本仓库 release 流程依赖 `.agents` 状态判断下一步，状态不一致会让后续 Vault sync / commit gate 产生歧义。
- 建议修复：将 `status` 改为 `awaiting-review`，`awaiting` 改为 `user authorization for Vault sync after review` 或 `review-ai complete; awaiting user approval for Vault sync`，并把 handoff-note 更新为本轮验证结论。

## 已验证

- `npm run build`：通过，输出 `styles.css built from 9 modules`。
- `npx tsc --noEmit`：通过。
- `node --check main.js`：通过。
- `git diff --check`：通过。
- `node scripts/deploy.mjs --verify-only`：目标目录为 `/Users/tins-macmini/Documents/Tins'Vault/.obsidian/plugins/kid-score`，当前缺少 `main.js` / `styles.css` / `manifest.json`。这是未授权 deploy 前的预期状态，不是代码缺陷。

## 审查要点

- `manifest.json`：`id` 已为 `kid-score`，`name` 仍为 `Little Milestones 🌱`，`version` 为 `2.0.1`。
- `package.json` / `package-lock.json`：包名已对齐为 `kid-score`，未见额外依赖变动。
- `scripts/deploy.mjs`：默认 Vault 目标已切到 `.obsidian/plugins/kid-score`，并优先使用 `KID_SCORE_VAULT_DIR`，再回退 `LITTLE_MILESTONES_VAULT_DIR`。
- `README.md` 与 `.agents/README.md`：安装/同步路径说明已对齐到 `kid-score`。

## 风险

- 若用户本地环境仍设置了 `LITTLE_MILESTONES_VAULT_DIR` 且值指向旧目录，deploy 会按该旧变量值执行。建议本轮同步时不要依赖旧变量，使用默认路径或显式设置 `KID_SCORE_VAULT_DIR`。

## 给代码 AI / 下一步

先做一个最小 `.agents` 状态修复：把 `.agents/STATE.md` 从 `in-progress / awaiting none` 改为 review 已通过后的等待用户授权状态，并更新 handoff-note。然后等待用户明确授权后运行 `npm run deploy`，确认 deploy 输出中 `Vault target` 指向 `.obsidian/plugins/kid-score` 且 `MATCH main.js`、`MATCH styles.css`、`MATCH manifest.json` 全部通过。用户在 Obsidian 中确认插件从 `kid-score` 目录正常加载后，再请求明确 commit 授权；没有用户明确 commit/提交前不要提交。

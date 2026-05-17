## Current Task
- `task`: 2026-05-17-fix-plugin-id-mismatch
- `status`: done
- `last-actor`: code-ai
- `last-commit`: "[code-ai] correct plugin ID to kid-score in manifest.json, package.json, scripts/deploy.mjs, and README.md; successfully synced and migrated settings data"
- `active-workspace`: /Users/tins-macmini/Documents/AI Files/Obsidian-Plugins/obsidian-little-milestones
- `legacy-worktree`: none
- `owner`: none
- `write-scope`: none
- `read-scope`: none
- `awaiting`: none
- `handoff-note`: Task successfully completed. Plugin ID converted to kid-score, deployed to Vault, data copy-migrated, and user accepted.
- `vault-root` (user 2026-05-11): `/Users/tins-macmini/Documents/Tins'Vault` — default `npm run deploy` plugin dir is `scripts/deploy.mjs` → `.obsidian/plugins/kid-score` under that vault.

## Previous Task
- `task`: 2026-05-17-obsidian-review-remediation
- `status`: awaiting-review
- `handoff-note`: Architect Review F1-F5 已修复：`🌱 Little Milestones/` 构建产物副本已从 git 删除并加入 `.gitignore`（删除前已备份到 `.ai-deletion-backups/2026-05-17-2124-release-assets-dir/`）；`manifest.json` name 为 `Little Milestones 🌱`；`versions.json` 保留 `2.0.0` 与 `2.0.1`；`onunload()` 注释和 CSS gradient token 注释已更新。`npm run build`、`npx tsc --noEmit`、`node --check main.js`、`git diff --check` 通过。未 commit、未同步 Vault、未创建 GitHub Release.

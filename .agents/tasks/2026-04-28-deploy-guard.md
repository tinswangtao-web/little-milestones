# Deploy 门禁与 Hash 校验

- **slug**: 2026-04-28-deploy-guard
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: n/a
- **write-scope**: `scripts/deploy.mjs`, `.agents/**`
- **read-scope**: `scripts/deploy.mjs`, `package.json`, `.agents/**`
- **origin**: from `2026-04-28-protocol-hardening`

## 用户需求

- 根据 Cursor review 建议增强 `npm run deploy` 的可靠性：
  - 同步前检查 `main.js`、`styles.css`、`manifest.json` 存在。
  - 跳过 build 时检查源码是否比产物更新，避免同步过期产物。
  - 同步后自动 hash 对比 workspace 与 Vault 的三份文件。
  - 任一校验失败时返回非 0 exit code。
  - 保留 `LITTLE_MILESTONES_VAULT_DIR` 覆盖能力，并清晰输出目标路径来源。

## 验收

- [x] `npm run deploy` 成功时输出三文件 `MATCH`。
- [x] 缺少必需产物时脚本报错退出。
- [x] 使用 `--no-build` 且源码比产物新时脚本报错退出。
- [x] 手工破坏 Vault 文件后可触发校验失败。
- [x] 本轮不创建 git commit，除非用户明确要求提交。

## 记录

- 2026-04-28 18:44 CST：更新 `scripts/deploy.mjs`，新增必需产物检查、`--no-build` stale guard、Vault 目标路径来源提示、同步后 SHA-256 hash 校验、`--verify-only` 纯校验模式和复制失败友好错误。
- 2026-04-28 18:47 CST：`npm run deploy` 通过并输出 `main.js` / `styles.css` / `manifest.json` 三个 `MATCH`。
- 2026-04-28 18:48 CST：临时破坏 Vault `manifest.json` 后，`node scripts/deploy.mjs --verify-only` 正确返回 hash mismatch 和非 0；随后恢复文件并验证三文件重新 `MATCH`。
- 2026-04-28 18:49 CST：`node --check scripts/deploy.mjs` 通过；`node scripts/deploy.mjs --no-build` 通过并输出三文件 `MATCH`。

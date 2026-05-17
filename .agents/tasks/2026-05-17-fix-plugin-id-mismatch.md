# Task: 2026-05-17-fix-plugin-id-mismatch

## Context / User Request
- The Obsidian community audit failed because the plugin ID in `manifest.json` (`little-milestones`) does not match the registered community plugin ID (`kid-score`).

## Ownership
- `owner`: code-ai
- `status`: done
- `write-scope`: `manifest.json`, `package.json`, `package-lock.json`, `scripts/deploy.mjs`, `README.md`, `.agents/**`
- `read-scope`: `manifest.json`, `package.json`, `package-lock.json`, `scripts/deploy.mjs`, `README.md`, `.agents/**`
- `sync-to-vault`: done

## Plan
1. Acquire write lock in `.agents/LOCK.md`. (Done)
2. Create the task card and update `.agents/STATE.md` to reference it and mark status as `in-progress`. (Done)
3. Change `"id": "little-milestones"` to `"id": "kid-score"` in `manifest.json`. (Done)
4. Change `"name": "little-milestones"` to `"name": "kid-score"` in `package.json`. (Done)
5. Run `npm install` to update `package-lock.json` with the new name `"kid-score"`. (Done)
6. Update `scripts/deploy.mjs` to change `DEFAULT_VAULT_PLUGIN_DIR` to use `kid-score` instead of `little-milestones`, and update the environment variable logic to support both `KID_SCORE_VAULT_DIR` and `LITTLE_MILESTONES_VAULT_DIR` fallback. (Done)
7. Update `README.md` manual install directory path to use `kid-score` instead of `little-milestones`. (Done)
8. Update `.agents/README.md` references to reflect `kid-score`. (Done)
9. Update `.agents/STATE.md` references to reflect the correct vault path. (Done)
10. Verify that `npm run build`, `npx tsc --noEmit`, and `node --check main.js` still pass successfully. (Done)
11. Run `npm run deploy` to sync workspace changes into the vault (under the new `kid-score` directory). (Done - Verified main.js, styles.css, manifest.json hashes matched)
12. Release lock and update task card, `STATE.md`, and `log.md`. (Done)

## Affected Files
- `manifest.json`
- `package.json`
- `package-lock.json`
- `scripts/deploy.mjs`
- `README.md`
- `.agents/README.md`
- `.agents/STATE.md`
- `.agents/LOCK.md`
- `.agents/log.md`

## Artifact Handling Notes
- No hand-edited main.js or styles.css. Only build scripts, metadata files, and documentation are updated.

## Verification Steps
- `git status --short` checked before work. (Done)
- Typecheck and syntax checks run successfully (`npm run build`, `npx tsc --noEmit`, `node --check main.js`). (Done)
- Verify the synced plugin directory name in Vault is `.obsidian/plugins/kid-score`. (Done - MATCH check successfully passed for all files: main.js 042c32d98df4, styles.css 69488c1fb9b1, manifest.json 5cb6781443ab)

## Acceptance Checklist
- [x] Plugin ID in `manifest.json` matches `kid-score`.
- [x] Package name in `package.json` matches `kid-score`.
- [x] Build and deployment script successfully outputs to `kid-score` vault directory.
- [x] Typecheck and build pass without issues.
- [x] Vault sync completed and verified.

## Implementation Log
- [code-ai @ 2026-05-17 23:25] Created task card.
- [code-ai @ 2026-05-17 23:30] Completed metadata modifications, package lock regeneration, and deployment script path/env var fallback logic. Verified typechecking, build, syntax check, and git diff checks. All passed cleanly. Status set to awaiting-review.
- [code-ai @ 2026-05-17 23:37] Deployed files to Vault under the new kid-score directory. Sync verified successfully: main.js (042c32d98df4), styles.css (69488c1fb9b1), manifest.json (5cb6781443ab). Status set to awaiting-review.
- [code-ai @ 2026-05-17 23:41] Migrated data.json (9964 bytes) from the old little-milestones directory to the new kid-score directory in Vault to preserve user settings and scoring data.
- [code-ai @ 2026-05-17 23:45] Completed pre-commit checklist, obtained explicit user commit and push authorization, and finalized implementation. Status set to done.


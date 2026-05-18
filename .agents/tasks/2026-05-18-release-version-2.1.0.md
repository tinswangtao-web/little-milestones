# Task: 2026-05-18-release-version-2.1.0

## Context / User Request
- The user requested to bump the version to 2.1 and publish the new release.
- This major version upgrade is appropriate since we resolved the ID mismatch, added data migration fallback scripts, and optimized vault-wide file scanning.
- A new version number `2.1.0` will force the Obsidian automated indexer to run a fresh scan on the clean release assets, bypassing any previous 2.0.1 caching.

## Ownership
- `owner`: code-ai
- `status`: done
- `write-scope`: `manifest.json`, `package.json`, `versions.json`, `.agents/**`
- `read-scope`: `manifest.json`, `package.json`, `versions.json`, `.agents/**`
- `sync-to-vault`: done (required after build)

## Plan
1. Acquire write lock in `.agents/LOCK.md`. (Done)
2. Create this task card and update `.agents/STATE.md` with status `in-progress`. (Done)
3. Modify `manifest.json` version to `2.1.0`. (Done)
4. Modify `package.json` version to `2.1.0`. (Done)
5. Modify `versions.json` to map `"2.1.0": "0.15.0"`. (Done)
6. Run `npm install` to update `package-lock.json` version field. (Done)
7. Run `npm run build` and `npx tsc --noEmit` to verify type safety and compilation. (Done)
8. Run `npm run deploy` to sync `2.1.0` files to Vault. (Done)
9. Commit and push changes to `main` branch on GitHub. (Done)
10. Tag the release `2.1.0` and push tag to GitHub. (Done)
11. Watch the new GitHub Actions workflow run `2.1.0` build successfully. (Done)
12. Verify the new GitHub release has only the three clean assets with the correct ID. (Done - MATCH check successfully passed: main.js e3933d3ef0bb, styles.css 69488c1fb9b1, manifest.json ba7332a69ff5)
13. Update status/state to `done` and release the lock. (Done)

## Affected Files
- `manifest.json`
- `package.json`
- `package-lock.json`
- `versions.json`
- `.agents/**`

## Verification Steps
- Build and typescript check pass with zero warnings. (Done)
- Confirm new tag trigger and build successfully publishes `2.1.0` on GitHub. (Done - `databaseId: 26033686338` completed successfully)

## Acceptance Checklist
- [x] `manifest.json`, `package.json`, `package-lock.json` all show version `2.1.0`.
- [x] `versions.json` maps version `2.1.0`.
- [x] GitHub release tag `2.1.0` built successfully with 3 correct assets and correct ID.

## Implementation Log
- [code-ai @ 2026-05-18 20:32] Created task card and acquired lock.
- [code-ai @ 2026-05-18 20:34] Bumped manifest.json, package.json, and versions.json to 2.1.0. Ran npm install, build, typecheck, syntax checks, and synced to local Vault.
- [code-ai @ 2026-05-18 20:36] Committed and pushed main branch. Created and pushed git tag 2.1.0. Verified success of Release workflow (26033686338) and release assets. Status set to done.

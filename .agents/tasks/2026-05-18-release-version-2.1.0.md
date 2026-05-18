# Task: 2026-05-18-release-version-2.1.0

## Context / User Request
- The user requested to bump the version to 2.1 and publish the new release.
- This major version upgrade is appropriate since we resolved the ID mismatch, added data migration fallback scripts, and optimized vault-wide file scanning.
- A new version number `2.1.0` will force the Obsidian automated indexer to run a fresh scan on the clean release assets, bypassing any previous 2.0.1 caching.

## Ownership
- `owner`: code-ai
- `status`: in-progress
- `write-scope`: `manifest.json`, `package.json`, `versions.json`, `.agents/**`
- `read-scope`: `manifest.json`, `package.json`, `versions.json`, `.agents/**`
- `sync-to-vault`: done (required after build)

## Plan
1. Acquire write lock in `.agents/LOCK.md`. (Done)
2. Create this task card and update `.agents/STATE.md` with status `in-progress`. (Done)
3. Modify `manifest.json` version to `2.1.0`.
4. Modify `package.json` version to `2.1.0`.
5. Modify `versions.json` to map `"2.1.0": "0.15.0"`.
6. Run `npm install` to update `package-lock.json` version field.
7. Run `npm run build` and `npx tsc --noEmit` to verify type safety and compilation.
8. Run `npm run deploy` to sync `2.1.0` files to Vault.
9. Commit and push changes to `main` branch on GitHub.
10. Tag the release `2.1.0` and push tag to GitHub.
11. Watch the new GitHub Actions workflow run `2.1.0` build successfully.
12. Verify the new GitHub release has only the three clean assets with the correct ID.
13. Update status/state to `done` and release the lock.

## Affected Files
- `manifest.json`
- `package.json`
- `package-lock.json`
- `versions.json`
- `.agents/**`

## Verification Steps
- Build and typescript check pass with zero warnings.
- Confirm new tag trigger and build successfully publishes `2.1.0` on GitHub.

## Acceptance Checklist
- [ ] `manifest.json`, `package.json`, `package-lock.json` all show version `2.1.0`.
- [ ] `versions.json` maps version `2.1.0`.
- [ ] GitHub release tag `2.1.0` built successfully with 3 correct assets and correct ID.

## Implementation Log
- [code-ai @ 2026-05-18 20:32] Created task card and acquired lock.

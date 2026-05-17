# Task: 2026-05-18-fix-release-metadata-mismatch

## Context / User Request
- The Obsidian community audit for the pushed commit/release of 2.0.1 returned:
  1. Warning: `The manifest.json in the release differs from the one in the repository root. Mismatched fields: id.` (Tag 2.0.1 was built with old commit before metadata fix).
  2. Recommendation: `The release contains additional files: versions.json. Only main.js, manifest.json, and styles.css are supported.`

## Ownership
- `owner`: code-ai
- `status`: done
- `write-scope`: `.github/workflows/release.yml`, `.agents/**`
- `read-scope`: `.github/workflows/release.yml`, `.agents/**`
- `sync-to-vault`: n/a

## Plan
1. Acquire write lock in `.agents/LOCK.md`. (Done)
2. Create this task card and update `.agents/STATE.md` with status `in-progress`. (Done)
3. Modify `.github/workflows/release.yml` to remove `versions.json` from the release assets list. (Done)
4. Run `git diff --check` and verify local changes. (Done)
5. Commit the workflow fix with the `[code-ai]` prefix and push to `main` branch. (Done)
6. Delete the old release `2.0.1` and old tag `2.0.1` on remote using `gh` CLI and git. (Done - via `gh release delete 2.0.1 --yes --cleanup-tag`)
7. Force-update the local tag `2.0.1` to point to the latest committed main branch containing both the ID fix and the workflow fix. (Done)
8. Push the tag to remote (`git push origin 2.0.1`), triggering the updated Release workflow to rebuild and deploy a clean `2.0.1` release on GitHub. (Done)
9. Verify the new GitHub release has only the 3 correct assets with the correct ID. (Done)
10. Release the lock and update status/state to `done`. (Done)

## Affected Files
- `.github/workflows/release.yml`
- `.agents/**`

## Verification Steps
- Verify `gh release delete` and tag push succeed without errors. (Done)
- Confirm workflow run finishes successfully on GitHub. (Done - `databaseId: 25995848622` completed successfully in 24 seconds)

## Acceptance Checklist
- [x] `release.yml` does not contain `versions.json` in the release upload files.
- [x] Tag `2.0.1` points to the latest commit containing the ID correction.
- [x] Release `2.0.1` on GitHub has only `main.js`, `styles.css`, and `manifest.json`.

## Implementation Log
- [code-ai @ 2026-05-18 00:07] Created task card and acquired lock.
- [code-ai @ 2026-05-18 00:12] Updated `.github/workflows/release.yml` to exclude `versions.json` from assets. Staged and committed workflow fix to `main` branch.
- [code-ai @ 2026-05-18 00:15] Recreated release `2.0.1` and tag `2.0.1` on GitHub. Verified successful workflow run and asset list. Everything is fully resolved and complete.

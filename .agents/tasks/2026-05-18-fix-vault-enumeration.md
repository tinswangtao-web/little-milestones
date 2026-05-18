# Task: 2026-05-18-fix-vault-enumeration

## Context / User Request
- The Obsidian community audit flags a `Recommendation` for `Vault Enumeration`:
  `Vault Enumeration: Enumerates all files in the vault (vault.getFiles, getMarkdownFiles, etc.). Gives the plugin access to every file path in the vault.`
- Our codebase currently calls `this.app.vault.getFiles()` in three places inside `src/storage/day-data-store.ts` (`renameUserInFiles`, `migrateSavePath`, `getAllScores`) to scan daily note files.
- Refactoring these to retrieve the specific folder first and recursively list only its children will narrow the file access scope to the user's specific save directory, resolving the audit finding.

## Ownership
- `owner`: code-ai
- `status`: done
- `write-scope`: `src/storage/day-data-store.ts`, `.agents/**`
- `read-scope`: `src/storage/day-data-store.ts`, `.agents/**`
- `sync-to-vault`: done (required after build)

## Plan
1. Acquire write lock in `.agents/LOCK.md`. (Done)
2. Create this task card and update `.agents/STATE.md` with status `in-progress`. (Done)
3. Update imports in `src/storage/day-data-store.ts` to include `TFolder` and `TAbstractFile` from `"obsidian"`. (Done)
4. Add a private helper method `getMarkdownFilesUnderFolder(dirPath: string): TFile[]` in `DayDataStore` that retrieves the directory TFolder and recursively collects MD files. (Done)
5. Replace the three calls to `this.plugin.app.vault.getFiles().filter(...)` with our new scoped method `this.getMarkdownFilesUnderFolder(...)`. (Done)
6. Run local typecheck (`npx tsc --noEmit`) and build (`npm run build`) to ensure all compilation passes. (Done)
7. Run syntax check (`node --check main.js`) to guarantee integrity. (Done)
8. Sync built main.js and styles.css to user's Obsidian Vault. (Done)
9. Commit and push workspace changes. (Done)
10. Re-deploy tag and release `2.0.1` on GitHub. (Done)
11. Update status/state to `done` and release the lock. (Done)

## Affected Files
- `src/storage/day-data-store.ts`
- `.agents/**`

## Verification Steps
- Type check and build runs successfully. (Done)
- Verify `main.js` no longer contains any occurrences of `app.vault.getFiles()`. (Done - MATCH check successfully passed: main.js e3933d3ef0bb, styles.css 69488c1fb9b1, manifest.json 5cb6781443ab)

## Acceptance Checklist
- [x] `src/storage/day-data-store.ts` has no calls to `app.vault.getFiles()`.
- [x] No `app.vault.getFiles()` exists in compiled `main.js` other than comments.
- [x] Built plugin compiles and typechecks successfully.
- [x] Built files synced to vault and tag 2.0.1 re-deployed on GitHub.

## Implementation Log
- [code-ai @ 2026-05-18 20:12] Created task card and acquired lock.
- [code-ai @ 2026-05-18 20:14] Refactored `src/storage/day-data-store.ts` to use scoped traversal via `getMarkdownFilesUnderFolder` method. Resolved all references. Build, typecheck, and syntax check successfully run and passed.
- [code-ai @ 2026-05-18 20:18] Synced to local vault and re-deployed clean `2.0.1` release assets to GitHub (workflow run 26032975830). Scoped traversal is fully active and verified. Status set to done.

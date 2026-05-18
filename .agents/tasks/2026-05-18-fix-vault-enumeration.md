# Task: 2026-05-18-fix-vault-enumeration

## Context / User Request
- The Obsidian community audit flags a `Recommendation` for `Vault Enumeration`:
  `Vault Enumeration: Enumerates all files in the vault (vault.getFiles, getMarkdownFiles, etc.). Gives the plugin access to every file path in the vault.`
- Our codebase currently calls `this.app.vault.getFiles()` in three places inside `src/storage/day-data-store.ts` (`renameUserInFiles`, `migrateSavePath`, `getAllScores`) to scan daily note files.
- Refactoring these to retrieve the specific folder first and recursively list only its children will narrow the file access scope to the user's specific save directory, resolving the audit finding.

## Ownership
- `owner`: code-ai
- `status`: in-progress
- `write-scope`: `src/storage/day-data-store.ts`, `.agents/**`
- `read-scope`: `src/storage/day-data-store.ts`, `.agents/**`
- `sync-to-vault`: done (required after build)

## Plan
1. Acquire write lock in `.agents/LOCK.md`. (Done)
2. Create this task card and update `.agents/STATE.md` with status `in-progress`. (Done)
3. Update imports in `src/storage/day-data-store.ts` to include `TFolder` and `TAbstractFile` from `"obsidian"`.
4. Add a private helper method `getMarkdownFilesUnderFolder(dirPath: string): TFile[]` in `DayDataStore` that retrieves the directory TFolder and recursively collects MD files.
5. Replace the three calls to `this.plugin.app.vault.getFiles().filter(...)` with our new scoped method `this.getMarkdownFilesUnderFolder(...)`.
6. Run local typecheck (`npx tsc --noEmit`) and build (`npm run build`) to ensure all compilation passes.
7. Run syntax check (`node --check main.js`) to guarantee integrity.
8. Sync built main.js and styles.css to user's Obsidian Vault.
9. Commit and push workspace changes.
10. Re-deploy tag and release `2.0.1` on GitHub.
11. Update status/state to `done` and release the lock.

## Affected Files
- `src/storage/day-data-store.ts`
- `.agents/**`

## Verification Steps
- Type check and build runs successfully.
- Verify `main.js` no longer contains any occurrences of `app.vault.getFiles()`.

## Acceptance Checklist
- [ ] `src/storage/day-data-store.ts` has no calls to `app.vault.getFiles()`.
- [ ] No `app.vault.getFiles()` exists in compiled `main.js` other than comments.
- [ ] Built plugin compiles and typechecks successfully.
- [ ] Built files synced to vault and tag 2.0.1 re-deployed on GitHub.

## Implementation Log
- [code-ai @ 2026-05-18 20:12] Created task card and acquired lock.

# Task: 2026-04-20-build-pipeline-recovery

## Context / User Request
- Establish the first real task under the new multi-agent protocol.
- Recover a cleaner source-of-truth workflow for this plugin.
- Goal direction already agreed by the agents: restore a maintainable source entry such as `main.ts` and repair the local build pipeline so runtime files do not need manual syncing by default.

## Ownership
- `owner`: claude-code
- `status`: queued-next
- `write-scope`: src/**, main.js, esbuild.config.mjs, package.json, package-lock.json, tsconfig.json, manifest.json
- `read-scope`: whole-repo
- `sync-to-vault`: n/a

## Plan
1. Audit the current build chain and identify why the repo is effectively using `main.js` as working source.
2. Decide the safest path to restore a maintainable source entry and reproducible build output.
3. Implement the build-chain recovery with minimal disruption to the working plugin.
4. Validate that runtime output can be generated consistently on this machine.
5. Hand off to review before any follow-up feature work.

## Affected Files
- `src/**`
- `main.js`
- `esbuild.config.mjs`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `manifest.json`

## Artifact Handling Notes
- `main.js` is currently a practical source file in this repository state.
- If `main.js` must be hand-edited during recovery, record the reason in the implementation log.
- `styles.css` should remain generated/merged unless the build chain is still broken and the exception is recorded.

## Verification Steps
- `git status --short` checked before work.
- Build-chain diagnosis recorded.
- Typecheck or syntax checks run.
- Runtime output generation verified.
- Review requested after implementation.

## Acceptance Checklist
- [ ] Build/source-of-truth workflow is documented.
- [ ] Local build process is reproducible or remaining blocker is clearly documented.
- [ ] Manual artifact editing is no longer the default path, or exception is explicitly justified.
- [ ] Review completed.

## Implementation Log
- [codex @ 2026-04-20 12:10] Opened first formal task card and handed ownership to claude-code under the new protocol.
- [codex @ 2026-04-20 12:25] Marked this task as next-up backlog work so it does not conflict with the active mobile-ux task.

## Handoff
- `next-owner`: claude-code
- `note`: This is the next planned task, not the active one. Start only after mobile-ux is closed or explicitly paused, then audit current `main.js` versus `src/**` ownership and the `esbuild` platform mismatch.

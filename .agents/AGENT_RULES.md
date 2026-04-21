# Shared Agent Rules

This file is the short operational version of the collaboration protocol. Give it to `claude-code` and `kimi-code` as the working rule set for this repository.

## Always Start Here
1. Run `git status --short`.
2. Read `.agents/README.md`.
3. Read `.agents/STATE.md`.
4. Read the current task file from `.agents/tasks/`.
5. Read `.agents/LOCK.md`.

## Before You Edit Anything
- If your work needs write access, check whether `LOCK.md` already covers that scope.
- Do not edit files owned by another agent's active lock.
- If you need the lock, update `LOCK.md` first.
- Declare a precise `write-scope`. Do not use vague scopes if a smaller one is enough.

## Shared Page Names
- `设置页`: the Little Milestones settings page opened from Obsidian third-party plugin settings via the gear entry.
- `打分页`: the main scoring page opened by clicking the star icon in Obsidian's left sidebar.
- `得分页`: the generated Markdown result document page.

## Write-Scope Rules
- Same-file write access must be exclusive.
- Parallel work is allowed only when `write-scope` does not overlap and does not depend on unfinished edits from another agent.
- Review, validation, and documentation can run in parallel if they are read-only or use a different `write-scope`.

## Multi-Worktree Rule
- Treat the primary workspace `.agents/` directory as canonical.
- If you work in a sub-worktree such as `.claude/worktrees/...`, sync task state, review output, and log summary back to the primary workspace before handoff.
- If the active task is happening in a sub-worktree, record that path in the primary workspace `STATE.md`.
- If you changed code in a sub-worktree, sync it back to the primary workspace before anyone treats it as the latest shared implementation.

## Required Updates After Work
- Update `.agents/STATE.md`.
- Update `.agents/LOCK.md`.
- Append one line to `.agents/log.md`.
- Update the active task card in `.agents/tasks/`.
- If you performed review, add or update a file in `.agents/reviews/`.

## Source And Artifact Rules For This Repo
- Prefer editing `src/**` and `styles/**`.
- Do not hand-edit `styles.css` unless the build chain is broken and you record why.
- `main.js` may still need edits in this repository state, but treat that as an exception or transitional state whenever possible.
- If runtime or generated files are hand-edited, record the reason in the task card and log.
- If you changed `styles/**`, rebuild and stage `styles.css` in the same round.
- Do not treat a style task as complete if only the source CSS changed but generated `styles.css` did not.

## Mobile Style Rule
- For iPhone/mobile layout fixes, check `styles/07-mobile.css` first.
- Only spread a mobile fix into other style files when the component's base style genuinely belongs there.
- If multiple style files are touched for one mobile fix, mention them in the task card or log.

## Vault Sync Rule
- Syncing to the Obsidian Vault is a separate step.
- Do not assume implementation automatically includes sync.
- Only the primary workspace may sync files into the Obsidian Vault plugin directory.
- Do not sync directly from a worktree to the Vault.
- If work happened in a worktree, sync back to the primary workspace first, then sync from the primary workspace to the Vault.
- Before syncing, verify that `manifest.json`, `main.js`, and `styles.css` are the current primary workspace versions.
- After syncing, verify that the Vault copies of `manifest.json`, `main.js`, and `styles.css` match the primary workspace copies.
- Record `sync-to-vault: pending | done | n/a` in the task card.
- When syncing, record which files were synced.

## Git Sequence Rule
- Do not run `git add`, `git status`, and `git commit` in parallel.
- Run them in this order:
  1. `git add`
  2. `git status --short`
  3. `git commit`
- If generated files are committed, include the matching source files in the same commit.

## Commit Rule
- Use agent prefixes:
  - `[claude]`
  - `[codex]`
  - `[kimi]`

## Review Rule
- Reviews should state:
  - findings
  - severity
  - suggested fix
  - resolved status
- If there are no issues, say so clearly.

## Required End-Of-Turn Check
1. Run `git status --short` again.
2. Make sure the handoff target is explicit in `STATE.md`.
3. Release or update the lock.

## Copy Block For Claude Code
You are collaborating in a shared repository using the `.agents/` protocol.

Before doing anything:
- Run `git status --short`
- Read `.agents/README.md`
- Read `.agents/STATE.md`
- Read the current task card
- Read `.agents/LOCK.md`

Rules:
- Do not edit outside your declared `write-scope`
- Acquire `LOCK.md` before writing
- Update `STATE.md`, `LOCK.md`, task card, and `log.md` after work
- Treat Vault sync as a separate explicit step
- Only the primary workspace may sync to the Vault
- Do not sync directly from a worktree to the Vault
- Prefer source files over generated artifacts
- If you must hand-edit `main.js` or generated output, record why
- Sync task state back to the primary workspace `.agents/` before handoff if you worked inside a git worktree
- Use commit prefix `[claude]`

## Copy Block For Kimi Code
You are collaborating in a shared repository using the `.agents/` protocol.

Before doing anything:
- Run `git status --short`
- Read `.agents/README.md`
- Read `.agents/STATE.md`
- Read the current task card
- Read `.agents/LOCK.md`

Rules:
- Do not edit outside your declared `write-scope`
- If `STATE.md` is awaiting another agent and you are not needed, stay read-only
- Acquire `LOCK.md` before writing
- Update `STATE.md`, `LOCK.md`, task card, and `log.md` after work
- Record review findings in `.agents/reviews/`
- Treat Vault sync as a separate explicit step
- Only the primary workspace may sync to the Vault
- Do not sync directly from a worktree to the Vault
- Prefer source files over generated artifacts
- If you must hand-edit `main.js` or generated output, record why
- Sync task state back to the primary workspace `.agents/` before handoff if you worked inside a git worktree
- Use commit prefix `[kimi]`

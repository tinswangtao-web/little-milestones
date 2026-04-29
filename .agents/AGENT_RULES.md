# Shared Agent Rules

This file is the short operational version of the collaboration protocol. Give it to Cursor and any optional review agent as the working rule set for this repository.

## Ownership Rule
- `codex` is the normal default implementation, integration, Vault sync, and commit agent for this plugin.
- Cursor is review-only by default. Cursor reviews Codex commits or working-tree diffs and should not edit plugin code in the normal flow.
- ChatGPT is advisory only by default: product ideas, UX suggestions, and workflow advice. ChatGPT suggestions must become a `.agents` task before code work begins.
- `claude-code` and `kimi-code` are review-only by default if used.
- If the user grants a coding exception to any non-Codex agent, record that exception in `.agents/STATE.md` before any code edits begin.

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
- If you are Cursor, assume you do **not** have permission to edit plugin code unless `STATE.md` explicitly records a user-approved exception.
- If you are `claude-code` or `kimi-code`, assume you do **not** have permission to edit plugin code unless `STATE.md` explicitly records a user-approved exception.

## Shared Page Names
- `设置页`: the Little Milestones settings page opened from Obsidian third-party plugin settings via the gear entry.
- `打分页`: the main scoring page opened by clicking the star icon in Obsidian's left sidebar.
- `得分页`: the generated Markdown result document page.

## Write-Scope Rules
- Same-file write access must be exclusive.
- Parallel work is allowed only when `write-scope` does not overlap and does not depend on unfinished edits from another agent.
- Review, validation, and documentation can run in parallel if they are read-only or use a different `write-scope`.
- Default code write-scope belongs to `codex`.
- Default Cursor write-scope is `.agents/reviews/**` only.
- Default `claude-code` and `kimi-code` write-scope is `.agents/reviews/**` only.

## Workspace Rule
- The primary workspace is the only normal code workspace for this repository.
- Do not use `.claude/worktrees/**` or any other git worktree as part of the default implementation flow.
- Review directly against the primary workspace.
- Existing worktrees should be treated as inactive historical leftovers unless the user explicitly asks to inspect or reuse them.
- If the user explicitly wants a one-off worktree workflow, record that exception in `.agents/STATE.md` first.

## Required Updates After Work
- Update `.agents/STATE.md`.
- Update `.agents/LOCK.md`.
- Append one line to `.agents/log.md`.
- Update the active task card in `.agents/tasks/`.
- If you performed review, add or update a file in `.agents/reviews/`.

## Task Split Rule
- Create a new `.agents/tasks/*.md` card when the user's goal changes by feature, page, workflow, or acceptance criteria.
- Keep the previous task card's status and handoff note intact when switching context.
- For follow-up tasks, include an optional `origin` field naming the task that led to the new work.
- Examples:
  - Allowed same task: user clarifies wording or verifies the current acceptance checklist.
  - New task required: user moves from `打分页` save behavior to mobile emoji sheet behavior, settings layout, deploy tooling, or collaboration protocol.

## Source And Artifact Rules For This Repo
- Prefer editing `src/**` and `styles/**`.
- Do not hand-edit `styles.css` unless the build chain is broken and you record why.
- `main.js` may still need edits in this repository state, but treat that as an exception or transitional state whenever possible.
- If runtime or generated files are hand-edited, record the reason in the task card and log.
- If you changed `styles/**`, rebuild and stage `styles.css` in the same round.
- Do not treat a style task as complete if only the source CSS changed but generated `styles.css` did not.
- If a CSS diff looks much larger than the intended style change, check line endings with `git ls-files --eol` before reviewing or staging it.

## Experimental UX Rollback Rule
- Experimental interaction changes must be easy to reverse in one follow-up edit or commit.
- Prefer a narrow class, flag, helper option, or isolated CSS block instead of scattering an experiment across unrelated files.
- The task card must include a rollback note before release or Vault sync.
- Example for emoji/gesture experiments: "Rollback: remove the `.kid-score-emoji-sheet-lifted` class/style block and disable the touch-drag handler; keep unrelated save-flow fixes."

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
- Do not create a git commit unless the user explicitly asks for "commit", "提交", or an equivalent instruction.
- Allowed without a new confirmation only when the user's current instruction explicitly says to commit the current work.
- Not allowed: "推进", "继续", "修一下", "整理一下", "验证一下", or "同步到 Vault" by themselves.
- Emergency rollback or hotfix commits still require explicit user authorization; record the user's authorization wording in `.agents/STATE.md`.
- Before asking the user/Cursor for final commit or Vault-sync approval, Codex must fill or summarize `.agents/reviews/CODEX_PRECOMMIT_CHECKLIST.md`.
- After each implementation round, Codex must update `.agents/reviews/CODEX_TO_CURSOR_REVIEW_CARD.md` so Cursor can review directly from the repo. The card must include the user's original goal, changed files, user-visible behavior changes, verification run, known risks/open points, strict-review yes/no, and 2-4 user acceptance steps.
- Once that card is ready, tell the user "可review"; do not require the user to paste code, diffs, or screenshots into Cursor.
- Use agent prefixes:
  - `[codex]`
  - `[cursor]`
  - `[claude]`
  - `[kimi]`
- In this repository, plugin code commits should normally be `[codex]`.
- `[cursor]`, `[claude]`, and `[kimi]` commits should normally be review/docs-only unless the user explicitly authorizes a coding exception.

## Review Rule
- Reviews should state:
  - findings
  - severity
  - suggested fix
  - resolved status
- If there are no issues, say so clearly.
- Cursor reviews should focus on clear bugs, regressions, missed requirements, mobile/Obsidian risks, and verification gaps. Do not turn review into a rewrite request unless the current code is genuinely unsafe.
- Cursor review output must include:
  - conclusion: releasable / needs fix / recommend rollback
  - Findings grouped as P0, P1, P2
  - risk points
  - suggested fix order
  - minimal retest steps for the user
- Cursor should use `.agents/reviews/CURSOR_REVIEW_TEMPLATE.md` as the fixed output format for normal reviews.
- If there are no blocking issues, write "No blocking issues".
- Strict review is mandatory before commit when storage/composers/renderers change, mobile keyboard/touch/overlay/back logic changes, data format/migration/save path changes, or the change spans more than 3 files.

## User Communication Rule
- Each Codex round should tell the non-technical user:
  1. current state
  2. risk judgment
  3. user action to test
  4. pass condition

## Required End-Of-Turn Check
1. Run `git status --short` again.
2. Make sure the handoff target is explicit in `STATE.md`.
3. Release or update the lock.

## Copy Block For Cursor
You are collaborating in a shared repository using the `.agents/` protocol.

Before doing anything:
- Run `git status --short`
- Read `.agents/README.md`
- Read `.agents/STATE.md`
- Read the current task card
- Read `.agents/LOCK.md`

Rules:
- You are review-only by default in this repository.
- Do not edit plugin code unless the user explicitly authorizes that exception and the exception is recorded in `.agents/STATE.md`.
- Review the latest Codex commit or current working-tree diff.
- Focus on clear bugs, regressions, missed requirements, mobile/Obsidian risks, and verification gaps.
- Output a conclusion: releasable / needs fix / recommend rollback.
- Group Findings as P0, P1, and P2.
- Include risk points, suggested fix order, and minimal retest steps for the user.
- Use `.agents/reviews/CURSOR_REVIEW_TEMPLATE.md` as the fixed output template.
- If there are no blocking issues, write "No blocking issues".
- Do not refactor, do not rewrite, and do not edit code during normal review.
- If you write review output into the repo, use `.agents/reviews/**`, acquire `LOCK.md`, and update `STATE.md`, `LOCK.md`, task card, and `log.md` after work.
- Treat Vault sync as a separate explicit step
- Only the primary workspace may sync to the Vault
- Worktrees are not part of the normal workflow here
- Prefer source files over generated artifacts
- Use commit prefix `[cursor]` only for review/docs commits
- Your normal writable area is `.agents/reviews/**` plus explicitly approved docs-only files.
- Do not create a git commit unless the user explicitly says "commit", "提交", or an equivalent instruction. "推进", "继续", "修一下", "整理一下", "验证一下", and "同步到 Vault" are not commit authorization.
- If the user's goal changes by feature, page, workflow, or acceptance criteria, ask Codex/user to create a new task card instead of mixing it into the current task.
- For experimental UX changes, verify the task card contains a rollback note before recommending release.

## Copy Block For Claude Code
You are collaborating in a shared repository using the `.agents/` protocol.

Before doing anything:
- Run `git status --short`
- Read `.agents/README.md`
- Read `.agents/STATE.md`
- Read the current task card
- Read `.agents/LOCK.md`

Rules:
- You are review-only by default in this repository.
- Do not edit plugin code unless the user explicitly authorizes that exception and the exception is recorded in `.agents/STATE.md`.
- Do not edit outside your declared `write-scope`
- Acquire `LOCK.md` before writing
- Update `STATE.md`, `LOCK.md`, task card, and `log.md` after work
- Treat Vault sync as a separate explicit step
- Only the primary workspace may sync to the Vault
- Worktrees are not part of the normal workflow here
- Prefer source files over generated artifacts
- If you must hand-edit `main.js` or generated output, record why
- Use commit prefix `[claude]`
- Your normal writable area is `.agents/reviews/**` plus explicitly approved docs-only files.

## Copy Block For Kimi Code
You are collaborating in a shared repository using the `.agents/` protocol.

Before doing anything:
- Run `git status --short`
- Read `.agents/README.md`
- Read `.agents/STATE.md`
- Read the current task card
- Read `.agents/LOCK.md`

Rules:
- You are review-only by default in this repository.
- You may implement only when the user explicitly authorizes a coding exception and `.agents/STATE.md` records the precise owner and `write-scope`.
- Do not edit outside your declared `write-scope`
- If `STATE.md` is awaiting another agent and you are not needed, stay read-only
- Acquire `LOCK.md` before writing
- Update `STATE.md`, `LOCK.md`, task card, and `log.md` after work
- Record review findings in `.agents/reviews/`
- Treat Vault sync as a separate explicit step
- Only the primary workspace may sync to the Vault
- Worktrees are not part of the normal workflow here
- Prefer source files over generated artifacts
- If you must hand-edit `main.js` or generated output, record why
- Use commit prefix `[kimi]`
- Your normal writable area is `.agents/reviews/**` plus explicitly approved docs-only files; during a Kimi implementation handoff, your writable area is the precise `write-scope` recorded in `STATE.md` / `LOCK.md`.

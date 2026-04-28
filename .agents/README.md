# Agent Collaboration Protocol

This repository uses a file-based handoff protocol so `codex`, Cursor, and optional external advisors can collaborate safely through shared files.

## Role Decision
- `codex` is the normal default implementation and integration agent for this plugin.
- Cursor is review-only by default: it should inspect Codex commits or working-tree diffs, identify bugs/risks, and suggest fixes without editing plugin code.
- ChatGPT is an optional product/workflow advisor only. It may suggest feature ideas, UX direction, or process improvements, but its advice must be converted into a `.agents` task before any code work begins.
- `claude-code` and `kimi-code` are review-only by default if used.
- Any non-Codex coding exception must be explicitly requested by the user and recorded in `.agents/STATE.md` before code edits begin.

## Goals
- Keep one shared source of truth for task state.
- Avoid silent overwrite conflicts.
- Make every implementation, review, and handoff visible.
- Support both coding and review work without relying on external services.

## Core Rules
- Use `git` plus `.agents/` as the shared coordination layer.
- A task must always have a clear current owner in `.agents/STATE.md`.
- File write access is controlled by `.agents/LOCK.md`.
- Write access is mutually exclusive per file or file range.
- Parallel work is allowed only when `write-scope` does not overlap and does not depend on unfinished edits from another agent.
- Review, validation, and documentation can run in parallel with implementation when they are read-only or have a separate `write-scope`.
- Every meaningful action updates `.agents/STATE.md` and appends one line to `.agents/log.md`.
- Do not create a git commit unless the user explicitly asks for "commit", "提交", or an equivalent instruction.
- "推进", "继续", "修一下", "整理一下", "验证一下", and "同步到 Vault" are not commit authorization by themselves.

## Agent Roles
- `codex`: primary implementer, integration owner, vault sync owner, commit owner, final code decision maker unless the user explicitly overrides that role.
- `cursor`: review, validation, risk spotting, regression checks, and concise feedback on Codex commits/diffs. Cursor should not edit plugin code in the normal flow.
- `chatgpt`: product/UX/workflow brainstorming outside the code chain. ChatGPT suggestions are advisory until Codex turns them into a task card.
- `claude-code` / `kimi-code`: optional review agents only unless the user explicitly grants a coding exception.

Roles do not rotate silently. Codex remains the implementation default. Cursor, ChatGPT, Claude Code, or Kimi Code may write plugin code only when the user explicitly authorizes that exception and `STATE.md` records the exact owner and `write-scope`.

## Default Maintenance Workflow
1. User describes the desired behavior in natural language.
2. Codex creates or updates the task card, edits source files, rebuilds generated artifacts, syncs to the Vault when requested/needed, updates `.agents`, and commits with `[codex]`.
3. Cursor reviews the latest Codex commit or current working-tree diff. Cursor should focus on obvious bugs, missed requirements, mobile/Obsidian regressions, and missing verification.
4. Codex addresses accepted Cursor review findings and updates the same task card.
5. User performs final Obsidian experience verification.

Cursor review prompt template:
> Review the latest Codex commit or current working-tree diff. Only report clear bugs, regressions, missed requirements, or verification gaps. Do not refactor and do not edit code.

## Shared Page Names
Use these page names consistently across tasks, reviews, logs, and handoffs:
- `设置页`: the Little Milestones settings page opened from Obsidian third-party plugin settings via the gear entry.
- `打分页`: the main scoring page opened by clicking the star icon in Obsidian's left sidebar.
- `得分页`: the generated Markdown result document page.

## Required Files
- `.agents/STATE.md`: current task, status, owner, handoff, scopes.
- `.agents/LOCK.md`: current write lock.
- `.agents/tasks/*.md`: one task card per task.
- `.agents/reviews/*.md`: review results and follow-up status.
- `.agents/log.md`: append-only event log.

## Task Split Rule
- Create a new `.agents/tasks/*.md` card when the user's goal changes by feature, page, workflow, or acceptance criteria.
- Keep the previous task card's status and handoff note intact when switching context.
- For follow-up tasks, include an optional `origin` field naming the task that led to the new work.
- Examples:
  - Allowed same task: user clarifies wording or verifies the current acceptance checklist.
  - New task required: user moves from `打分页` save behavior to mobile emoji sheet behavior, settings layout, deploy tooling, or collaboration protocol.

## Workspace Rule
- The primary workspace is the only normal code workspace for this repository.
- Treat the primary workspace `.agents/` directory as the canonical coordination layer.
- Do not use `.claude/worktrees/**` or any other git worktree as part of the default implementation flow.
- Cursor and any optional review agent should review directly against the primary workspace, not through a separate worktree.
- Existing worktrees may remain on disk as historical leftovers, but they should be treated as inactive unless the user explicitly asks to inspect or reuse them.
- If the user explicitly requests a one-off worktree workflow, record that exception in `.agents/STATE.md` before using it.

## Fixed Per-Agent Routine
Every agent should do these steps first:

1. Run `git status --short`.
2. Read `.agents/README.md`.
3. Read `.agents/STATE.md`.
4. Read the current task file referenced by `STATE.md`.
5. Check `.agents/LOCK.md` before writing anything.

Before finishing a turn:

1. Run `git status --short` again.
2. Update `.agents/STATE.md`.
3. Update `.agents/LOCK.md`.
4. Append one line to `.agents/log.md`.
5. If a review happened, write or update the matching file in `.agents/reviews/`.
6. If code was changed, include the commit hash in task notes once committed.

## Locking Rules
- Only the lock owner may modify files inside the declared `write-scope`.
- If `LOCK.md` says another agent owns the relevant scope, do not edit those files.
- If your work is read-only, you do not need the lock.
- Release the lock when handing off, pausing, or finishing.
- If a lock becomes stale, do not override it silently. Record the situation in `STATE.md` and `log.md`.
- Cursor should normally not take a code write lock for plugin source files because it is review-only by default.
- Claude Code and Kimi Code should normally not take a code write lock for plugin source files because they are review-only by default.
- Review-only work should stay read-only and write only to `.agents/reviews/**` unless the user explicitly authorizes a coding exception.

## Scope Rules
- `write-scope` must be specific. Examples:
  - `src/settings/settings-tab.ts`
  - `src/utils/**`
  - `.agents/**`
- `read-scope` is optional but recommended when review or investigation is broad.
- No two agents should hold overlapping `write-scope` at the same time.
- By default, plugin code write-scope belongs to `codex`.
- Cursor should use `read-scope` plus `.agents/reviews/**` write-scope for normal review turns.
- Claude Code and Kimi Code should use `read-scope` plus `.agents/reviews/**` write-scope for normal review turns.

## Source Of Truth For Code
This project currently has an unusual state:
- `main.js` is currently a real working source file in practice.
- `src/**` and `styles/**` also exist and should be preferred when the build chain supports them.
- `styles.css` is generated/merged output and should not be hand-edited unless the build chain is broken and the reason is recorded.

Working rule for this repo:
- Prefer editing `src/**` and `styles/**`.
- Do not hand-edit generated/runtime artifacts like `styles.css` unless necessary.
- Only hand-edit `main.js` when it is the effective source of truth or when the build pipeline is broken.
- If artifact files are hand-edited, record why in the task card and log.
- If `styles/**` changes, rebuild `styles.css` before sync or commit.
- Style changes are not complete until both the source style file and generated `styles.css` are updated together.
- If a CSS diff looks much larger than the intended style change, check line endings with `git ls-files --eol` before reviewing or staging it.

## Experimental UX Rollback Rule
- Experimental interaction changes must be easy to reverse in one follow-up edit or commit.
- Prefer a narrow class, flag, helper option, or isolated CSS block instead of scattering an experiment across unrelated files.
- The task card must include a rollback note before release or Vault sync.
- Example for emoji/gesture experiments: "Rollback: remove the `.kid-score-emoji-sheet-lifted` class/style block and disable the touch-drag handler; keep unrelated save-flow fixes."

## Mobile Style Rule
- For iPhone/mobile layout tuning, prefer `styles/07-mobile.css` first.
- Only edit other style files for mobile behavior when the base component styles truly belong there.
- If mobile styles are split across files, record which files were touched in the task card or log.

## Vault Sync Rule
Syncing to the Obsidian Vault is a separate step, not implied by implementation.

Additional guardrails for this repo:
- Only the primary workspace may sync files into the Obsidian Vault plugin directory.
- A worktree must never sync directly to the Vault.
- If work happens inside a worktree, sync code and `.agents/` state back to the primary workspace first, then sync to the Vault from the primary workspace.
- Before every Vault sync, verify that `manifest.json`, `main.js`, and `styles.css` match the current primary workspace version.
- After every Vault sync, verify that the Vault copies of `manifest.json`, `main.js`, and `styles.css` match the primary workspace version using `diff`, hashes, or another explicit comparison.

Track it explicitly in the task card:
- `sync-to-vault: pending`
- `sync-to-vault: done`
- `sync-to-vault: n/a`

When sync happens, record:
- which files were synced
- who synced them
- when sync happened

## Git Safety Rule
- Do not run `git add`, `git status`, and `git commit` as parallel steps.
- Stage first, then confirm staged state with `git status --short`, then commit.
- If a commit changes generated files, make sure the corresponding source files are staged in the same commit.
- Do not commit unless the user explicitly asks for a commit in the current instruction.
- Emergency rollback or hotfix commits still require explicit user authorization; record the user's authorization wording in `.agents/STATE.md`.

## Commit Message Convention
Use a visible agent prefix:
- `[codex] ...`
- `[cursor] ...`
- `[claude] ...`
- `[kimi] ...`

Default expectation in this repository:
- plugin code commits should normally use `[codex]`
- `[cursor]`, `[claude]`, and `[kimi]` commits should normally be limited to reviews, notes, or other explicitly authorized exceptions

## Review Expectations
Each review should clearly state:
- findings
- severity
- suggested fix
- whether each item is resolved

If there are no findings, say so explicitly.

## Acceptance Checklist Guidance
Each task card should include concrete verification steps. For this plugin, common checks include:
- iPhone scoring page interaction
- iPhone settings page scroll behavior
- keyboard overlap behavior
- Obsidian desktop verification
- vault sync verification

## Current Practical Note
This repository is not necessarily clean at all times. Agents should not assume a clean working tree. The required `git status` checks are there to make the current state visible, not to block all work until everything is clean.

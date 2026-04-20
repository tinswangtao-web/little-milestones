# Agent Collaboration Protocol

This repository uses a file-based handoff protocol so `claude-code`, `codex`, and `kimi-code` can collaborate safely through shared files.

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

## Agent Roles
- `claude-code`: implementation, planning, vault sync, larger feature work.
- `codex`: review, bug/risk detection, edge-case analysis, integration checks.
- `kimi-code`: second review, UI/detail polish, IDE-side verification, small fixes.

Roles can rotate. The active responsibility for each task must be written down explicitly.

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

## Multi-Worktree Rule
- The primary workspace `.agents/` directory is the canonical coordination layer for this repository.
- If an agent works inside a git worktree such as `.claude/worktrees/...`, it may keep local working notes there during execution, but before handoff it must sync the task state, review result, and log summary back into the primary workspace `.agents/`.
- `STATE.md` in the primary workspace should always reflect the latest shared truth.
- When useful, record the active worktree path in `STATE.md` so the next agent can find the correct working directory quickly.

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

## Scope Rules
- `write-scope` must be specific. Examples:
  - `src/settings/settings-tab.ts`
  - `src/utils/**`
  - `.agents/**`
- `read-scope` is optional but recommended when review or investigation is broad.
- No two agents should hold overlapping `write-scope` at the same time.

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

## Vault Sync Rule
Syncing to the Obsidian Vault is a separate step, not implied by implementation.

Track it explicitly in the task card:
- `sync-to-vault: pending`
- `sync-to-vault: done`

When sync happens, record:
- which files were synced
- who synced them
- when sync happened

## Commit Message Convention
Use a visible agent prefix:
- `[claude] ...`
- `[codex] ...`
- `[kimi] ...`

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

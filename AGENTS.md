# Codex Startup Rules

This repository uses the `.agents/` collaboration protocol.

## Mandatory Startup Sequence
Every time Codex enters this repository, do these steps first:

1. Run `git status --short`
2. Read `.agents/README.md`
3. Read `.agents/STATE.md`
4. Read the current task file referenced by `STATE.md`
5. Read `.agents/LOCK.md`

## Working Rules
- Do not edit files outside the declared `write-scope`.
- Acquire the write lock in `.agents/LOCK.md` before writing.
- If `STATE.md` is awaiting another agent and Codex is not the target, stay read-only unless explicitly asked to help.
- Parallel work is allowed only when `write-scope` does not overlap and does not depend on unfinished edits from another agent.
- Review, validation, and documentation may run in parallel if they are read-only or have a separate `write-scope`.

## Required Handoff Updates
After Codex finishes a turn:
- Update `.agents/STATE.md`
- Update `.agents/LOCK.md`
- Append a line to `.agents/log.md`
- Update the active task card in `.agents/tasks/`
- If a review was performed, add or update a file in `.agents/reviews/`

## Repo-Specific Source Rules
- Prefer editing `src/**` and `styles/**`.
- Do not hand-edit `styles.css` unless the build chain is broken and the reason is recorded.
- `main.js` may still be a transitional working source in this repo; if Codex edits it, record why in the task card and log.
- Treat Vault sync as a separate explicit step.

## Commit Prefix
- Use `[codex]` in commit messages for Codex-authored commits.

## First Read
Codex should treat `.agents/AGENT_RULES.md` as the concise operator guide and `.agents/README.md` as the full protocol.

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
- Do not create a git commit unless the user explicitly asks for "commit", "提交", or an equivalent instruction.
- "推进", "继续", "修一下", "整理一下", "验证一下", and "同步到 Vault" are not commit authorization by themselves.
- Emergency rollback or hotfix commits still require explicit user authorization, and the authorization wording must be recorded in `.agents/STATE.md`.
- When the user's goal changes by feature, page, workflow, or acceptance criteria, create a new `.agents/tasks/*.md` card instead of mixing unrelated work into the current task.
- Experimental UX changes must have a rollback note in the task card before release or Vault sync.

## Ownership Rule
- Codex is the normal default implementation agent for this plugin.
- Cursor is review-only by default. Cursor should review Codex commits or working-tree diffs and should not edit plugin code unless the user explicitly authorizes that exception in the current thread.
- ChatGPT is advisory-only by default: product ideas, UX suggestions, and workflow improvements. ChatGPT suggestions must be converted into a `.agents` task before any code work begins.
- Claude Code is review-only by default and should not edit plugin code unless the user explicitly authorizes that exception in the current thread.
- Kimi Code is review-only by default and should not edit plugin code unless the user explicitly authorizes that exception in the current thread.
- If the user grants such an exception, it must be recorded in `.agents/STATE.md` before any non-Codex code edits begin.

## Workspace Rule
- The primary workspace is the only normal code workspace for this repository.
- `.claude/worktrees/**` and other git worktrees are not part of the default development flow.
- External AIs should review directly against the primary workspace.
- Only use a worktree again if the user explicitly asks for that exception and it is recorded in `.agents/STATE.md`.

## Shared Page Names
- `设置页`: the Little Milestones settings page opened from Obsidian third-party plugin settings via the gear entry.
- `打分页`: the main scoring page opened by clicking the star icon in Obsidian's left sidebar.
- `得分页`: the generated Markdown result document page.

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
- If `styles/**` changes, rebuild and stage `styles.css` in the same round.
- Do not leave source style changes unsynced from generated `styles.css`.
- If a CSS diff is much larger than the intended style change, check line endings with `git ls-files --eol` before reviewing or staging it.
- For iPhone/mobile layout work, prefer checking `styles/07-mobile.css` first.
- Treat Vault sync as a separate explicit step.
- Only the primary workspace may sync files into the Obsidian Vault plugin directory.
- Do not sync directly from a worktree to the Vault.
- If work happened in a worktree, sync it back to the primary workspace first, then sync to the Vault from the primary workspace.
- Before Vault sync, verify that `manifest.json`, `main.js`, and `styles.css` match the current primary workspace version.
- After Vault sync, verify that the Vault copies of those three files match the primary workspace copies.
- Do not run `git add`, `git status`, and `git commit` in parallel; stage first, confirm, then commit.

## Commit Prefix
- Use `[codex]` in commit messages for Codex-authored commits.

## External Agent Expectation
- Treat `cursor` feedback as review input by default.
- Treat `claude-code` feedback as review input by default.
- Treat `kimi-code` feedback as review input by default.
- Treat `chatgpt` feedback as advisory product/workflow input by default, not as direct code instructions.
- Non-Codex agents may edit plugin code only when the user explicitly authorizes that exception and `.agents/STATE.md` records the exact `owner` and `write-scope`.

## First Read
Codex should treat `.agents/AGENT_RULES.md` as the concise operator guide and `.agents/README.md` as the full protocol.

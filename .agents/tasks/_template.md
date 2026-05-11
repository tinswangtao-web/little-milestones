# Task: <slug>

## Context / User Request
- Describe the user request in plain language.

## Ownership
- `owner`: <code-ai | review-ai | none>
- `status`: <planned | in-progress | awaiting-review | awaiting-fix | awaiting-sync | done>
- `write-scope`: <files or globs>
- `read-scope`: <optional files or globs>
- `sync-to-vault`: <pending | done | n/a>

## Plan
1. Step one.
2. Step two.
3. Step three.

## Affected Files
- `/absolute/or/repo-relative/path`

## Artifact Handling Notes
- Note whether `main.js` or `styles.css` were hand-edited.
- If yes, explain why.

## Verification Steps
- `git status --short` checked before work.
- Typecheck or syntax checks run.
- Obsidian desktop behavior checked.
- iPhone/mobile behavior checked.
- Vault sync checked if relevant.

## Acceptance Checklist
- [ ] Functional behavior matches request.
- [ ] Mobile interaction verified.
- [ ] Review completed or explicitly waived.
- [ ] Vault sync completed if needed.

## Implementation Log
- [agent @ YYYY-MM-DD HH:MM] Added task card.

## Handoff
- `next-owner`: <code-ai | review-ai | none>
- `note`: <what to inspect next>

# Review: Collaboration Protocol Feedback for Codex

- **reviewer**: codex (review-only pass)
- **date**: 2026-04-28
- **scope**: `AGENTS.md`, `.agents/AGENT_RULES.md`, collaboration workflow
- **goal**: give Codex a concrete, enforceable protocol improvement checklist

## Findings And Recommendations

### 1) Add explicit "no commit without user request" guard (high)
- **Risk**: implementation agents may create fragmented commits while user is still validating behavior.
- **Current gap**: protocol describes commit style and sequence, but not an explicit "user must request commit" gate.
- **Recommendation**:
  - Add a hard rule: *Do not commit unless the user explicitly asks for commit*.
  - Add exception text only for emergency rollback/hotfix requests explicitly confirmed by user.

### 2) Make Vault deploy preconditions mandatory (high)
- **Risk**: synced Vault files can drift from intended source/artifact pairing.
- **Current gap**: protocol says "verify", but tooling does not enforce a deploy gate.
- **Recommendation**:
  - Require `npm run build` before deploy unless `--no-build` is explicitly justified.
  - Add deploy guard script checks:
    1. source/artifact sync (`src/**` -> `main.js`, `styles/**` -> `styles.css`)
    2. post-sync hash match for `manifest.json`, `main.js`, `styles.css`.

### 3) Add line-ending policy for CSS artifacts (high)
- **Risk**: CRLF/LF churn causes huge fake diffs and review fatigue.
- **Current gap**: no repository-level eol enforcement.
- **Recommendation**:
  - Add `.gitattributes` rule for CSS (`*.css text eol=lf`).
  - Mention in protocol: normalize line endings before reviewing large style diffs.

### 4) Add mandatory task split rule on requirement changes (medium)
- **Risk**: one task card accumulates unrelated changes, making rollback and audit difficult.
- **Current gap**: task cards are required, but split triggers are not explicit.
- **Recommendation**:
  - Define split trigger: if user introduces a new functional goal, create a new task card.
  - Keep old card status and handoff note frozen for traceability.

### 5) Add "experiment rollback" protocol for UX trials (medium)
- **Risk**: temporary UX experiments (sheet lift/drag, gesture guards) may degrade UX and linger.
- **Current gap**: rollback behavior is implicit.
- **Recommendation**:
  - For experimental UX changes, require:
    - reversible flag/class toggle
    - rollback plan in task card before release
    - user validation checkpoint before commit.

### 6) Strengthen review-only template for non-owner agents (medium)
- **Risk**: accidental edits by review agents under ambiguous state.
- **Current gap**: ownership rules exist, but a strict execution template is not front-loaded.
- **Recommendation**:
  - Add a short "review-only execution block" in `.agents/AGENT_RULES.md`:
    - allowed writes: `.agents/reviews/**` (and explicitly approved docs)
    - forbidden writes: plugin runtime/source files unless exception recorded in `STATE.md`.

## Suggested Implementation Order For Codex

1. Deploy guard + hash verification automation.
2. "No commit without explicit user request" hard rule.
3. `.gitattributes` LF enforcement for CSS.
4. Task split trigger and experiment rollback template in protocol docs.
5. Review-only execution block hardening for non-owner agents.

## Expected Outcome

- Cleaner commit history, fewer accidental release drifts, lower review noise, and faster rollback when UX experiments fail.

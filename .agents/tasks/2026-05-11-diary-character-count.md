# 2026-05-11 Diary Character Count

## Goal
- Add diary character count for 打分页 diary editing and generated 得分页 Markdown.
- Count only effective user-entered diary content, consistent with placeholder/sample-text handling.
- Exclude fixed diary module id `comment` from the count.

## Scope
- `src/diary/modules.ts`
- `src/composers/day-data-composer.ts`
- `src/renderers/report-builder.ts`
- `src/types.ts`
- `src/modals/panels/diary-panel.ts`
- generated `main.js`
- generated `styles.css`
- `.agents/**`

## Out Of Scope
- Do not change scoring behavior.
- Do not count the `comment` module.
- Do not count template labels or auto-generated unfilled sentence fragments.
- Do not sync to Vault or commit without explicit user authorization.

## Requirements
- 打分页 diary editing shows a live or reasonably debounced character count.
- UI wording uses `字` or `字符`, not English-style word count wording.
- Count includes user-entered Chinese characters, letters, digits, punctuation, spaces, and line breaks according to the saved text string after existing normalization.
- Generated Markdown includes the same-count diary character record in a style consistent with the current document.
- Only filling `comment` while other diary fields are empty shows/counts as 0.
- Closing and reopening the same day shows a count consistent with saved Markdown.

## Rollback Note
- Remove the diary character count helper/export, UI count element/update calls, generated Markdown count line, related CSS, and rebuild `main.js` / `styles.css`.

## Verification
- [x] Review existing diary parse/compose/save path and placeholder normalization.
- [x] Implement shared count helper that excludes `comment`.
- [x] Add 打分页 live count UI.
- [x] Add generated Markdown count line.
- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `node --check main.js`
- [x] `git diff --check` (pass; existing EOL warnings only for `manifest.json`, `src/constants.ts`, `styles/00-base.css`)

## Status
- `committed-no-push`

## Notes
- 2026-05-11 09:27 +0800：Created task from user request and acquired Codex lock. Existing worktree already contains unrelated dirty changes from earlier tasks; preserve them and keep this implementation scoped.
- 2026-05-11 09:44 +0800：Implemented shared diary character count helper, 打分页 live display, and Markdown output line. Count excludes `comment`, built-in samples, labels, and fixed narrative prefixes; typecheck/build/node-check/diff-check passed. Review card and precommit checklist updated; no Vault sync or commit authorized.
- 2026-05-11 09:39 +0800：Cursor review concluded releasable / No blocking issues. User requested sync to updated Vault path `/Users/tins-macmini/Documents/Tins'Vault`; acquired sync lock. No commit authorized.
- 2026-05-11 09:40 +0800：Synced to updated Vault path via `npm run deploy`. MATCH: `main.js b533b0c6bba5`, `styles.css c0f5c6ca1bf5`, `manifest.json e2456f26890b`. Awaiting user test; no commit authorized.
- 2026-05-11 09:43 +0800：User requested follow-up: empty diary small modules should remain blank in generated Markdown instead of writing `无`. Acquired narrow lock for `src/diary/modules.ts`, generated `main.js`, and `.agents/**`. No commit authorized.
- 2026-05-11 09:43 +0800：Implemented follow-up by treating exact module value `无` and built-in narrative `...无` forms as empty in diary normalization, and applying that normalization during `composeDiaryContent()`. `npx tsc --noEmit`, `npm run build`, `node --check main.js`, and `git diff --check` passed; diff-check only reports existing EOL warnings. Awaiting follow-up review; no Vault sync or commit authorized.
- 2026-05-11 10:06 +0800：User explicitly requested syncing the blank small-module follow-up to Vault for testing before follow-up review. Acquired sync lock; no commit authorized.
- 2026-05-11 10:10 +0800：Synced follow-up to Vault via `npm run deploy`. MATCH: `main.js 9bb9334124cd`, `styles.css c0f5c6ca1bf5`, `manifest.json e2456f26890b`. Awaiting user test; no commit authorized.
- 2026-05-11 10:19 +0800：User requested generated diary Markdown remove internal `今天的小日记` and auto phrases like `今天的天气是`, keeping only the top `今日日记` heading and user-entered content. Acquired narrow diary compose/parse lock. No commit authorized.
- 2026-05-11 10:22 +0800：Implemented diary output simplification. `composeDiaryContent()` now outputs only normalized user-entered values and freewrite text, without internal `### 今天的小日记` / `### 自由记录` headings, fixed weather/comment phrases, module labels, or auto punctuation. `parseDiaryModules()` now falls back to `freeWrite` for new plain-content diary bodies so reopened saved content remains visible. `npx tsc --noEmit`, `npm run build`, `node --check main.js`, and `git diff --check` passed; diff-check only reports existing EOL warnings. No Vault sync or commit authorized.
- 2026-05-11 10:37 +0800：Review AI reported P1 x2 and P2 x3 for diary output follow-up. Acquired lock to fix `无` over-normalization, new plain-format parse symmetry, newline count normalization, UI count wording, and segment-based counting. No Vault sync or commit authorized.
- 2026-05-11 10:41 +0800：Addressed review findings. Removed global single-character `无` clearing while keeping exact prefixed empty forms; added plain-format parser that maps first paragraph lines back to module order and removes consumed lines from `freeWrite`; normalized module newlines consistently for compose/count; changed UI copy to `日记字数：X 字（不含评语）`; changed count to sum per segment without connector newlines. Verification: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, intended-file `git diff --check`, and Node behavior checks passed. Full `git diff --check` is still blocked by unrelated `.gitignore` / `agent-collaboration-kit/**` trailing whitespace outside this task. No Vault sync or commit authorized.
- 2026-05-11 14:10 +0800：Review AI found blocking P1: label-free visible Markdown is not reversible if parsed only from visible body, plus P2 weather/mood tags still use old label parsing. Acquired write lock to persist structured diary module values in frontmatter/data layer and derive tags from those values. No Vault sync or commit authorized.
- 2026-05-11 10:50 +0800：Follow-up Review AI check found blocking P1: label-free plain diary output is not safely reversible. Because empty module slots are omitted on save but parse maps first paragraph lines by fixed module order, freeWrite-only or later-module-only content can reopen as weather/mood. P2: `tags.weather/mood` still read removed label lines. Review checks passed: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, intended-file `git diff --check`. Awaiting code-ai fix; no Vault sync or commit authorized.
- 2026-05-11 14:15 +0800：Addressed follow-up Review AI P1/P2 by adding structured `diaryModules` to frontmatter/data flow, preferring that value when reopening 打分页, keeping plain body parse as conservative fallback, and deriving `tags.weather/mood` from structured module values. Verification passed: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, intended-file `git diff --check`, and targeted Node behavior checks. Full `git diff --check` still fails on unrelated `.gitignore` / `agent-collaboration-kit/**` trailing whitespace. No Vault sync or commit authorized.
- 2026-05-11 14:20 +0800：Follow-up strict re-review passed. Review AI confirmed the frontmatter/data-layer `diaryModules` flow closes the save/reopen loop, plain-body parse is now conservative fallback only, and `tags.weather/mood` no longer depend on removed visible label lines. Local review checks passed: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, and intended-file `git diff --check`. Residual risk is limited to older already-saved label-free files without `frontmatter.diaryModules`, which now safely fall back to `freeWrite`. Awaiting user acceptance; no Vault sync or commit authorized.
- 2026-05-11 14:46 +0800：Addressed user acceptance feedback: generated Markdown no longer mixes `comment` into the main `## 📝 今日日记` body; freeWrite stays with other diary content in the main diary section; non-empty comment now renders as separate same-level `## 💬 评语` section after diary content. `extractDiaryContent()` now stops before the next `##` heading so reopening does not pull the comment section into freeWrite. Verification passed: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, intended-file `git diff --check`, and targeted compose behavior check. No Vault sync or commit authorized.
- 2026-05-11 14:53 +0800：Acceptance-fix re-review found a new blocking P1 in legacy-file compatibility: `extractDiaryContent()` now truncates `## 📝 今日日记` at any next `##` heading, not only the separate `## 💬 评语` section. For older label-free files without `frontmatter.diaryModules`, user-written Markdown subheadings inside freeWrite will be lost on reopen before fallback parse runs. Review checks passed: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, intended-file `git diff --check`, plus a minimal reproduction script. Awaiting code-ai fix; no Vault sync or commit authorized.
- 2026-05-11 14:58 +0800：Fixed Review AI P1 by narrowing `extractDiaryContent()` truncation to the explicit `## 💬 评语` heading only. User-authored `##` / `###` headings inside diary/freeWrite are preserved, while the generated comment section remains excluded from `diaryContent` on reopen. Verification passed: `npx tsc --noEmit`, targeted reproduction script, `npm run build`, `node --check main.js`, and intended-file `git diff --check`. Full `git diff --check` remains blocked by unrelated `.gitignore` / `agent-collaboration-kit/**` trailing whitespace. No Vault sync or commit authorized.
- 2026-05-11 15:02 +0800：Review AI re-check passed. Minimal reproduction confirms user-authored `## 我的小标题` remains inside extracted `diaryContent`, while explicit generated `## 💬 评语` is still excluded. Local review checks passed: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, intended-file `git diff --check`, and targeted extraction scripts. Awaiting user acceptance or Vault sync authorization; no commit authorized.
- 2026-05-11 15:22 +0800：User authorized Vault sync and closeout, no commit. Ran required verification: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, and target-file `git diff --check` all passed. Synced to `/Users/tins-macmini/Documents/Tins'Vault/.obsidian/plugins/little-milestones` via `npm run deploy`; post-sync `node scripts/deploy.mjs --verify-only` confirmed MATCH: `main.js 2ada6872a653`, `styles.css c0f5c6ca1bf5`, `manifest.json e2456f26890b`. Awaiting user hand test; no commit authorized.
- 2026-05-11 15:30 +0800：User reported Vault acceptance passed and explicitly authorized committing this diary-character-count round. Re-ran precommit verification: `npx tsc --noEmit`, `npm run build`, `node --check main.js`, and target-file `git diff --check` passed. Commit is limited to diary-character-count files and `.agents` closeout records; no push requested.

# CODEX_TO_CURSOR_REVIEW_CARD

## Current round goal

用户原始目标：为日记增加字数统计；打分页实时显示，保存后的 Markdown 也记录；排除 `comment` 评语模块；只统计有效用户输入，不统计占位/示例/自动模板句式。

后续目标：
- 空日记小模块生成 Markdown 时保持为空，不自动写 `无`。
- 得分页 `## 📝 今日日记` 下方只呈现用户输入内容，不出现 `今天的小日记`、`今天的天气是`、`自由记录` 等内部标题或自动句式。
- 本轮处理 Review AI follow-up 阻塞：label-free Markdown 正文不可逆、`tags.weather/mood` 仍依赖旧标签行解析。
- 本轮用户验收反馈：自由记录应属于 `## 📝 今日日记` 的完整章节内容；评语应拆成另一个同级章节，并放在日记内容之后。

## Changed file list

本轮 Review AI findings 修复重点：
- `src/diary/modules.ts`
- `src/renderers/report-builder.ts`
- `src/storage/day-data-store.ts`
- `src/types.ts`
- `src/composers/day-data-composer.ts`
- `src/renderers/report-sections.ts`
- `src/modals/helpers/daily-modal-state.ts`
- `src/modals/daily-scoring-modal.ts`
- `src/main.ts`
- `src/modals/panels/diary-panel.ts`
- generated `main.js`
- `.agents/STATE.md`
- `.agents/LOCK.md`
- `.agents/log.md`
- `.agents/tasks/2026-05-11-diary-character-count.md`
- `.agents/reviews/CODEX_TO_CURSOR_REVIEW_CARD.md`
- `.agents/reviews/CODEX_PRECOMMIT_CHECKLIST.md`

注意：工作树里有大量前序未提交改动和无关 dirty 文件。请本轮重点审查以上文件中与日记输出、回读、字数统计相关的 diff。

## Findings addressed

- P1 fixed: new label-free visible Markdown body no longer needs to be reverse-engineered by line order. `diaryModules` are persisted in YAML frontmatter and loaded back through `DayDataStore` / `loadDailyModalState()`.
- P1 mitigation: plain-body parsing is now conservative fallback only. It recognizes legacy/prefixed narrative lines, but ordinary one-line content stays `freeWrite` instead of being guessed as weather/mood.
- P2 fixed: `DayDataComposer` derives `tags.weather` / `tags.mood` from resolved structured diary module values, not removed visible label lines.
- Previous review fixes kept: single user-entered `无` is preserved; exact prefixed built-in empty forms still normalize to empty; module newlines normalize to ` / ` for compose/count; UI copy is `日记字数：X 字（不含评语）`; count sums segments without artificial connector newlines.
- User acceptance feedback fixed: `comment` is no longer part of `composeDiaryContent()`; non-empty comment renders after the diary body as a separate same-level `## 💬 评语` section.

## Core logic

- `composeDiaryContent()` outputs only user-entered values/freewrite under `## 📝 今日日记`; no internal diary subheadings, labels, fixed weather/comment phrases, or auto punctuation are emitted.
- `composeDiaryCommentContent()` normalizes the `comment` module separately, and `MarkdownReportBuilder` appends it as `## 💬 评语` only when non-empty.
- `extractDiaryContent()` stops only before the explicit `## 💬 评语` heading, so reopening a generated file does not pull the separate comment section into `freeWrite` while preserving user-authored Markdown headings inside the diary body.
- `buildFrontmatter()` writes non-empty `report.diaryModules` into YAML frontmatter. This is the machine-readable source for reopening same-day diary modules.
- `DayDataStore` reads `frontmatter.diaryModules` into `DayData.diaryModules`; `loadDailyModalState()` prefers that structured value and only falls back to `parseDiaryModules()` for older files.
- `parseDiaryModules()` keeps legacy parsing and conservative prefixed-line fallback, but no longer maps arbitrary first lines by fixed module order.
- `comment` remains excluded from character count.

## Verification already run

- `npx tsc --noEmit`: pass
- `npm run build`: pass, regenerated `main.js` / `styles.css`
- `node --check main.js`: pass
- Intended-file `git diff --check`: pass
- Vault sync closeout: pass
  - `npm run deploy` synced to `/Users/tins-macmini/Documents/Tins'Vault/.obsidian/plugins/little-milestones`
  - `node scripts/deploy.mjs --verify-only`: pass
  - `MATCH main.js 2ada6872a653`
  - `MATCH styles.css c0f5c6ca1bf5`
  - `MATCH manifest.json e2456f26890b`
- Node behavior checks: pass
  - `parseDiaryModules('自由记录一句')` keeps content in `freeWrite`, not weather
  - `parseDiaryModules('跑步')` keeps content in `freeWrite`, not weather
  - prefixed `今天我做了跑步` fallback is recognized as `todayThing`
  - `todayThing='无'` composes as visible `无`
  - diary compose keeps freeWrite in the main diary body and excludes comment
  - comment compose returns the separate comment text
  - legacy diary/freeWrite content containing `## 我的小标题` stays intact
  - generated `## 💬 评语` is excluded from extracted `diaryContent`
  - module multiline count matches composed ` / ` normalization
  - comment-only count is 0

Full `git diff --check` still fails on unrelated dirty files outside this task: `.gitignore` and `agent-collaboration-kit/**` trailing whitespace.

## Known risks / open confirmations

- Existing already-saved label-free Markdown files that were created before this structured frontmatter fix may not have `diaryModules` in frontmatter. For those files, ambiguous plain content falls back to `freeWrite` rather than being guessed into the wrong module.
- Latest acceptance-feedback fix has been synced to Vault. User completed Vault acceptance and explicitly authorized commit for this diary-character-count round. No push requested.
- Strict review requested because this changes diary composer/parser behavior.

## Strict Cursor review requested

Yes.

## Suggested user acceptance steps

1. 在“今天做了”模块只输入 `无`，保存后重开，确认该模块仍保留 `无`。
2. 填写 weather、mood、todayThing 后保存，重开同一天，确认模块值正确回读，`freeWrite` 没有重复堆积，重新保存后 Markdown 无重复。
3. 在模块输入框输入带换行的多行文字，确认打分页字数与 Markdown 中 ` / ` 后的实际字符数一致。
4. 只填评语模块、其它留空，确认字数显示为 0。
5. 保存后确认得分页 `## 📝 今日日记` 下方不出现 `今天的小日记`、`今天的天气是`、`自由记录` 等自动文案。
6. 同时填写自由记录和评语，确认自由记录仍在 `## 📝 今日日记` 内，评语出现在后面的同级 `## 💬 评语` 章节。

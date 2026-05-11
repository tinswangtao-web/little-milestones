# Review AI 审查 — 日记可计字数（不含评语）

**日期**: 2026-05-11
**对照**: `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`（字数统计轮次）
**结论**: **Releasable** — **No blocking issues**

## 总评

`countDiaryCharacters` 与 `DayDataComposer` / `MarkdownReportBuilder` 共用同一套结构化 `DiaryModuleValues`，避免把 Markdown 标题、label、固定句式前缀算进字数；排除 `comment`、复用 `normalizeBuiltInSampleValue`、叙事字段去前缀，与产品需求一致。打分页通过 `syncAndRefresh` → `updateCharCount` 与模块/自由记录联动，逻辑闭环完整。

## Findings

### P0

无。

### P1

无。

### P2（可选优化 / 口径说明）

1. **多字段合并时的「连接用换行」**：`countDiaryCharacters` 使用 `countableValues.join("\n")` 再 `Array.from(...).length`，在多个模块同时有内容时，会比「各字段字数简单相加」多出至多 `(段数 - 1)` 个换行符。若希望与「纯用户键入字符之和」完全一致，可改为对各段分别 `Array.from(segment).length` 后求和（产品需确认更倾向哪种口径）。
2. **空日记字符串**：`DayDataComposer` 在 `diaryText` 为空时用 `{}` 而非 `parseDiaryModules`，字数恒为 0；与「仅有空白字符的 diaryText」若走 parse 的行为可能略有差别，属边缘情况。

## 风险点

- 得分页 Markdown 在「今日日记」前新增固定引用行，依赖自动化解析历史报告的用户需注意（正常阅读无影响）。
- 需在真实 Obsidian 中确认 `.diary-char-count` 在桌面/移动布局下的位置与可读性（代码与样式已接好）。

## 建议修复顺序

当前无必须修复项；若采纳 P2-1，仅需改 `countDiaryCharacters` 一处并回归验收步骤 1–4。

## 最小复测建议

1. 打分页：小记录 + 自由记录变化时，「可计字数（不含评语）」同步更新。
2. 仅填评语：UI 为 0；保存后 md 中引用块为 0。
3. 填写非评语内容并保存：md 出现 `字数（不含评语）：**N 字**`，与 UI 一致。
4. 重开同一天：字数与已保存 md 一致。

## 验证（本 review 侧）

- 静态阅读：`src/diary/modules.ts`、`diary-panel.ts`、`day-data-composer.ts`、`report-builder.ts`、`types.ts`；`DayReport` 仅由 `DayDataComposer` 组装，`diaryCharacterCount` 字段一致。
- `updateCharCount` 虽早于 `charCount` 解构定义，但仅在解构完成后被调用，无 TDZ 运行时错误。

---

## 2026-05-11 10:50 Follow-up Review

**对照**: code-ai 修复上一轮 P1/P2 后的工作区 diff
**结论**: **Needs fix** — plain diary parse 仍有阻塞回读风险。

## Findings

### P0

无。

### P1

1. **新纯文本日记格式会把自由记录或后置小模块错回读到前置模块。**
   位置：`src/diary/modules.ts` 的 `fillPlainDiaryModules()` / `composeDiaryContent()`。

   `composeDiaryContent()` 只输出非空模块值，且不输出标签或空占位；但 `fillPlainDiaryModules()` 回读时按固定顺序把第一段每一行分配给 `weather`、`mood`、`todayThing` 等模块。这样保存以下常见输入后，重开同一天会错位：
   - 只填自由记录：第一行会被当作 `weather`，自由记录框变空。
   - 只填 `今天我做了=跑步`：保存为一行 `跑步`，重开会被当作 `weather`。
   - 填 `todayThing + freeWrite` 但没填天气/心情：`todayThing` 会被当作 `weather`，自由记录段本身仍在，但结构化小记录丢位。

   这违反任务要求「Closing and reopening the same day shows a count consistent with saved Markdown」背后的编辑回读预期，也会让用户以为内容被挪到天气/心情。`今天我做了=无` 的特殊分支只覆盖单字 `无`，不能覆盖普通内容。

### P2

1. **新格式下 `DayDataComposer` 的 `tags.weather` / `tags.mood` 不再能读取天气心情。**
   位置：`src/composers/day-data-composer.ts`。当前仍通过 `readDiaryLine(diaryText, module.label)` 解析标签行；新 `diaryContent` 已去掉标签，所以 report tags 会变成 `undefined`。如果这些 tags 未来用于统计、筛选或 frontmatter，这里需要改为复用 `diaryModuleValues.weather/mood`。目前未看到渲染侧直接消费，列为非阻塞。

## 建议修复顺序

1. 先修复纯文本输出的可逆性。可选方案：保存时保留机器可解析但用户可接受的轻量标记；或在内部持久化仍保留结构化标签、仅得分页展示层隐藏标签；或重新设计纯文本回读规则，至少不要把只有自由记录/后置小模块的内容错塞进天气。
2. 若保留新纯文本格式，补充回归用例：只填自由记录、只填 `今天我做了=跑步`、填 `todayThing + freeWrite` 且天气心情为空、填天气心情和多个小记录后反复保存不重复。
3. 顺手把 `tags.weather/mood` 改为从已解析的 `diaryModuleValues` 取值，避免新格式下标签字段失效。

## 验证（本 review 侧）

- `npx tsc --noEmit`: pass
- `npm run build`: pass
- `node --check main.js`: pass
- `git diff --check -- src/diary/modules.ts src/composers/day-data-composer.ts src/renderers/report-builder.ts src/modals/panels/diary-panel.ts main.js`: pass
- 静态审查重点：`composeDiaryContent()` 省略空字段和标签；`fillPlainDiaryModules()` 无法区分「第一段是模块行」还是「第一段是自由记录」，且用压缩后的行号去套未压缩的模块顺序。

---

## 2026-05-11 14:20 Follow-up Re-review

**对照**: code-ai 针对 plain-body 不可逆回读与 `tags.weather/mood` 旧解析路径的修复
**结论**: **Releasable** — **No blocking issues**

## 总评

这轮把“可见 Markdown 保持简洁”和“重开同一天能稳定回读”拆成了两层：可见 `## 📝 今日日记` 正文继续只保留用户输入；机器可读的 `diaryModules` 改为写入 frontmatter，并在 `DayDataStore` / `loadDailyModalState()` 优先走结构化值回填。这样避免了再去猜 plain body 的行序，也把上一轮自由记录/后置小模块被错塞进天气心情的问题消掉了。

## Findings

### P0

无。

### P1

无。

### P2

1. **历史兼容边界仍然存在，但当前处理是合理保守的。**
   对于已经保存过、且不带 `frontmatter.diaryModules` 的旧版 label-free 日记文件，`parseDiaryModules()` 现在只识别明确的旧叙事前缀；像单行 `跑步`、`自由记录一句` 这类模糊内容会落回 `freeWrite`，不会再猜成 `weather/mood`。这会让极少量旧文件在首次重开时失去模块级回填，但比错误回填更安全，属于可接受的兼容策略。

## 风险点

- 建议在真实 Obsidian 中再手测一次“保存后立刻重开同一天”，确认 frontmatter 刷新路径在你的 Vault 环境里也稳定命中结构化 `diaryModules`。
- 若后续要对旧 label-free 文件做“自动迁回模块”的迁移，需要单独设计迁移规则；当前实现选择了安全保守而非激进猜测。

## 最小复测建议

1. 只填自由记录并保存，重开同一天，确认内容仍在自由记录，不会跑到天气。
2. 只填“今天做了”并保存，重开同一天，确认仍回到对应小模块。
3. 填 weather、mood、todayThing、freeWrite 后保存再重开，确认各模块值与字数都保持一致。
4. 只填评语，确认 UI 与 Markdown 中字数仍为 0。

## 验证（本 review 侧）

- 静态审查：`src/diary/modules.ts`、`src/storage/day-data-store.ts`、`src/modals/helpers/daily-modal-state.ts`、`src/composers/day-data-composer.ts`、`src/renderers/report-sections.ts`、`src/renderers/report-builder.ts`、`src/modals/daily-scoring-modal.ts`、`src/types.ts`
- `npx tsc --noEmit`: pass
- `npm run build`: pass
- `node --check main.js`: pass
- `git diff --check -- src/diary/modules.ts src/types.ts src/storage/day-data-store.ts src/composers/day-data-composer.ts src/renderers/report-sections.ts src/modals/helpers/daily-modal-state.ts src/modals/daily-scoring-modal.ts src/main.ts src/modals/panels/diary-panel.ts main.js`: pass
- 代码路径确认：
  - `buildFrontmatter()` 会写入非空 `report.diaryModules`
  - `DayDataStore.buildDayDataFromFrontmatter()` 会回读 `frontmatter.diaryModules`
  - `loadDailyModalState()` 会优先使用 `existingToday.diaryModules`
  - `DayDataComposer` 的 `tags.weather/mood` 已改为取结构化 `resolvedDiaryModuleValues`

---

## 2026-05-11 14:53 Acceptance-Fix Re-review

**对照**: code-ai 针对“自由记录留在今日日记、评语独立成节”的修复
**结论**: **Needs fix** — 旧文件回读新增了正文截断风险。

## Findings

### P0

无。

### P1

1. **旧版 label-free 日记文件若在自由记录中使用 Markdown 二级标题，重开时会丢失后半段正文。**
   位置：`src/storage/day-data-store.ts` 的 `extractDiaryContent()`。

   这轮为把独立的 `## 💬 评语` 从 `## 📝 今日日记` 正文里分离，新增了：
   - `afterDiaryHeading.split(/\r?\n##\s+/)[0].trim()`
   - `diaryBody.split(/\r?\n##\s+/)[0].trim()`

   这会把“今日日记”后面遇到的**任何** `##` 都当成章节边界，而不仅仅是新的评语章节。于是对没有 `frontmatter.diaryModules` 的旧文件，只要自由记录里用户自己写过二级标题，`extractDiaryContent()` 就会截断正文，后续 fallback 解析拿到的已经是不完整内容。

   最小复现：
   - `## 📝 今日日记`
   - `今天先写一点`
   - `## 我的小标题`
   - `后面还有内容`
   - `## 💬 评语`

   当前实现只会提取出 `今天先写一点`，`## 我的小标题` 之后的真实日记内容会消失。因为这是**已存在用户内容在重开时被截断**，应视为阻塞问题。

### P2

无。

## 建议修复顺序

1. 先把 `extractDiaryContent()` 的截断条件从“任意下一个 `##`”收窄成“明确的 `## 💬 评语` 章节”，不要截断用户自己写在自由记录里的 Markdown 标题。
2. 回归两类场景：
   - 新格式：`今日日记 + 独立评语`
   - 旧/边界格式：`今日日记` 正文内部含 `##` / `###` 子标题，但没有评语章节

## 验证（本 review 侧）

- `npx tsc --noEmit`: pass
- `npm run build`: pass
- `node --check main.js`: pass
- `git diff --check -- src/diary/modules.ts src/renderers/report-builder.ts src/storage/day-data-store.ts src/composers/day-data-composer.ts src/renderers/report-sections.ts src/modals/helpers/daily-modal-state.ts src/modals/daily-scoring-modal.ts src/modals/panels/diary-panel.ts src/types.ts main.js`: pass
- 最小复现脚本确认：当前 `extractDiaryContent()` 在 `## 📝 今日日记` 正文内遇到任意 `##` 即截断，输出仅剩首段内容。

---

## 2026-05-11 15:02 Extract Fix Re-review

**对照**: code-ai 针对 `extractDiaryContent()` 截断条件过宽的修复
**结论**: **Releasable** — **No blocking issues**

## 总评

这次修复把旧文件回读边界收窄到了明确的 `## 💬 评语` 章节：用户自己在自由记录里写的 `##` / `###` Markdown 标题不再被误当成章节结束；同时生成文件里的独立评语章节仍会在回读时被排除在 `diaryContent` 之外。这样就同时保住了“自由记录完整留在 `## 📝 今日日记`”和“评语独立成节”的两边要求。

## Findings

### P0

无。

### P1

无。

### P2

无。

## 风险点

- 旧版、且没有 `frontmatter.diaryModules` 的 label-free 文件仍然走保守 fallback；模糊纯文本内容会回到 `freeWrite`，而不会尝试猜测成具体模块。这是当前设计选择，不是本轮回归。
- `## 💬 评语` 现在相当于旧文件回读时的保留章节标题；如果用户历史自由记录正文里恰好手写了这个完全相同的标题，仍会被当作评语边界。这是极窄边界，当前无需阻塞发布。

## 最小复测建议

1. 在自由记录里手写一个 `## 我的小标题` 并保存，重开同一天，确认标题和后续内容都还在。
2. 同时填写自由记录和评语并保存，重开同一天，确认评语不会混回自由记录。
3. 只填评语，确认字数仍是 0，且 `## 📝 今日日记` 不混入评语内容。

## 验证（本 review 侧）

- 静态审查：`src/storage/day-data-store.ts`、`src/renderers/report-builder.ts`
- `npx tsc --noEmit`: pass
- `npm run build`: pass
- `node --check main.js`: pass
- `git diff --check -- src/storage/day-data-store.ts src/renderers/report-builder.ts src/diary/modules.ts src/composers/day-data-composer.ts src/renderers/report-sections.ts src/modals/helpers/daily-modal-state.ts src/modals/daily-scoring-modal.ts src/modals/panels/diary-panel.ts src/types.ts main.js`: pass
- 最小复现脚本：
  - `## 📝 今日日记` 内含 `## 我的小标题` 时，提取结果完整保留标题与后续内容
  - 追加 `## 💬 评语` 后，提取结果仍只保留评语前的日记正文

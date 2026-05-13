# Review: 2026-05-12-report-path-sync

## Review 结论

- 结论：需修复
- 风险等级：高
- 是否阻塞提交：是
- Review 类型：严格 review

## Findings

### P0（必须先修）

- 无。

### P1（建议本轮修）

- [P1-1] 保存当天报告会丢失 boundary marker 后的用户附加内容：
  - 风险：`writeReport()` 直接用新生成的 `fileContent` 覆盖 existing file，只有 `rebuildReportIfExists()` 会保留 `<!-- LM:user-content-boundary -->` 后的 `userAppendix`。如果用户在得分页 boundary 后追加了手写内容，再从打分页保存同一天，该附加内容会静默消失。
  - 影响范围：所有已有 boundary marker 的当天报告；触发路径是打分页保存当前日期。
  - 代码位置：`src/storage/day-data-store.ts:137-147` 覆盖写入；`src/storage/day-data-store.ts:190-228` 只在边界报告重建路径保留 appendix。
  - 建议：把 appendix 保留逻辑提成共享 helper，并在 `writeReport()` 修改 existing file 前同样读取旧内容、提取 marker 后附加内容、追加回新内容。对没有 marker 的旧文档，仍按现有安全策略处理，避免猜测性搬运无法识别内容。
  - 可延期到下轮：否。

- [P1-2] 旧文档的评语反向读取会吞掉评语后的后续二级标题内容：
  - 风险：`extractDiaryComment()` 从 `## 💬 评语` 一直读到 boundary marker 或文件结尾。旧文档没有 marker 时，用户在评语后增加的任意 `## ...` 段落会被当成评语回填到打分页，再次保存后进入 frontmatter/managed comment 区，造成正文结构错乱。
  - 影响范围：没有 boundary marker 的历史平铺文件，或用户手动删除 marker 的文件。
  - 代码位置：`src/storage/day-data-store.ts:602-608`。
  - 建议：评语提取应在 marker 前截断，并额外在下一个 H2 heading 前截断，例如匹配 `^##\s+`。这样 `## 💬 评语` 只负责自己的段落，后续用户自建章节不被吸入 comment。
  - 可延期到下轮：否。

- [P1-3] 协作状态里的 active workspace 与当前实际仓库不一致：
  - 风险：当前审查运行目录是 `/Users/tins-macmini/Documents/Vibe Coding/obsidian-little-milestones`，但 `.agents/STATE.md` 写的是 `/Users/tins-macmini/Documents/AI Files/obsidian-little-milestones`。后续同步 Vault、提交或复核时容易让代码 AI 在错误 checkout 执行。
  - 影响范围：发布流程、Vault sync、commit 前检查。
  - 代码位置：`.agents/STATE.md:5`。
  - 建议：代码 AI 修复业务问题时同步更正 active workspace 为当前主工作区，或明确说明本轮实际主工作区为何是 `AI Files`。
  - 可延期到下轮：否，至少要在 Vault sync/commit 前修正。

### P2（优化项）

- [P2-1] `writeReport()` 中同一日期连续调用两次 `getDayFile()`，建议在保留 appendix 改造时顺手复用一次解析结果，降低竞态和重复查询。

## 风险与假设

- 风险点：本轮涉及保存路径、正文解析、renderer/composer、迁移和生成产物，属于必须严格 review 的高风险变更。
- 开放问题：尚未在真实 Obsidian/Vault 中验证新路径落盘、旧平铺文件复写、以及得分页手改后回填。
- 假设前提：周目录采用“按月份日历周行”的 `第N周`，这是用户已接受的实现边界。

## 已执行验证

- `npx tsc --noEmit`：通过
- `npm run build`：通过
- `node --check main.js`：通过
- `git diff --check`：通过

## 最小复测步骤

1. 在已有 marker 的报告末尾 marker 后追加一段用户内容，从打分页保存同一天，确认附加内容仍保留。
2. 找一个无 marker 的旧报告，在 `## 💬 评语` 后追加新的 `## 自定义章节`，重开打分页，确认评语栏不包含自定义章节。
3. 对一个全新日期保存，确认文件生成在 `savePath/年/月/第N周/YYYY-MM-DD.md`。
4. 对一个历史平铺日期保存，确认仍修改原平铺文件，不创建分目录副本。

## 给代码 AI 的可转发指令 / 下一步

```text
请修复 report-path-sync 严格 review 的 P1：
1. 在 src/storage/day-data-store.ts 中让 writeReport() 保存已有文件时保留 <!-- LM:user-content-boundary --> 后的用户附加内容；建议抽出与 rebuildReportIfExists() 共享的 appendix 提取/拼接 helper，避免两套逻辑漂移。
2. 修正 extractDiaryComment()：评语正文应在 boundary marker 前截断，并且在下一个 H2 heading 前截断，避免无 marker 旧文档的后续章节被吸入 comment。
3. 修正 .agents/STATE.md 的 active-workspace 与当前主工作区不一致问题，或在状态中明确本轮实际主工作区依据。

完成后请补充：
- npx tsc --noEmit
- npm run build
- node --check main.js
- git diff --check
- 针对 marker appendix 保留和旧文档评语截断的最小 sanity check
```

---

## 代码 AI 跟进（Round 2，已落地）

- **P1-1**：已新增 `extractReportUserAppendix()`，`writeReport()` 在覆盖已有文件前读取旧内容并拼接附录；`rebuildReportIfExists()` 复用同一 helper，避免两套逻辑漂移。
- **P1-2**：`extractDiaryComment()` 在 `stripManagedSection` 前增加 `truncateCommentBodyAtNextHeading()`，按 `\r?\n##\s` 截断后续 H2 章节。
- **P1-3**：`.agents/STATE.md` 的 `active-workspace` 已更新为 `/Users/tins-macmini/Documents/Vibe Coding/obsidian-little-milestones`。
- **验证**：`npx tsc --noEmit`、`npm run build`、`node --check main.js`、`git diff --check` 通过；另运行独立 `node -e` 校验评语截断与 marker 附录拼接逻辑。

---

## Round 2 Re-review 结论

- 结论：可发布（进入 Vault 同步 / Obsidian 手测前置阶段）
- 风险等级：中
- 是否阻塞提交：否
- Review 类型：严格 re-review

## Findings

### P0（必须先修）

- 无。

### P1（建议本轮修）

- 无。

### P2（优化项）

- [P2-1] `writeReport()` 对无 marker 且无法安全识别 appendix 的旧文档仍会按正常保存流程重建 managed 内容；这符合当前“打分页保存会重新生成得分页”的既有行为，但建议用户验收时额外用旧文档带自定义尾部的样例确认是否符合预期。

**No blocking issues**。

## 已执行验证

- `npx tsc --noEmit`：通过
- `npm run build`：通过
- `node --check main.js`：通过
- `git diff --check`：通过

## 最小复测步骤

1. 在已有 marker 的报告末尾 marker 后追加一段用户内容，从打分页保存同一天，确认附加内容仍保留。
2. 找一个无 marker 的旧报告，在 `## 💬 评语` 后追加新的 `## 自定义章节`，重开打分页，确认评语栏不包含自定义章节。
3. 对一个全新日期保存，确认文件生成在 `savePath/年/月/第N周/YYYY-MM-DD.md`。
4. 对一个历史平铺日期保存，确认仍修改原平铺文件，不创建分目录副本。

## 给代码 AI 的可转发指令 / 下一步

```text
当前 strict re-review 无阻塞问题。

建议下一步：
1. 不要 commit；先按仓库流程等待用户授权同步到 Vault。
2. 同步 Vault 前填写或摘要 .agents/reviews/PRECOMMIT_CHECKLIST.md，并确认 manifest.json、main.js、styles.css 来自主工作区当前版本。
3. 用户授权同步后运行 npm run deploy，并核对 Vault 中 main.js、styles.css、manifest.json 与主工作区一致。
4. 请用户重点手测：新日期年月周路径、旧平铺文件复写、得分页日记/评语手改回填、marker 后附录保留、旧文档评语后 H2 不被吞。
```

---

## Round 3 Review 结论

- 结论：需修复
- 风险等级：中
- 是否阻塞提交：是
- Review 类型：严格 review

## Findings

### P0（必须先修）

- 无。

### P1（建议本轮修）

- [P1-1] Round 3 的 Vault 同步状态记录互相矛盾：
  - 风险：`.agents/STATE.md` 和 `.agents/LOCK.md` 写明 Round 3 未同步 Vault、仍需用户显式授权；但 `.agents/tasks/2026-05-12-report-path-sync.md` 顶部仍是 `sync-to-vault: done`，并且 Handoff 仍写“Vault 已同步”。用户可能据此在 Obsidian 中测试旧的 Vault 版本，把“未生效”误判成代码 bug，或让代码 AI 跳过必要的 deploy/hash 核对。
  - 影响范围：Vault 验收、发布前检查、后续 commit 边界。
  - 建议：把当前任务卡的 `sync-to-vault` 改回 `pending`，Handoff 改成“Round 3 代码已实现但尚未同步 Vault，等待用户授权”；保留历史 Vault sync 记录但明确它们属于 Round 2/旧 boundary 版本，不代表当前 `main.js` SHA `ad2abb...` 已部署。
  - 是否阻塞提交：是。

### P2（优化项）

- [P2-1] Round 3 代码本身未发现明确阻塞。`sourceVaultMtime` 丢弃旧内存草稿的方向符合“得分页正文更新优先”的目标，但请在 Obsidian 中手测“未保存打分页草稿 + 得分页外部修改”这一冲突场景，确认覆盖策略符合预期。

## 已执行验证

- `npx tsc --noEmit`：通过（AI Files 工作区）
- `npm run build`：通过（AI Files 工作区）
- `node --check main.js`：通过（AI Files 工作区）
- `git diff --check`：通过（AI Files 工作区）
- 对比 `AI Files` 与 `Vibe Coding` 的关键文件 SHA：`src/constants.ts`、`src/storage/day-data-store.ts`、`src/modals/daily-scoring-modal.ts`、`main.js`、`.agents/STATE.md`、任务卡一致。

## 最小复测步骤

1. 修正 `.agents/tasks/2026-05-12-report-path-sync.md` 的 Round 3 Vault 状态为 pending。
2. 用户授权后，从当前 active workspace 执行 Vault sync，并确认 `main.js` SHA 与 `ad2abb97a034064a3479c206e8265c9f597d100a4691cf011a7fc1d6e6cbbe91` 对应版本一致。
3. 在 Obsidian 里重载插件，连续编辑得分页日记/评语后重开打分页，确认读到最新正文。
4. 新保存得分页，确认底部 boundary 是 `[//]: # (lm-user-content-boundary)`，阅读视图不显眼显示。

## 给代码 AI 的可转发指令 / 下一步

```text
请修复 Round 3 review 发现的协作记录阻塞项：
1. 将 .agents/tasks/2026-05-12-report-path-sync.md 的 sync-to-vault 从 done 改回 pending，因为 Round 3 的 draft mtime + link-ref boundary 版本尚未同步 Vault。
2. 更新该任务卡 Handoff，明确“Round 3 代码已实现，等待用户显式授权 Vault sync；此前 Vault sync 记录属于旧版本，不代表当前 main.js SHA ad2abb... 已部署”。
3. 同步 .agents/STATE.md / .agents/LOCK.md / .agents/log.md 的措辞，确保当前状态只有一个口径：awaiting user authorization for Vault sync，no commit authorized。

完成后请回传 git status，并等待用户授权同步 Vault；不要 commit。
```

---

## Round 4 Review 结论

- 结论：需修复
- 风险等级：高
- 是否阻塞提交：是
- Review 类型：严格 review

## Findings

### P0（必须先修）

- 无。

### P1（建议本轮修）

- [P1-1] 当前 build 后 workspace 与 Vault 的 `main.js` 不一致：
  - 风险：任务卡和 STATE 写明 Round 3 已同步 Vault，且 workspace/Vault SHA 一致；但 review 在 AI Files 主工作区重新执行 `npm run build` 后，workspace `main.js` 为 `a38e296c035d3028f75d400414ceba8810848e0a984718bde1895766b3d53546`，Vault `main.js` 仍为 `ad2abb97a034064a3479c206e8265c9f597d100a4691cf011a7fc1d6e6cbbe91`。这说明当前源码构建产物没有部署到 Vault，用户在 Obsidian 中会测到旧版本。
  - 影响范围：Round 3 的 IME-aware diary input、open editor buffer readback、boundary marker 写入策略，以及所有当前 `main.js` 中的生成逻辑。
  - 证据：
    - `shasum -a 256 main.js`（AI Files）：`a38e296c035d3028f75d400414ceba8810848e0a984718bde1895766b3d53546`
    - `shasum -a 256 .../Tins'Vault/.obsidian/plugins/little-milestones/main.js`：`ad2abb97a034064a3479c206e8265c9f597d100a4691cf011a7fc1d6e6cbbe91`
  - 建议：从 active workspace 重新执行 `npm run deploy`，确认 deploy 输出 MATCH，并重新用 SHA256 核对 `main.js` / `styles.css` / `manifest.json` workspace 与 Vault 一致；随后更新 `.agents/STATE.md`、任务卡、log 中的 SHA 与状态。
  - 是否阻塞提交：是。

- [P1-2] Round 4 交接卡漏列本轮新增的 IME / open-buffer 读回改动：
  - 风险：`src/utils/dom.ts`、`src/modals/panels/diary-panel.ts`、`src/modals/panels/diary-panel-fields.ts`、`src/storage/day-data-store.ts` 新增了 IME-aware input 和 open Markdown editor buffer readback，但 `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md` 仍只描述 Round 3 的 mtime + boundary。这些改动属于移动端/输入法/读取入口风险，必须进入 review handoff 与用户验收步骤。
  - 建议：更新 handoff 的改动文件、用户可见变化、验证与验收步骤，明确新增“中文输入法 composition 期间不把拼音中间态写入 diary state”和“得分页打开在编辑器中时优先读取 editor buffer”。
  - 是否阻塞提交：是。

### P2（优化项）

- [P2-1] `USER_CONTENT_BOUNDARY_WRITE` 当前又回到 HTML comment，而 handoff 仍写新写入边界为 `[//]: # (lm-user-content-boundary)`。这不是代码 blocker，但文档必须跟实际行为一致，否则用户验收会看错目标。

## 已执行验证

- `npx tsc --noEmit`：通过（AI Files 工作区）
- `npm run build`：通过（AI Files 工作区；生成 workspace `main.js` SHA `a38e296c035d3028f75d400414ceba8810848e0a984718bde1895766b3d53546`）
- `node --check main.js`：通过（AI Files 工作区）
- `git diff --check`：通过（AI Files 工作区）
- SHA 核对：workspace `main.js` 与 Vault `main.js` 不一致，阻塞 Vault 验收。

## 最小复测步骤

1. 从 `/Users/tins-macmini/Documents/AI Files/obsidian-little-milestones` 重新 `npm run deploy`。
2. 重新核对 workspace 与 Vault 的 `main.js`、`styles.css`、`manifest.json` SHA256 必须一致。
3. 在 Obsidian 中重载插件后，用中文输入法在打分页日记/评语字段输入，确认拼音中间态不会污染保存内容。
4. 保持得分页在编辑器中打开，连续编辑日记/评语后重开打分页，确认读到最新 editor buffer/磁盘正文。

## 给代码 AI 的可转发指令 / 下一步

```text
请修复 Round 4 review 的阻塞项：
1. 当前 AI Files workspace 重新 build 后的 main.js SHA 是 a38e296c035d3028f75d400414ceba8810848e0a984718bde1895766b3d53546，但 Vault main.js 仍是 ad2abb97a034064a3479c206e8265c9f597d100a4691cf011a7fc1d6e6cbbe91。请从 active workspace 重新执行 npm run deploy，并重新核对 workspace/Vault 的 main.js、styles.css、manifest.json SHA256 一致。
2. 更新 .agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md、.agents/tasks/2026-05-12-report-path-sync.md、.agents/STATE.md 和 .agents/log.md，让它们记录当前实际 SHA、Vault sync 状态，并补列 IME-aware input 与 open Markdown editor buffer readback 这两个新增风险点。
3. 修正文档里 boundary marker 的实际描述：当前源码写入的是 HTML comment USER_CONTENT_BOUNDARY_WRITE，不是 [//] link-ref；legacy link-ref 只是读取兼容。

完成后请回传 git status、deploy MATCH 输出、三文件 SHA256 核对结果；不要 commit。
```

---

## Round 5 Review 结论

- 结论：需修复
- 风险等级：高
- 是否阻塞提交：是
- Review 类型：严格 review

## Findings

### P0（必须先修）

- 无。

### P1（建议本轮修）

- [P1-1] 当前 workspace 产物再次与 Vault 不一致：
  - 风险：`.agents/STATE.md`、`.agents/LOCK.md` 和任务卡写明 Round 4 已 deploy 且 workspace/Vault 三文件一致，但 review 重新核对发现当前 workspace 已是更新产物，Vault 仍停留在旧产物。用户在 Obsidian 中不会测到刚刚新增的 editor sentinel hide、IME/open-buffer 相关当前版本。
  - 证据：
    - workspace `main.js`：`8e5b9ecc105b080749ad07a73dc6a90dfe79c5e2b50bcdce19fea5412aa5da94`
    - Vault `main.js`：`a38e296c035d3028f75d400414ceba8810848e0a984718bde1895766b3d53546`
    - workspace `styles.css`：`36ce04e433f50d736005cbf5480b33ad23d782f933b02acd9feb5a954897ba11`
    - Vault `styles.css`：`c0f5c6ca1bf5d908d9c23eb13d53acc22531ec9b58b8e6db1badb6aa9ffebaed`
  - 影响范围：`src/editor/boundary-sentinel-hide.ts` 注册后的 CodeMirror marker 隐藏、`styles/08-editor-boundary.css`、以及当前 build 后 `main.js` 中所有 Round 4/5 行为。
  - 建议：从 AI Files active workspace 重新执行 `npm run deploy`，然后立即重新核对 `main.js`、`styles.css`、`manifest.json` 的 workspace/Vault SHA256 一致，并更新 `.agents` 中的 SHA。不要在 deploy 后再执行会改变产物的 build 或源码修改，除非再次 deploy。
  - 是否阻塞提交：是。

### P2（优化项）

- [P2-1] `IMPLEMENTATION_REVIEW_HANDOFF.md` 已补列 IME-aware input、open editor buffer readback 和 HTML boundary，但还未提到新增的 `src/editor/boundary-sentinel-hide.ts` / `styles/08-editor-boundary.css` 是通过 CodeMirror line decoration 隐藏 marker。建议补进改动文件表和验收步骤，方便用户确认 Source / Live Preview 里 marker 是否隐藏。

## 已执行验证

- `npm run build`：通过（AI Files 工作区；styles.css built from 9 modules）
- `npx tsc --noEmit`：通过（AI Files 工作区）
- `node --check main.js`：通过（AI Files 工作区）
- `git diff --check`：通过（AI Files 工作区）
- SHA 核对：workspace `main.js` / `styles.css` 与 Vault 不一致，阻塞 Vault 验收。

## 最小复测步骤

1. 从 `/Users/tins-macmini/Documents/AI Files/obsidian-little-milestones` 重新运行 `npm run deploy`。
2. 核对 workspace 与 Vault 的 `main.js`、`styles.css`、`manifest.json` SHA256 一致。
3. 在 Obsidian 重载插件，打开得分页 Source / Live Preview，确认 `<!-- LM:user-content-boundary -->` marker 行被隐藏或至少不干扰阅读。
4. 用拼音输入法在打分页日记/评语输入，确认没有拉丁中间态进入最终状态。

## 给代码 AI 的可转发指令 / 下一步

```text
请修复 Round 5 review 的发布阻塞项：
1. 当前 workspace 产物与 Vault 不一致：workspace main.js=8e5b9ecc105b080749ad07a73dc6a90dfe79c5e2b50bcdce19fea5412aa5da94、styles.css=36ce04e433f50d736005cbf5480b33ad23d782f933b02acd9feb5a954897ba11；Vault main.js=a38e296c035d3028f75d400414ceba8810848e0a984718bde1895766b3d53546、styles.css=c0f5c6ca1bf5d908d9c23eb13d53acc22531ec9b58b8e6db1badb6aa9ffebaed。
2. 从 AI Files active workspace 重新运行 npm run deploy，并立即核对 workspace/Vault 的 main.js、styles.css、manifest.json SHA256 一致。
3. 更新 .agents/STATE.md、.agents/LOCK.md、.agents/tasks/2026-05-12-report-path-sync.md、.agents/log.md 与 review handoff 中的最新 SHA 和 Vault 状态。
4. 在 handoff 中补列 src/editor/boundary-sentinel-hide.ts 和 styles/08-editor-boundary.css，以及 Source/Live Preview marker 隐藏验收步骤。

完成后请回传 git status、deploy MATCH 输出和三文件 SHA256 核对结果；不要 commit。
```

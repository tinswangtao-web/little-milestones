# Implementation Review Handoff

## 任务
- `slug`: 2026-05-12-report-path-sync
- `status`: complete
- `round`: 5

## 用户原话目标
1. 以后新建的打分按年月周分文件夹；已存在文档不用自动迁移。
2. 已生成的得分页里，如果改动了 Markdown 文档中的日记或评语内容，希望能同步回打分页输入栏；既可以在打分页改，也可以在得分页改，两边不要错乱。
3. （用户跟进）在得分页多次编辑日记/评语后，重新打开打分页仍应读到最新正文；底部管理区边界不要在阅读视图里显眼露出。
4. （用户跟进 / Round 4）拼音输入法在评语等输入时不应把中间态拉丁串写进状态；在 Obsidian 中编辑得分页时，回填应尽量与编辑器所见一致。

## 改动文件列表（本轮）
| 文件 | 改动性质 |
|------|----------|
| `src/utils/date.ts` | 新增 `getMonthWeekNumber()`、`getMonthWeekLabel()`、`getReportFolderSegments()`，用于生成 `年/月/第N周` 路径桶 |
| `src/main.ts` | 拆分 `legacyFilePath()` / `filePath()` / `getReportFolderPath()` / `getReportPathCandidates()`；新增 `getDayFile()` 暴露真实文件解析 |
| `src/storage/day-data-store.ts` | 旧路径优先 / 年月周新建 / 迁移保留子目录 / `getAllScores` 同日去重 / 正文日记与评语回填；Round 2：`writeReport()` 保留 boundary 后附录、`extractDiaryComment()` 在下一行首 `##` 前截断；Round 3：`findUserContentBoundary` 遍历 `USER_CONTENT_BOUNDARY_MARKERS`；Round 4：若该日报告在某 Markdown 标签页打开，则 `readDayData` / `readDaySummary` 优先 `MarkdownView.editor.getValue()` 再回退 `vault.read` |
| `src/modals/helpers/daily-modal-state.ts` | 判断已有记录改为使用 resolver；打分页初始 diary 数据直接使用 `readDayData()` 的正文优先结果 |
| `src/modals/daily-scoring-modal.ts` | 保存后打开得分页时，改为打开 resolver 找到的真实文件；Round 3：日记草稿附带 `sourceVaultMtime`，若磁盘报告 mtime 新于草稿则丢弃草稿以免盖住正文回填 |
| `src/constants.ts` / `src/renderers/report-builder.ts` | Round 3–4：新写入 boundary 为 `<!-- LM:user-content-boundary -->`（`USER_CONTENT_BOUNDARY_WRITE`）；仍识别 legacy link-ref、`%%`、裸 HTML |
| `src/utils/dom.ts` | Round 4：`bindImeAwareInput` — `input` 在 `isComposing` 时跳过，`compositionend` 再提交 |
| `src/modals/panels/diary-panel.ts` / `diary-panel-fields.ts` | Round 4：日记主 textarea、评语/模块输入、快捷自定义草稿使用 `bindImeAwareInput` |
| `src/diary/modules.ts` | Round 5：`normalizeModuleValue` 对 `comment` 保留换行，不再压成 ` / ` |
| `src/editor/boundary-sentinel-hide.ts` | Round 5：`registerEditorExtension`，编辑视图隐藏 boundary / legacy marker 行 |
| `styles/08-editor-boundary.css` | Round 5：`.lm-boundary-sentinel-line` 在 CodeMirror 中不展示 |
| `main.js` | 构建产物同步更新 |
| `.agents/STATE.md` | `active-workspace` 曾校正为 Vibe Coding 路径（审查用）；当前实现编辑主目录为 AI Files 工作区 |

## 用户可见变化
1. **新建得分页目录结构变化**：以后首次保存新日期时，文件会创建到 `savePath/年/月/第N周/YYYY-MM-DD.md`。
2. **老文档继续沿用原位置**：如果某天已经存在旧平铺文件，后续读取、再保存、保存后打开，都继续命中旧文件，不会自动新建一份分目录副本。
3. **今日日记 / 评语双向同步**：重新打开打分页时，会优先读取正文里 `## 📝 今日日记` 与 `## 💬 评语` 的内容回填到输入栏，再次保存后 frontmatter 与正文重新收敛。
4. **分数区仍是单向生成**：手改表格、目标 callout、周/月汇总或 custom item 展示文本，下次保存仍会被插件生成结果覆盖，不会反向修改打分页。
5. **`savePath` 迁移更安全**：用户以后修改保存目录时，新结构下的 `年/月/第N周` 子目录会被原样带走，不会重新压平成单层文件名。
6. **同日保存不丢 boundary 后附录**：已有 boundary marker（含旧版 HTML / `%%`）且其后的用户追加内容，在打分页再次保存该日时会保留在新文件末尾。
7. **新报告底部 boundary**：新保存的报告末尾写入 HTML 注释 `<!-- LM:user-content-boundary -->`（阅读视图通常不显示）；仍识别旧版 link-ref、`%%`、裸 HTML marker；附录逻辑不变。
8. **得分页多轮编辑仍赢过内存草稿**：若关闭打分页时缓存了日记草稿，但之后得分页文件在磁盘上被更新（mtime 变新），下次打开打分页会以文件为准，不再用旧草稿盖住 `readDayData` 的正文结果。
9. **拼音 / IME 与回填**：打分页日记与评语相关输入在 IME 组合过程中不再把中间态拉丁字母写入状态；若该日报告在 Markdown 标签页打开，`readDayData` 优先读编辑器缓冲以贴近所见。
10. **评语多行一致**：`## 💬 评语` 多行正文不会在保存时再被合成「词 / 词 / 词」。
11. **编辑视图隐藏 boundary**：源码/Live Preview（CodeMirror）中 sentinel 行视觉上隐藏；文件内容仍在。

## 关键实现说明
### 1. 路径 resolver
- `src/main.ts` 现在同时维护：
  - `legacyFilePath(dateStr)`：旧平铺路径
  - `filePath(dateStr)`：新分桶路径
  - `getReportPathCandidates(dateStr)`：按“旧路径优先、新路径其次”返回候选
- `DayDataStore.getDayFile(dateStr)` 统一用于读取、保存前查重、边界回写、打分页已有记录判断，以及保存后打开文件。

### 2. 正文优先回填
- `readDayData()` 在读取 frontmatter 后，会额外从正文提取：
  - `## 📝 今日日记`
  - `## 💬 评语`
- **Round 4**：若该日报告文件在某个 Markdown 叶子中打开，则优先用 `MarkdownView.editor.getValue()` 作为解析全文，否则 `vault.read`；减轻 IME 与 autosave 下「磁盘暂存拼音串」与编辑器所见中文不一致的情况。
- `今日日记` 先过 `parseDiaryModules()`，将可恢复的 diary module 值与 `freeWrite` 带回打分页。
- `评语` 作为独立正文区块，直接覆盖 `diaryModules.comment`。
- 如果正文没有对应 heading，则继续回退到 frontmatter 的 `diaryModules`。

### 3. 重复文件去重
- `getAllScores()` 仍递归扫描整个 `savePath`，但现在按 `basename(dateStr)` 去重，避免历史上若同时存在旧/新两份同日文件时，统计把同一天算两次。

### 4. Round 2 — 严格 review P1 修复
- **boundary 后用户附录**：`writeReport()` 在 `vault.modify` 前读取旧文件，用与边界回写相同的规则拼接 `userAppendix`（优先 marker，其次 `extractUserAppendix` 安全尾部）。
- **评语不吞后续章节**：`extractDiaryComment()` 在 `stripManagedSection` 之前按 `\r?\n##\s` 截断，只保留 `## 💬 评语` 下的本段正文。
- **协作路径**：`active-workspace` 与当前审查主 checkout（Vibe Coding）对齐。

## 已做验证
- `git status --short`
- `npx tsc --noEmit`
- `npm run build`
- `node --check main.js`
- `git diff --check -- src/main.ts src/storage/day-data-store.ts src/modals/helpers/daily-modal-state.ts src/modals/daily-scoring-modal.ts src/utils/date.ts main.js .agents/STATE.md .agents/LOCK.md .agents/log.md .agents/tasks/2026-05-12-report-path-sync.md`
- 命令行 sanity check（基于实际 `src/utils/date.ts` 转译执行）：
  - `2026-05-01 -> 2026/05/第1周`
  - `2026-05-12 -> 2026/05/第3周`
  - `2026-05-31 -> 2026/05/第5周`
  - `2026-06-01 -> 2026/06/第1周`
- 命令行 mock sanity check（最小 stub 跑 `DayDataStore`）：
  - 当同一天同时存在旧平铺路径和新分桶路径时，resolver 优先命中旧文件
  - `migrateSavePath()` 目标路径保留 `年/月/第N周` 子目录
  - `getAllScores()` 对同日期双文件去重，只统计一次
- Round 2：评语截断 + marker 后附录拼接的独立 `node -e` sanity check
- Round 3：`npm run build`、`node --check main.js`；工作区 `main.js` SHA256 `ad2abb97a034064a3479c206e8265c9f597d100a4691cf011a7fc1d6e6cbbe91`（已由 Round 4 构建取代）
- Round 4：`npm run deploy`（AI Files → Tins'Vault）；`MATCH main.js a38e296c035d`；三文件 `shasum -a 256` workspace/Vault 一致，`main.js`=`a38e296c035d3028f75d400414ceba8810848e0a984718bde1895766b3d53546`
- Round 5：`npm run deploy`（AI Files → Tins'Vault）；`MATCH main.js 8e5b9ecc105b`、`MATCH styles.css 36ce04e433f5`；三文件 `shasum -a 256` workspace/Vault 一致：`main.js`=`8e5b9ecc105b080749ad07a73dc6a90dfe79c5e2b50bcdce19fea5412aa5da94`，`styles.css`=`36ce04e433f50d736005cbf5480b33ad23d782f933b02acd9feb5a954897ba11`

## 风险与开放点
1. **本轮与上一轮共享脏工作区**：`src/storage/day-data-store.ts`、`src/utils/date.ts`、`main.js` 本来就带有上一任务 `2026-05-11-goal-completion-consistency-rollups` 的未提交 diff；本轮是在其上继续修改。Review 时请聚焦本轮新增的路径 resolver / 正文回填相关逻辑，同时注意别把上一轮未提交改动混成“本轮新增风险”。
2. **第N周规则是“按月份的周行”**：当前实现按周一为一周起点、并以月份日历的周行计算 `第N周`。用户未要求 ISO 周，也未要求跨月统一周编号。
3. **未做 Obsidian 内手测**：这轮没有在真实 Vault/Obsidian 里点开验证“保存后实际落盘路径”和“正文手改后回填 UI”的端到端体验。
4. **正文反向同步仍是受限的**：`parseDiaryModules()` 不是严格 round-trip parser，所以当前承诺范围仍以 `freeWrite` 与 `comment` 不漂移为主；表格/统计区明确不做反向覆盖。
5. **Boundary 可见性**：阅读视图不渲染 HTML 注释；Round 5 在 CodeMirror 编辑视图对 sentinel 行 `display:none`。若关闭插件或外用编辑器打开文件，仍能看到 marker 文本。
6. **编辑器缓冲优先的边界**：仅当该日报告已在某 Markdown 标签页打开时生效；未打开时仍 `vault.read`。多叶子同开、外部同步器或极端未保存状态理论上可能与磁盘短暂不一致。
7. **IME-aware 输入**：依赖 `InputEvent.isComposing` / `compositionend`；若某环境不派发标准事件，行为可能回退为旧版「每键更新」。

## 是否要求严格 review
是。本任务涉及：
- 保存路径规则变更
- 存储读取入口变更
- 正文到面板状态的反向同步
- `savePath` 迁移行为变更
- 超过 3 个文件

## 建议用户验收步骤
1. 选一个从未生成过的日期保存，确认新文件落到 `savePath/年/月/第N周/YYYY-MM-DD.md`。
2. 选一个历史平铺文件日期保存，确认还是修改原旧文件，而不是新建一份分目录副本。
3. 打开某天得分页，只修改 `## 📝 今日日记` 和 `## 💬 评语`，再回到打分页重开该日期，确认输入栏已回填；再次保存后确认 Markdown 与打分页一致。
4. 故意手改分数表格或 callout，再回到打分页重开，确认分数没有被正文反向污染，仍以前置信息/打分页数据为准。
5. 在得分页连续追加日记/评语文字并保存，多次关闭再打开打分页，确认最新正文始终出现在日记区（不被旧内存草稿粘住）。
6. 新生成或再保存的报告底部为 HTML 注释 boundary（`<!-- LM:user-content-boundary -->`）；旧含 link-ref / `%%` / HTML 的文件仍可正常保留 boundary 后附录。
7. 在得分页用拼音输入法编辑评语后回到打分页，确认不出现未确认的拉丁中间串；该日报告在编辑中保持打开时，回填与编辑器内容一致。

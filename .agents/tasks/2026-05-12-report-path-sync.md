# 得分页分目录与日记评语双向同步

- **slug**: 2026-05-12-report-path-sync
- **created**: 2026-05-12
- **owner**: code-ai
- **status**: complete
- **origin**: 用户要求新建得分页按 `年 / 月 / 第N周` 分目录保存，并让 `今日日记` 与 `评语` 支持从得分页手改后回填到打分页输入栏。
- **sync-to-vault**: done
- **sync-to-vault-note**: Round 5（评语 `comment` 保留换行、CodeMirror 编辑视图隐藏 boundary 行、`src/editor/boundary-sentinel-hide.ts` + `styles/08-editor-boundary.css`）已从 AI Files 主工作区 `npm run deploy` 写入 Vault；三文件 SHA256 与 workspace 一致（见下）。
- **write-scope**: `src/main.ts`, `src/storage/**`, `src/modals/**`, `src/utils/**`, `src/types.ts`, `src/renderers/**`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `main.js`, `.agents/**`

## 目标

在不迁移历史文档的前提下，让新建得分页改为按 `年 / 月 / 第N周` 分目录保存，同时为 `今日日记` 与 `评语` 提供受限双向同步：既可在打分页修改，也可在得分页对应正文区块修改，并在下次打开打分页时正确回填。

## 必须完成

- [x] 新建得分页改为按 `savePath/年/月/第N周/YYYY-MM-DD.md` 创建。
- [x] 已存在的历史平铺文档继续可读、可改，不能因新路径规则失联或生成重复文件。
- [x] 打分页判断“当天已有记录”和保存后打开得分页时，均能定位到真实存在的文件。
- [x] `## 📝 今日日记` 与 `## 💬 评语` 的正文手改能在重新打开打分页时回填到输入栏。
- [x] `scores`、`customItems`、表格、目标 callout、周/月汇总仍以前置信息和打分页计算结果为准，不做正文反向覆盖。
- [x] `savePath` 迁移保留新目录层级，不再把子目录压平成单层文件。

## 非目标

- [ ] 不自动迁移或批量整理已有历史文档目录。
- [ ] 不支持从正文表格、callout 或周/月汇总反向回填分数、自定义项与统计结果。
- [ ] 不承诺所有 diary module 文本都能无损 round-trip；本轮至少保证 `freeWrite` 与 `comment` 不漂移。

## 验证

- [x] `git status --short`
- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `node --check main.js`
- [x] 目标文件 `git diff --check`
- [x] 命令行 sanity check：验证 `getReportFolderSegments()` 的年月周分桶输出
- [x] 命令行 mock sanity check：验证旧路径优先命中、`savePath` 迁移保留子目录，以及同一天旧/新双路径不会重复计入 `getAllScores()`
- [ ] 尚未在 Obsidian 内手动验证新建日期路径、新旧日期复写与日记/评语回填

## 风险与回滚

- 风险：本任务同时改动保存路径、读取解析与打分页初始化逻辑，属于存储/renderer/modal 跨层变更，必须严格 review。
- 风险：`parseDiaryModules()` 不是严格 round-trip parser，因此正文到模块字段只能做受限同步；本轮以 `freeWrite` 和 `comment` 不丢失为优先。
- 回滚：撤回路径分桶 helper、旧路径兼容 resolver 与正文优先回填逻辑，恢复现有平铺保存和 frontmatter-only 读回。

## 记录

- 2026-05-12 23:10 +0800：按用户确认的实现边界新建任务。周目录采用中文 `第N周`，双向同步范围限定为 `今日日记 + 评语`，分数区继续单向生成。
- 2026-05-12 23:18 +0800：实现完成。新增 `getReportFolderSegments()` 与主路径/旧路径 candidate 解析；`DayDataStore` 改为旧文件优先读取、无旧文件时按年月周新建；`readDayData()` 现在会从正文提取 `今日日记` 与 `评语` 回填到 `diaryModules`；`migrateSavePath()` 保留相对子目录；`getAllScores()` 对同日期重复文件去重。`npx tsc --noEmit`、`npm run build`、`node --check main.js`、目标文件 `git diff --check`、以及两条命令行 sanity check 均通过。待严格 review，未做 Obsidian 内手测，未同步 Vault，未 commit。
- 2026-05-12 23:55 +0800：按严格 review P1 修复 Round 2：`writeReport()` 覆盖前保留 boundary marker 后附录（`extractReportUserAppendix` 与 `rebuildReportIfExists` 共享）；`extractDiaryComment()` 在下一行首 `##` 前截断；`STATE.md` 的 `active-workspace` 改为 Vibe Coding 路径。`npx tsc --noEmit`、`npm run build`、`node --check main.js`、`git diff --check`、评语截断与附录拼接的 `node -e` sanity check 均通过。交回 review-ai。
- 2026-05-13 00:10 +0800：严格 re-review 通过，无阻塞问题。Review 复跑 `npx tsc --noEmit`、`npm run build`、`node --check main.js`、`git diff --check` 均通过。下一步等待用户明确授权同步 Vault 后做 Obsidian 手测；未同步 Vault，未 commit。
- 2026-05-13 +0800：用户授权同步 Vault 测试。从主工作区 `/Users/tins-macmini/Documents/AI Files/obsidian-little-milestones` 执行 `npx tsc --noEmit` 与 `npm run deploy` 至 `/Users/tins-macmini/Documents/Tins'Vault/.obsidian/plugins/little-milestones`；deploy 输出 `MATCH main.js 4cb8c8461ea6`、`MATCH styles.css c0f5c6ca1bf5`、`MATCH manifest.json 6774609a403b`；`shasum -a 256` 复核 workspace 与 Vault 三文件一致。未 commit。
- 2026-05-13 +0800：用户要求再次同步 Vault（得分页分界改为 Obsidian `%%` 注释块后）。同目录再次 `npx tsc --noEmit` 与 `npm run deploy`；`MATCH main.js ae78b082708d`、`MATCH styles.css c0f5c6ca1bf5`、`MATCH manifest.json 6774609a403b`；`shasum -a 256` 复核一致。未 commit。（**注意**：此为 Round 3 之前最后一次成功 deploy；Round 3 代码未再 deploy。）
- 2026-05-13 +0800：Round 3 实现（日记草稿按报告 `mtime` 失效、新 boundary 写入为 `[//]: # (lm-user-content-boundary)` 且读盘兼容旧 `%%`/HTML）。工作区 `npm run build`、`node --check main.js` 已通过；**未**同步 Vault、**未** commit。与 `.agents/STATE.md` / `.agents/LOCK.md` 一致，需用户显式授权后再 `npm run deploy`。
- 2026-05-13 +0800：用户明确授权「同步 vault」。从 `/Users/tins-macmini/Documents/AI Files/obsidian-little-milestones` 执行 `npm run deploy`（含内置 build）至 `/Users/tins-macmini/Documents/Tins'Vault/.obsidian/plugins/little-milestones`；deploy 输出 `MATCH main.js ad2abb97a034`、`MATCH styles.css c0f5c6ca1bf5`、`MATCH manifest.json 6774609a403b`；`shasum -a 256` 复核 workspace 与 Vault 三文件一致。未 commit。
- 2026-05-13 +0800：**Round 4 发布对齐**（review 发现 workspace `main.js` 与 Vault 不一致后）：再次从 AI Files 执行 `npm run deploy`；`MATCH main.js a38e296c035d`、`MATCH styles.css c0f5c6ca1bf5`、`MATCH manifest.json 6774609a403b`；`shasum -a 256` 复核 workspace/Vault 三文件一致（`main.js` 全量 `a38e296c035d3028f75d400414ceba8810848e0a984718bde1895766b3d53546`）。含 IME-aware 日记输入与「已打开 Markdown 缓冲优先」读回。未 commit。
- 2026-05-14 +0800：**Round 5 发布对齐**（review 发现 workspace 含 editor 扩展与新样式后 Vault 仍为 Round 4）：从 AI Files 执行 `npm run deploy`；`MATCH main.js 8e5b9ecc105b`、`MATCH styles.css 36ce04e433f5`、`MATCH manifest.json 6774609a403b`；`shasum -a 256` 复核 workspace/Vault 三文件一致。含评语换行保留、编辑视图隐藏 boundary 行。未 commit。

## Vault sync

- **目标目录**：`/Users/tins-macmini/Documents/Tins'Vault/.obsidian/plugins/little-milestones`
- **同步文件**：`main.js`、`styles.css`、`manifest.json`
- **来源工作区**：`/Users/tins-macmini/Documents/AI Files/obsidian-little-milestones`
- **当前状态**：**done**（workspace 与 Vault 三文件 SHA256 一致，Round 5 构建已写入 Vault）
- **最近一次 deploy 输出**：`MATCH main.js 8e5b9ecc105b`、`MATCH styles.css 36ce04e433f5`、`MATCH manifest.json 6774609a403b`
- **SHA256（workspace = vault）**：
  - `main.js`：`8e5b9ecc105b080749ad07a73dc6a90dfe79c5e2b50bcdce19fea5412aa5da94`
  - `styles.css`：`36ce04e433f50d736005cbf5480b33ad23d782f933b02acd9feb5a954897ba11`
  - `manifest.json`：`6774609a403bf1c5ce14dd0e6a0b7ed69d091aa27ea357fa9340346bfda81e63`

## Handoff

- `next-owner`: user
- `note`: Vault 已与当前 AI Files workspace（Round 5：`main.js` `8e5b9ecc…`、`styles.css` `36ce04e4…`）对齐；Obsidian 请重载插件后再验收评语换行、编辑视图 boundary 隐藏及既往项。无 commit 授权。

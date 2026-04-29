# Post-Vault 回归修复（待 Codex）

- **slug**: 2026-04-29-post-vault-regressions
- **created**: 2026-04-29
- **owner**: codex
- **status**: committed-awaiting-user-verification
- **origin**: 2026-04-29-split-commits-handoff
- **sync-to-vault**: completed; awaiting user retest
- **write-scope**: `src/renderers/report-sections.ts`, `src/diary/modules.ts` (or `src/modals/helpers/daily-modal-state.ts`/`src/modals/panels/diary-panel-fields.ts` depending fix path), `main.js`, `.agents/**`
- **read-scope**: `src/**`, `main.js`, `.agents/**`

## 用户反馈（Vault 实测）

1. 得分页的表格展示异常：只显示一个项目。  
2. 打分页日记内容重进编辑后清空；且提示词变成实际输入内容（原应作为灰色提示）。

## Cursor 根因定位

### 问题 1：得分页表格只显示一个项目

- 位置：`src/renderers/report-sections.ts` 的 `renderCategoryRows()`
- 原因：函数在输出表格行后，紧接着输出 `> [!quote]- 昨日...` 引用行。
- 结果：Markdown 表格被第一条非表格语法打断，后续项目无法继续作为同一张表渲染，表现为“只显示一个项”。

### 问题 2：日记重进后清空 + 提示词被当作内容

- 位置：
  - 写入：`src/diary/modules.ts` `composeDiaryContent()`
  - 回读：`src/diary/modules.ts` `parseDiaryModules()` + `readDiaryLine()`
  - 默认模板注入：`src/modals/panels/diary-panel-fields.ts` `ensureDefaultDiaryTemplate()`
- 原因：
  - `composeDiaryContent()` 对内置模块（天气/心情/今天做了/学会了/开心/想说）写入的是叙述句（如“今天的天气是...”），
  - 但 `parseDiaryModules()` 读取时按 `label + "："` 规则解析，无法从叙述句反推模块值；
  - 回读失败后模块值为空，`ensureDefaultDiaryTemplate()` 误判为“无内容”，把提示文案写成真实输入值。
- 结果：重开编辑时看起来“已写内容消失”，并出现“提示词变成实际内容”。

## 修复建议（最小改动优先）

1. **报表表格修复**  
   - 将“昨日分值提示”从 `renderCategoryRows()` 的表格字符串中移出；  
   - 可选做法：仅保留状态列（✅/🔴/🔵），不在表格内部插入 callout；或把昨日信息改成普通文本并放在表格块之后。

2. **日记读写对齐修复**（二选一，建议 A）
   - **A（推荐，最小风险）**：调整 `parseDiaryModules()`，支持解析当前叙述句格式（今天的天气是/我今天的心情是/...），实现与 `composeDiaryContent()` 对称。
   - **B**：调整 `composeDiaryContent()` 改回 `label：value` 可逆格式（注意评估对用户可读性与历史文件展示影响）。
   - 无论 A/B，需保证：已有历史文件能回读；回读成功时 `ensureDefaultDiaryTemplate()` 不应覆盖用户实际内容。

## 验收

- [x] 得分页每个分类表格可正确显示全部项目，不再被“昨日”行打断。
- [x] 重开任意已有记录的打分页，日记模块值与自由记录均能回填。
- [x] 提示词仅在真实空值时显示，不写入内容本体。
- [x] `npm run build`、`npx tsc --noEmit`、`node --check main.js` 通过。
- [ ] Vault 同步后用户复测通过。

## Codex 执行记录

- 2026-04-29 16:02 CST：Codex 接手修复，锁定 `src/renderers/report-sections.ts`、`src/diary/modules.ts`、`main.js`、`.agents/**`。
- 2026-04-29 14:18 CST：Codex 完成修复：`renderCategoryRows()` 移除表格内昨日引用行；`parseDiaryModules()` 兼容叙述句日记格式并保留 `标签：值` 旧格式；`npx tsc --noEmit`、`npm run build`、`node --check main.js` 通过。等待 Cursor round review；未 commit，未同步 Vault。
- 2026-04-29：Cursor 完成 round review（本地 build + typecheck + main.js check 通过），进入用户 Vault 最终回归验证阶段。
- 2026-04-29 14:25 CST：用户明确要求同步到 Vault 以便测试；Codex 执行 `npm run deploy`，build 成功并同步 `main.js`、`styles.css`、`manifest.json`；校验结果：`MATCH main.js 6d81dd41954f`、`MATCH styles.css db81e41e0927`、`MATCH manifest.json e82c7257a300`。等待用户 Vault 复测；未 commit。
- 2026-04-29 14:28 CST：用户明确要求“提交代码”；Codex 准备提交 post-Vault 回归修复与 `.agents` 记录。

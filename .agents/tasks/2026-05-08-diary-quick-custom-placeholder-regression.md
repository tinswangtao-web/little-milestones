# 天气/心情自定义输入草稿与 placeholder 回归修复

- **slug**: 2026-05-08-diary-quick-custom-placeholder-regression
- **created**: 2026-05-08
- **owner**: codex
- **status**: user-accepted-awaiting-commit-approval
- **origin**: 用户 Vault 实测反馈：天气/心情自定义输入不留存，提示文字仍会变成已输入内容
- **sync-to-vault**: done
- **write-scope**: `src/modals/panels/diary-panel-fields.ts`, `src/modals/panels/diary-panel.ts`, `src/modals/daily-scoring-modal.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `main.js`, `.agents/**`

## 用户问题

1. “今日天气/今日心情”的自定义输入框文字无法留存，其他输入框正常。
2. 输入框提示文字仍会变成已输入内容；应保持 placeholder 灰字语义。

## 修复记录

- 2026-05-08 11:25 +0800：Codex 接手新回归任务，按新任务卡处理，不混入上一轮日记草稿任务。
- 在 `DailyScoringModal` 的草稿状态中新增 `uiDrafts.quickCustomInputs`，按模块 id 保存天气/心情自定义输入框的未添加文本。
- `buildDiaryPanel()` 向天气/心情 quick group 传入自定义输入草稿和更新回调。
- `createDiaryQuickGroup()` 渲染时恢复自定义输入框草稿；输入时只更新 UI 草稿，不写入正式 weather/mood 模块值；点击“添加”后才写入模块值并清空该 UI 草稿。
- `ensureDefaultDiaryTemplate()` 不再把天气/心情、多行模块示例、自由记录示例写入真实 value；空输入保持 placeholder 语义。
- 历史内置示例清洗逻辑仍保留在 `src/diary/modules.ts`，本轮未修改。

- 2026-05-08 11:40 +0800：用户要求同步到 Vault 验证；Codex 执行 `npm run deploy`，build 成功并同步 `main.js`、`styles.css`、`manifest.json`；同步后校验 `MATCH main.js 2fb37951b977`、`MATCH styles.css db81e41e0927`、`MATCH manifest.json e82c7257a300`。等待用户 Obsidian 内验证。

## 验收标准

- [x] 在天气/心情自定义输入框输入文本，不点保存，切到统计再回来，文本仍在。
- [x] 在天气/心情自定义输入框输入文本，不点保存，直接关闭（X/ESC/遮罩）再回同日，文本仍在。
- [x] 清空输入后，仅显示 placeholder 灰字，不出现提示词被当输入。
- [x] 保存后重开同日，内容与文件一致，旧草稿不覆盖。
- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `node --check main.js`

## 用户验收

- 2026-05-08 11:55 +0800：用户验收本轮修改："可以了。验收本轮修改。" 未授权 commit。

## 风险与回滚

- 风险：自定义输入框草稿只在当前 Obsidian 运行期内保留，不跨重启。
- 风险：取消默认示例 value 注入会改变新建空白日期的首屏体验，但这是为保证 placeholder/value 分离。
- 回滚：移除 `uiDrafts.quickCustomInputs` 及 quick custom draft 传递/恢复逻辑，并恢复 `ensureDefaultDiaryTemplate()` 的旧默认注入代码。

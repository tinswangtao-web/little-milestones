# 日记固定模块归一化兜底

- **slug**: 2026-05-11-diary-fixed-module-normalization
- **created**: 2026-05-11
- **owner**: code-ai
- **status**: implemented-awaiting-user-test
- **origin**: 用户反馈历史配置缺少 `weather` / `mood` 时，直接打开打分页不会补齐固定区块
- **sync-to-vault**: done
- **write-scope**: `src/settings/normalize-settings.ts`, `src/settings/diary-module-settings.ts`, `src/modals/panels/diary-panel.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `main.js`, `.agents/**`

## 目标

把“固定四大区块”的补齐与排序从设置页局部兜底前移到加载/归一化阶段，确保旧配置即使不先打开设置页，直接打开打分页也能看到天气和心情。

## 必须完成

- [x] 新增按 `id` 补齐并重排固定模块的共享 helper。
- [x] `normalizePluginSettings()` / 用户默认归一化阶段调用该 helper。
- [x] 设置页复用同一个 helper，不再复制固定模块补齐逻辑。
- [x] 打分页删除当前只补 `comment` 的临时兜底，改为调用共享 helper。
- [x] 保留自定义小记录内容、placeholder 和相对顺序。

## 验收

- [x] 旧配置缺少 `weather` 时，加载后恢复固定顺序。
- [x] 旧配置缺少 `mood` 时，加载后恢复固定顺序。
- [x] 旧配置缺少 `comment` 时，加载后恢复固定顺序。
- [x] 旧配置三者都缺时，加载后恢复固定顺序。
- [x] 自定义小记录内容、顺序、placeholder 不被误改。

## 验证

- [x] 构造缺少固定模块的旧用户配置，走 `normalizePluginSettings()` 后检查结果。
- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `node --check main.js`
- [x] 目标文件 `git diff --check`
- [x] `npm run deploy`
- [x] 同步后核对 Vault 中 `main.js`、`styles.css`、`manifest.json` 与主工作区哈希一致

## 风险与回滚

- 风险：涉及设置归一化和打分页模块渲染入口，属于数据形态兜底修复。
- 回滚：撤回共享 helper 调用点，恢复设置页和打分页原有局部兜底。

## 记录

- 2026-05-11 23:01 +0800：按用户反馈新建任务，准备把固定模块补齐前移到 normalize 阶段。
- 2026-05-11 23:12 +0800：实现完成：新增 `normalizeDiaryModules()`，按 id 补齐 `weather` / `mood` / `comment` 并固定顺序为 `weather -> mood -> smallRecords -> comment`；设置页与打分页均复用该 helper。构造 4 类旧配置验证通过；`npx tsc --noEmit`、`npm run build`、`node --check main.js`、目标文件 `git diff --check` 均通过。等待严格 review；未同步 Vault，未 commit。
- 2026-05-11 23:14 +0800：Review AI 复审通过，No blocking issues。确认固定模块补齐已前移到 `normalize` 层，设置页与打分页复用同一 helper。
- 2026-05-11 23:16 +0800：用户明确授权同步到 Vault 测试并收口本轮；执行 `npm run deploy` 同步到当前 Vault，`styles.css` / `manifest.json` 在 deploy 输出中 MATCH，`main.js` 额外用 `shasum` 复核与 Vault 一致。未 commit。

## Vault sync

- 2026-05-11 23:16 +0800：已同步到 `/Users/tins-macmini/Documents/Tins'Vault/.obsidian/plugins/little-milestones`；同步文件 `main.js`、`styles.css`、`manifest.json`；`npm run deploy` 输出 `MATCH main.js 3f00cd6cf399`、`MATCH styles.css c0f5c6ca1bf5`、`MATCH manifest.json 6774609a403b`；额外 `shasum` 复核三文件 workspace/Vault 一致。同步人：code-ai。

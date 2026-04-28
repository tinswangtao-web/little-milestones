# 保存后自动打开得分页（MD 文档）

- **slug**: 2026-04-28-open-md-after-save
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: done
- **commit**: `e6b3761`
- **write-scope**: `src/modals/daily-scoring-modal.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `.agents/**`

## 用户需求

- 在 `打分页` 点击保存后，自动跳转到生成的 Markdown 结果文档（得分页）。

## 实现思路

- 在 `DailyScoringModal` 的 `onSave` 成功后：
  - 先 close modal
  - 再通过 `plugin.filePath(dateStr)` 找到生成的 `TFile`
  - 调用 `workspace.getLeaf(true).openFile(file)` 打开该文件

## 验收

- [x] `npm run build` 通过
- [x] `manifest.json`、`main.js`、`styles.css` 已同步到 Vault
- [x] 同步后 Vault 副本与当前工作区一致
- [x] 用户在 Obsidian 点击保存后，自动打开当天的 MD 结果文档

## 记录

- 2026-04-28 17:54 CST：Codex 构建通过，Vault 同步完成，并用 `diff -q` 验证 `manifest.json`、`main.js`、`styles.css` 一致。
- 2026-04-28 17:58 CST：用户验证保存后已跳转到 `得分页`；未弹出确认框，用户确认可以接受。
- 2026-04-28 18:15 CST：已提交 `e6b3761`（`[codex] open generated result after saving`）。
- 2026-04-28 19:25 CST：commit hash 记录随 `.agents` 收尾提交同步。

# Task: 2026-05-11-add-export-command

## Context / User Request
- 增加 `export markdown` 命令
- 输入 CSV 文件，输出 Markdown 报告
- 先不要引入新依赖

## Phase（可选）

- `implement`

## Problem statement（可选）

- 当前工具只能打印摘要，用户无法直接把结构化数据导出为可分享的 Markdown 文档。

## Non-goals（可选）

- 不做 HTML / PDF 导出
- 不重构整个命令行框架

## Approach（方案 / 架构 / 技术路线，可选）

- 在现有 CLI 中增加 `export markdown` 子命令
- 复用已有 CSV 解析逻辑，新增一个纯函数生成 Markdown
- 增加 1 个集中的导出测试，覆盖标题、表格、空值处理

## Ownership
- `owner`: code-ai
- `status`: awaiting-review
- `write-scope`: `src/cli.ts`, `src/exporter.ts`, `tests/exporter.test.ts`, `.agents/**`
- `read-scope`: `src/**`, `tests/**`, `package.json`, `.agents/**`
- `awaiting`: review-ai
- `sync-or-deploy`: n/a

## Artifacts（可选）

- `docs/design/export-command.md`（若存在）
- `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`

## Plan
1. 给现有 CLI 增加 `export markdown` 子命令。
2. 复用 CSV 解析逻辑，输出 Markdown 文本。
3. 增加一个集中的导出测试，覆盖标题、表格与空值处理。

## Affected Files
- `src/cli.ts`
- `src/exporter.ts`
- `tests/exporter.test.ts`

## Acceptance criteria（验收标准，推荐）

- [x] 给定合法 CSV，执行 `export markdown` 后生成 Markdown 文件
- [x] 输出包含标题、摘要和明细表
- [x] 空值列不会输出为 `undefined`
- [x] 不新增第三方依赖

## Rollback（可选）

- 删除 `export markdown` 子命令入口
- 恢复旧的 CLI 帮助信息
- 删除对应测试

## Verification
- `pnpm typecheck`
- `pnpm test`
- 手工运行一次 `export markdown --input ./fixtures/demo.csv --output ./tmp/report.md`

## Acceptance Checklist
- [x] 行为符合需求
- [ ] Review 已完成或明确豁免
- [x] 如需部署/同步，已完成或 n/a

## Implementation Log
- [2026-05-11 code-ai] 创建任务卡，按“最小实现 + 最小测试”推进。
- [2026-05-11 code-ai] 完成实现与测试，进入 `awaiting-review`。

## Handoff
- `next-owner`: review-ai
- `note`: 重点检查 CLI 子命令入口、Markdown 输出格式，以及空值列是否仍会泄露为 `undefined`。

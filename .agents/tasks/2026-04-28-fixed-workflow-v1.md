# Little Milestones 固化工作模式 v1

- **slug**: 2026-04-28-fixed-workflow-v1
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: n/a
- **write-scope**: `AGENTS.md`, `.agents/README.md`, `.agents/AGENT_RULES.md`, `.agents/**`
- **read-scope**: `AGENTS.md`, `.agents/**`
- **origin**: user-provided workflow v1

## 用户需求

- 固化 Little Milestones 的长期维护模式：
  - 用户提需求、反馈体验、做最终确认。
  - Codex 是唯一实现者，负责代码、build、修复、commit、Vault sync。
  - Cursor 只 review，不改业务代码。
  - 每个需求走：用户提需求 -> Codex 实现 -> Cursor review -> Codex 修订 -> 用户验收 -> 用户明确同意后才 commit/deploy。
  - 每轮面向非技术用户输出四句话：当前状态、风险判断、用户动作、通过标准。

## 验收

- [x] `.agents/README.md` 写入固定流程、强制 review/deploy/commit 规则、严审触发场景。
- [x] `.agents/AGENT_RULES.md` 写入可复制给 Cursor 的 review 输入/输出模板。
- [x] `.agents/reviews/CURSOR_REVIEW_TEMPLATE.md` 固化 Cursor Review 输出模板。
- [x] `.agents/reviews/CODEX_PRECOMMIT_CHECKLIST.md` 固化 Codex 提交/同步前自检模板。
- [x] `AGENTS.md` 写入 Codex 每轮对用户的沟通协议和 commit/deploy 门禁。
- [x] `.agents/STATE.md` / `.agents/log.md` 记录本次固化。
- [x] 本轮不创建 git commit，除非用户明确要求提交。

## 记录

- 2026-04-28 19:36 CST：将用户提供的固定工作模式 v1 写入 `.agents/README.md`、`.agents/AGENT_RULES.md`、`AGENTS.md`；未创建 commit。
- 2026-04-28 19:42 CST：新增 `.agents/reviews/CURSOR_REVIEW_TEMPLATE.md`，作为 Cursor 固定 review 输出模板；未创建 commit。
- 2026-04-28 19:47 CST：新增 `.agents/reviews/CODEX_PRECOMMIT_CHECKLIST.md`，作为 Codex 提交/同步前固定自检模板；未创建 commit。

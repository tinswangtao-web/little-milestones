# Little Milestones 固化工作模式 v1

- **slug**: 2026-04-28-fixed-workflow-v1
- **owner**: 代码 AI（角色名，非具体模型）
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: n/a
- **write-scope**: `AGENTS.md`, `.agents/README.md`, `.agents/AGENT_RULES.md`, `.agents/**`
- **read-scope**: `AGENTS.md`, `.agents/**`
- **origin**: user-provided workflow v1

## 用户需求

- 固化 Little Milestones 的长期维护模式：
  - 用户提需求、反馈体验、做最终确认。
  - **代码 AI** 是默认实现者，负责代码、build、修复、commit、Vault sync。
  - **Review AI** 只 review，不改业务代码。
  - 每个需求走：用户提需求 -> **代码 AI** 实现 -> **Review AI** review -> **代码 AI** 修订 -> 用户验收 -> 用户明确同意后才 commit/deploy。
  - 每轮面向非技术用户输出四句话：当前状态、风险判断、用户动作、通过标准。

## 验收

- [x] `.agents/README.md` 写入固定流程、强制 review/deploy/commit 规则、严审触发场景。
- [x] `.agents/AGENT_RULES.md` 写入可复制给 **Review AI** 的 review 输入/输出模板。
- [x] `.agents/reviews/REVIEW_OUTPUT_TEMPLATE.md` 固化 Review 输出模板。
- [x] `.agents/reviews/PRECOMMIT_CHECKLIST.md` 固化提交/同步前自检模板。
- [x] `AGENTS.md` 写入 **代码 AI** 每轮对用户的沟通协议和 commit/deploy 门禁。
- [x] `.agents/STATE.md` / `.agents/log.md` 记录本次固化。
- [x] 本轮不创建 git commit，除非用户明确要求提交。

## 记录

- 2026-04-28 19:36 CST：将用户提供的固定工作模式 v1 写入 `.agents/README.md`、`.agents/AGENT_RULES.md`、`AGENTS.md`；未创建 commit。
- 2026-04-28 19:42 CST：新增 review 输出模板文件；未创建 commit。
- 2026-04-28 19:47 CST：新增提交前自检清单文件；未创建 commit。
- 2026-05-11：协议去产品化：角色统称 **代码 AI** / **Review AI**；固定文件名见当前 `.agents/reviews/` 下 `IMPLEMENTATION_REVIEW_HANDOFF.md`、`PRECOMMIT_CHECKLIST.md`、`REVIEW_OUTPUT_TEMPLATE.md`。

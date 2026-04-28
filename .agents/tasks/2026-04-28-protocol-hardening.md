# 协议硬化与行尾治理

- **slug**: 2026-04-28-protocol-hardening
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: n/a
- **write-scope**: `.agents/**`, `AGENTS.md`, `.gitattributes`
- **read-scope**: `.agents/**`, `AGENTS.md`, `.gitattributes`
- **origin**: from `2026-04-28-codex-cursor-workflow`

## 用户需求

- 根据 Cursor review 建议推进流程硬化：
  - 无用户明确要求不提交。
  - 需求变化必须新建任务卡。
  - 实验性 UX 改动必须写 rollback 方法。
  - 出现超大样式 diff 时先检查 EOL。
  - 增加基础 `.gitattributes` 行尾策略。

## 验收

- [x] `AGENTS.md` 与 `.agents/AGENT_RULES.md` 都写入“无明确要求不提交”硬规则和示例。
- [x] `AGENTS.md` 与 `.agents/AGENT_RULES.md` 都写入“需求变化必须新任务卡”规则。
- [x] `AGENTS.md` 与 `.agents/AGENT_RULES.md` 都写入“实验功能可回滚”规则。
- [x] `.agents/AGENT_RULES.md` 的 Cursor copy block 可直接复制给 Cursor 使用。
- [x] `.gitattributes` 增加 CSS/TS/MD 的 LF 策略。
- [x] 协议说明出现超大样式 diff 时先检查 EOL。
- [x] 本轮不创建 git commit，除非用户明确要求提交。

## 记录

- 2026-04-28 18:37 CST：新增 `.gitattributes`，更新 `AGENTS.md`、`.agents/AGENT_RULES.md`、`.agents/README.md`，写入提交门禁、任务拆分、实验 rollback 和 EOL 检查规则；未创建 commit。

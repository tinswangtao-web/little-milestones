# Review AI 修复指令输出固化

- **slug**: 2026-05-11-review-followup-instruction-rule
- **created**: 2026-05-11
- **owner**: review-ai
- **status**: done
- **origin**: 用户要求把以下规则写死：以后不管谁担任 Review AI，review 完之后都必须产出一段可以直接发送给 code-ai 的修复指令；若没有明确修复项，则至少产出一段下一步建议。
- **sync-to-vault**: n/a
- **write-scope**: `AGENTS.md`, `.agents/README.md`, `.agents/AGENT_RULES.md`, `.agents/reviews/REVIEW_OUTPUT_TEMPLATE.md`, `.agents/tasks/2026-05-11-review-followup-instruction-rule.md`, `.agents/log.md`
- **read-scope**: `AGENTS.md`, `.agents/**`

## 目标

把“Review AI 在 review 后必须给出可直接发给 code-ai 的下一步指令或下一步建议”写入本仓库的固定协作规则与固定审查模板。

## 必须完成

- [x] 在根规则入口 `AGENTS.md` 中固化该要求。
- [x] 在完整协议 `.agents/README.md` 中固化该要求。
- [x] 在简明规则 `.agents/AGENT_RULES.md` 中固化该要求。
- [x] 提供固定模板 `.agents/reviews/REVIEW_OUTPUT_TEMPLATE.md`，明确包含“给 code-ai 的可直接转发指令 / 下一步建议”区块。

## 记录

- 2026-05-11 23:51 +0800：用户明确要求把 review 后必须产出“可直接发送给 code-ai 的指令，或至少下一步建议”的规则写死。
- 2026-05-11 23:51 +0800：Review AI 完成协议文件与审查模板更新；不涉及业务代码、Vault sync、commit。

## Handoff

- `next-owner`: none
- `note`: 后续任何 Review AI 审查结束后，必须按新规则产出一段可直接发给 code-ai 的修复指令；若结论为无阻塞问题，则至少给出一段下一步建议/测试建议。

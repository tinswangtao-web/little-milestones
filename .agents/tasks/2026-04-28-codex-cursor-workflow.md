# Codex 实现 + Cursor Review 工作流

- **slug**: 2026-04-28-codex-cursor-workflow
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: n/a
- **write-scope**: `.agents/**`, `AGENTS.md`
- **read-scope**: `.agents/**`, `AGENTS.md`

## 用户需求

- 将后续维护模式调整为：
  - Codex 默认写代码、构建、同步、提交、集成。
  - Cursor 默认 review Codex 的提交或工作区 diff。
  - ChatGPT 只做产品建议、体验建议和工作流建议，不直接进入代码协作链。

## 验收

- [x] `.agents/README.md` 更新主工作流和角色说明
- [x] `.agents/AGENT_RULES.md` 更新短规则和 Cursor review 指令
- [x] `AGENTS.md` 更新 Codex 启动说明中的外部 agent 期望
- [x] `.agents/STATE.md` / `.agents/log.md` 记录本次协议调整

## 记录

- 2026-04-28 18:22 CST：Codex 将协作协议调整为 Codex 默认实现/集成、Cursor 默认 review、ChatGPT advisory-only；未改插件代码。

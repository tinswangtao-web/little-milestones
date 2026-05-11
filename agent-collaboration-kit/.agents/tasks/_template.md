# Task: <slug>

## Context / User Request
- 用自然语言描述用户需求或问题。

## Phase（可选）

- `discovery` | `design` | `implement` | `review` | `ship`
- 小任务可写：`轻量，无独立 design 阶段`

## Problem statement（可选）

- 要解决的具体问题（一句话 + 背景）

## Non-goals（可选）

- 明确**不做**的范围，避免范围蔓延

## Approach（方案 / 架构 / 技术路线，可选）

- 备选方案与**取舍**（可链接到 `docs/design/...`）
- 影响模块与接口（若有）

## Ownership
- `owner`: <code-ai | review-ai | none>
- `status`: <planned | in-progress | awaiting-review | awaiting-fix | awaiting-deploy | done>
- `write-scope`: <文件或 glob>
- `read-scope`: <可选>
- `sync-or-deploy`: <pending | done | n/a>（若项目无此步骤，填 n/a）

## Artifacts（可选）

- 设计/调研产出路径：例 `docs/design/<topic>.md`

## Plan
1. …
2. …

## Affected Files
- …

## Acceptance criteria（验收标准，推荐）

- [ ] …
- [ ] …

## Rollback（可选）

- 实验性改动：如何在一轮内收回（分支、开关、回滚命令）

## Verification
- 本地构建/测试命令（见 `PROJECT_PROFILE.md`）
- 手工验收步骤

## Acceptance Checklist
- [ ] 行为符合需求
- [ ] Review 已完成或明确豁免
- [ ] 如需部署/同步，已完成或 n/a

## Implementation Log
- [YYYY-MM-DD code-ai] …

## Handoff
- `next-owner`: <review-ai | code-ai | none>
- `note`: …

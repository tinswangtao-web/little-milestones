# Agent Collaboration Kit Polish

- **slug**: 2026-05-11-agent-collaboration-kit-polish
- **owner**: none
- **created**: 2026-05-11
- **status**: committing
- **sync-to-vault**: n/a
- **write-scope**: `agent-collaboration-kit/**`, `AGENTS.md`, `.gitignore`, `.agents/STATE.md`, `.agents/LOCK.md`, `.agents/log.md`
- **read-scope**: `agent-collaboration-kit/**`, `AGENTS.md`, `.gitignore`, `.agents/**`
- **origin**: user follow-up on reusable collaboration kit

## 用户需求

- 在另一位 AI 已给出建议并修改后，再收一版 `agent-collaboration-kit`。
- 本轮重点补强：
  - 角色定义与任务模板一致
  - 删除备份规则对新项目真正“复制即用”
  - 非 Cursor 场景的使用提示
  - `AGENTS.md` 对新增专题文档的入口更完整

## 本轮计划

1. 统一 `ROLES.md` 与 `.agents/tasks/_template.md` 的 owner / next-owner 口径。
2. 在 `README.md` 中把 `.ai-deletion-backups/` 的 `.gitignore` 配置写成接入步骤。
3. 在 `AGENTS.md` 中补 `ARCHITECTURE_GUIDE.md`、`QUALITY_STANDARDS.md` 入口，并补非 Cursor 使用提示。
4. 顺手把 `PROJECT_PROFILE.template.md` 里删除备份的占位句改成完整可填写格式。
5. 新增 `QUICKSTART.md`，把“复制之后怎么开始第一轮协作”写成一屏式指引。
6. 新增 `examples/minimal-project/`，给出项目档案、任务卡、交接卡、review 输出的填好样例。
7. 根据 review 收口：让 example 任务卡对齐模板、补齐 `PROJECT_PROFILE.md` fallback stub、修正坏链接、统一文档角色命名。
8. 继续补最后一层：统一 `STATE.md`、任务卡模板、流程文档与 example 中的状态字段与状态枚举。
9. 再收 onboarding：首次接入也走协议（任务卡 + 锁），并统一 `template` / `fallback stub` 的职责。
10. 根据用户确认继续收口：将首次接入的“自动完成/自动生成”口径改为“AI 引导 + 用户确认后写入”，并明确包内 `.agents` 与仓库根 `PROJECT_PROFILE.md` 的边界。

## 影响文件

- `agent-collaboration-kit/README.md`
- `agent-collaboration-kit/AGENTS.md`
- `agent-collaboration-kit/ROLES.md`
- `agent-collaboration-kit/PROJECT_PROFILE.template.md`
- `agent-collaboration-kit/.agents/tasks/_template.md`
- `agent-collaboration-kit/.agents/README.md`
- `agent-collaboration-kit/.agents/AGENT_RULES.md`
- `agent-collaboration-kit/.agents/STATE.md`
- `agent-collaboration-kit/.agents/LOCK.md`
- `agent-collaboration-kit/.agents/log.md`
- `agent-collaboration-kit/QUICKSTART.md`
- `agent-collaboration-kit/examples/minimal-project/**`
- `agent-collaboration-kit/gitignore.snippet`
- `agent-collaboration-kit/PROJECT_PROFILE.md`
- `.agents/STATE.md`
- `.agents/LOCK.md`
- `.agents/log.md`

## 验收

- [x] `docs-ai` 等文档角色不再与任务模板冲突。
- [x] 新项目复制规则包后，能直接看到 `.gitignore` 需要补的备份忽略项。
- [x] `AGENTS.md` 中明确列出架构与质量文档入口，并给非 Cursor 使用方式。
- [x] 任务卡与项目档案模板文案完整、无半句占位。
- [x] 简明规则、完整协议、状态模板、锁模板对 `docs-ai` 与删除备份规则的口径一致。
- [x] 新人复制规则包后，可直接通过 `QUICKSTART.md` 完成第一次接入。
- [x] 新人可通过最小样例看懂 `PROJECT_PROFILE.md`、任务卡、交接卡、review 输出分别怎么写。
- [x] `examples/minimal-project/` 的任务卡结构与当前 `_template.md` 一致，不再保留旧格式示例。
- [x] `PROJECT_PROFILE` 的读取说明与仓库内实际文件结构一致，不再出现悬空 fallback 或断链。
- [x] 文档角色命名在 `ROLES.md`、模板、README 中统一。
- [x] `STATE.md` 与任务卡模板使用一套清晰、可解释的状态集合。
- [x] `WORKFLOW.md`、`.agents/README.md` 与 example 对状态流转的说明一致。
- [x] 首次接入引导本身也遵守 `.agents` 协议，不再绕过任务卡和写锁。
- [x] `PROJECT_PROFILE.template.md` 成为唯一 onboarding 问答源，`PROJECT_PROFILE.md` fallback stub 仅作说明/引用，不再与模板打架。
- [x] 首次接入不再承诺自动写根目录文件；AI 需先列出拟写内容与写入路径，经用户确认后再写入。
- [x] 文档中明确运行时状态在 `agent-collaboration-kit/.agents/`，项目专属档案在仓库根 `PROJECT_PROFILE.md`。

## 记录

- 2026-05-11 14:20 +0800：按用户要求继续打磨 `agent-collaboration-kit`，本轮聚焦规则自洽与可落地性；不涉及插件业务代码与 Vault。
- 2026-05-11 14:24 +0800：已补齐 4 个 review 点：任务模板允许 `docs-ai`；新增 `gitignore.snippet` 并在 README 写明 `.ai-deletion-backups/` 接入步骤；`AGENTS.md` 补充 `ARCHITECTURE_GUIDE.md` 与 `QUALITY_STANDARDS.md` 入口及非 Cursor 使用说明；`PROJECT_PROFILE.template.md` 完整化删除备份字段。
- 2026-05-11 14:39 +0800：继续收口：`.agents/README.md` 增加对 `ARCHITECTURE_GUIDE.md` / `QUALITY_STANDARDS.md` / `BACKUP_AND_DELETION.md` 的摘要入口；`.agents/AGENT_RULES.md` 与 `AGENTS.md` 补 `docs-ai` 与删除备份口径；`.agents/STATE.md` / `LOCK.md` / `log.md` 模板补齐多角色示例。
- 2026-05-11 14:46 +0800：继续完善“复制即用”体验：新增 `QUICKSTART.md` 与 `examples/minimal-project/`，并将其接入套件 `README.md`；同步更新实现交接卡，便于后续直接发起 review。
- 2026-05-11 16:35 +0800：根据最新 review 继续收口，聚焦 4 点：example 任务卡与模板一致、`PROJECT_PROFILE` fallback 与文档一致、修正包内坏链接、统一文档角色命名。
- 2026-05-11 16:52 +0800：本轮收口完成：已新增包内 `PROJECT_PROFILE.md` fallback stub，修正 `PROJECT_PROFILE.template.md` 链接，example 任务卡改成当前模板结构，并统一 `文档 / Prompt AI` 命名。
- 2026-05-11 17:08 +0800：继续补最后一层，聚焦状态契约：统一 `STATE.md`、任务卡模板、流程文档和 example 的状态字段与流转说明。
- 2026-05-11 17:18 +0800：状态契约收口完成：`status` 与 `awaiting` 已拆分职责，`STATE.md`、任务卡模板、`.agents/README.md`、`WORKFLOW.md` 与 example 使用同一套推荐状态。
- 2026-05-11 19:24 +0800：根据最新 review 继续收口 onboarding：让首次接入也走任务卡/锁流程，并把 `PROJECT_PROFILE.template.md` 与 `PROJECT_PROFILE.md` fallback stub 的职责拆清。
- 2026-05-11 19:33 +0800：onboarding 收口完成：`AGENTS.md` 现要求首次接入也先开 onboarding 任务卡并占锁；`PROJECT_PROFILE.template.md` 成为唯一问答源；`PROJECT_PROFILE.md` 仅作 reference-only fallback stub；`README.md` 与 `QUICKSTART.md` 已统一到同一路径。
- 2026-05-11 20:51 +0800：按用户确认继续执行建议：把首次接入文案从“自动生成/自动完成”收为“AI 引导、展示草案与写入范围、用户确认后写入”；同时明确包内 `agent-collaboration-kit/.agents/` 与仓库根 `PROJECT_PROFILE.md` 的职责边界。
- 2026-05-11 22:32 +0800：用户要求继续第六步。Codex 确认当前只剩本规则包文档 dirty；旧自动写入口径 `rg` 检查无命中，目标文件 `git diff --check` 通过。用户先前已验收，但本组尚无明确 commit 授权。
- 2026-05-11 22:35 +0800：用户明确授权“提交第 4 组”。Codex 准备选择性提交本规则包文档与对应协议记录；不需要 Vault sync，不 push。

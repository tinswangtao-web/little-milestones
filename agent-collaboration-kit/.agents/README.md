# Agent Collaboration Protocol

本仓库用基于文件的交接协议，让**代码 AI**、**Review AI** 与可选的**顾问类 AI** 通过共享文件协作。不绑定具体模型或产品名称。

**`PROJECT_PROFILE.md`**：优先读 **Git 仓库根目录**下的该文件；若无，再读与协作包内 **`AGENTS.md` 同目录**下的该文件。其中写明源码路径、部署、领域词汇等。

## 全流程与阶段闸门（摘要）

- **需求 → 方案 → 任务卡 → 实现 → 审查 → 验收/发布**：详见与同目录 `AGENTS.md` 平级的 [WORKFLOW.md](../WORKFLOW.md)。小任务可在任务卡注明跳过独立设计阶段；触及存储/安全/严审条件时不得跳过方案记录。
- **角色分工与 STATE 字段**：见 [ROLES.md](../ROLES.md)。
- **顾问类 AI**（产品/架构/UX）的产出须**先写入任务卡或设计文档**，再进入编码；避免未记录的口头方案直接改仓库。
- **通用工程注意**（安全、依赖、兼容等）：见 [ENGINEERING_NOTES.md](../ENGINEERING_NOTES.md)。

## 角色划分

- **代码 AI**：默认实现与集成（改源码、构建、测试、按授权的部署与提交）。
- **Review AI**：默认可审不可改业务代码；审查 **代码 AI** 的 commit 或工作区 diff；除用户明确授权外不直接改业务代码。
- **顾问类 AI**：仅建议；须先落成 `.agents` 任务卡再进入编码。
- 任何**非代码 AI**要改业务代码，必须经用户明确授权，并在 `.agents/STATE.md` 记录 `owner` 与 `write-scope`。

## 目标

- 任务状态只有一处权威来源；避免静默互相覆盖；过程可追溯；不依赖外部服务。

## 核心规则

- 用 `git` 与 `.agents/` 作为协作层。
- 当前任务在 `.agents/STATE.md` 中必须有清晰归属。
- 写权限由 `.agents/LOCK.md` 控制；同一范围互斥。
- 仅当 `write-scope` 不重叠且不依赖未完成修改时允许并行。
- 重要动作须更新 `STATE.md` 并在 `log.md` 追加一行。
- 除非用户明确「commit」「提交」或同等授权，否则不创建 git commit。
- 「推进」「继续」「修一下」等单独出现不构成提交授权。

## 默认维护流程（与阶段模型配合）

阶段划分、何时可跳过设计、文档/Prompt 任务等见 [WORKFLOW.md](../WORKFLOW.md)。日常执行顺序可简化为：

1. 用户描述期望行为 → 任务卡与设计记录（按需）。
2. **代码 AI** 实现与自测 → 更新 `.agents` 与交接卡。
3. **Review AI** 审查 → **代码 AI** 修订。
4. 用户验收 → 用户明确授权后 **代码 AI** 才 commit 或 deploy。

**Review AI** 提示模板示例：

> 审查最新由**代码 AI**产生的 commit 或当前工作区 diff。只报告明确缺陷、回归、遗漏需求或验证缺口。正常审查不要求重构、不要求直接改代码。

## 固定工作流 V1（操作约定）

- 用户拥有需求、体验反馈、最终验收与 commit/deploy 决策权。
- **代码 AI** 是唯一常规业务代码修改方。
- **Review AI** 给出结论、风险、建议修复与验收步骤。
- 需求按序（与 WORKFLOW 各阶段对齐）：用户目标 → 实现与自测 → **Review AI** 审查 → **代码 AI** 修订 → 用户接受/拒绝 → 用户明确批准后 **代码 AI** 才 commit 或 deploy。
- **代码 AI** 每轮对用户：当前状态、风险、建议测试动作、通过条件。
- **代码 AI** 每轮为 **Review AI**：需求目标、改动列表、用户可见变化、已做验证、已知风险。
- 每轮维护 `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`，包含：用户原话目标、改动文件、用户可见变化、验证、风险、是否严审、2～4 条验收步骤。
- 交接卡就绪后，**代码 AI** 只对用户说「可 review」。
- commit/发布前处理 `.agents/reviews/PRECOMMIT_CHECKLIST.md`。
- **Review AI** 使用 `.agents/reviews/REVIEW_OUTPUT_TEMPLATE.md`；无阻塞写 **No blocking issues**。

## 严审（commit 前建议强制 Review AI）

默认触发条件与「禁止跳过方案」的情形见 [WORKFLOW.md](../WORKFLOW.md) 阶段 2；**项目追加条款**写在 `PROJECT_PROFILE.md`。此处不重复列举，避免与 WORKFLOW 双处维护。

## 必备文件

- `.agents/STATE.md`、`LOCK.md`、`tasks/*.md`、`reviews/*.md`、`log.md`

## 任务拆分

- 功能、页面、流程或验收标准变化 → 新建 `.agents/tasks/*.md`。

## 工作区

- **主工作区**为权威；默认不用 worktree 做常规实现；**Review AI** 针对主工作区审查。

## 固定开场 / 收场

**开场**：`git status --short` → [WORKFLOW.md](../WORKFLOW.md) / [ROLES.md](../ROLES.md)（新任务或首轮）→ `.agents/README.md` → `PROJECT_PROFILE.md`（若有）→ `STATE.md` → 当前任务卡 → `LOCK.md`。

**收场**：再 `git status --short` → 更新 `STATE.md`、`LOCK.md` → `log.md` 追加 → 更新任务卡与 `reviews/`。

## 加锁与范围

- 仅锁持有者可改 `write-scope` 内文件；审查默认写入 `.agents/reviews/**`。
- 默认业务代码 `write-scope`：**代码 AI**。
- **Review AI** 默认：`read-scope` + `.agents/reviews/**`。

## 源码与产物

- 以 `PROJECT_PROFILE.md` 为准：主源码目录、生成物、是否禁止手改、构建命令。
- 生成物与源码须同轮一致；异常巨大 diff 先查换行（`git ls-files --eol`）。

## 实验性改动

- 须易回滚；发布/同步前任务卡须有回滚说明。

## 部署或同步到运行环境

- **不是**实现的隐含步骤；须用户明确授权。
- 具体命令、路径、校验方式写在 `PROJECT_PROFILE.md`。
- 任务卡可跟踪：`sync-or-deploy: pending | done | n/a`。

## Git

- 勿并行 `git add`、`git status`、`git commit`；先 stage 再确认再 commit。
- 含生成文件的 commit 须包含对应源文件。

## 提交前缀

- `[code-ai]`：常规实现
- `[review-ai]`：审查输出、文档等

## 实用说明

工作区不必始终干净；`git status` 用于暴露状态，而非阻塞一切工作。

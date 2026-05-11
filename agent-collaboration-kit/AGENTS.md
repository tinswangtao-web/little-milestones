# 代码 AI 进入本仓库时的启动规则

本仓库使用 **与本 `AGENTS.md` 同目录**下的 `.agents/` 协作协议。角色名称与具体模型、厂商无关：**代码 AI**（实现）、**Review AI**（审查）、可选 **顾问类 AI**（仅建议）。

> **整夹复制**：若本文件位于子目录（例如 `agent-collaboration-kit/AGENTS.md`），下面所有 `.agents/...` 路径均指该子目录内的 `.agents/`，无需再拷到仓库根。

**专题文档（与同目录 `AGENTS.md` 同级）**

- [WORKFLOW.md](WORKFLOW.md)：从需求澄清到发布的阶段与闸门  
- [ROLES.md](ROLES.md)：多 AI 角色与 `STATE.md` 字段建议  
- [ENGINEERING_NOTES.md](ENGINEERING_NOTES.md)：通用工程与安全注意项  
- [META_FOR_REVIEWERS.md](META_FOR_REVIEWERS.md)：给其他 AI 改进本规则时的约定

**`PROJECT_PROFILE.md`（项目专属）** 阅读顺序：

1. **Git 仓库根目录**下的 `PROJECT_PROFILE.md`（推荐把模板复制到根目录后填写）
2. 若不存在，再读 **与本 `AGENTS.md` 同目录**下的 `PROJECT_PROFILE.md`

## 进入后必做顺序

每次**代码 AI**进入本仓库时，先完成：

1. 在 **Git 仓库根**运行 `git status --short`（工作区以仓库根为准）
2. 阅读 **与本文件同目录的** [WORKFLOW.md](WORKFLOW.md) 与 [ROLES.md](ROLES.md)（首轮或新任务开始时；日常小改可只复习 `.agents/README.md` 中的阶段摘要）
3. 阅读 **与本文件同目录的** `.agents/README.md`
4. 按上文顺序阅读 `PROJECT_PROFILE.md`（若任一处存在）
5. 实现与审查阶段对照 [ENGINEERING_NOTES.md](ENGINEERING_NOTES.md)（尤其安全、迁移、依赖）
6. 阅读 `.agents/STATE.md`
7. 阅读 `STATE.md` 指向的当前任务文件
8. 阅读 `.agents/LOCK.md`

## 工作规则（摘要）

- 不得在声明的 `write-scope` 之外改文件；写入前在 `.agents/LOCK.md` 取得写锁。
- 若 `STATE.md` 正在等待其他角色且当前会话不是目标方，保持只读，除非用户明确要求协助。
- 仅当 `write-scope` 不重叠且不依赖他方未完成修改时，才允许并行工作。
- 除非用户明确使用「commit」「提交」或同等授权，否则不要创建 git commit。
- 「推进」「继续」「修一下」「整理一下」「验证一下」等单独出现**不构成**提交授权；**部署/同步到运行环境**亦同，须用户明确授权（见 `PROJECT_PROFILE.md`）。
- 紧急回滚或热修 commit 仍需用户明确授权，且授权原文须记入 `.agents/STATE.md`。
- 用户需求在功能、页面、流程或验收标准上变化时，新建 `.agents/tasks/*.md` 任务卡，勿混在旧任务里。
- 实验性改动在发布或同步前，任务卡里须有回滚说明。
- 每轮对用户可见的进展应包含：**当前状态、风险判断、建议用户如何测、通过条件**。
- 常规功能流程：**用户目标 → 代码 AI 最小实现 → Review AI 审查 → 代码 AI 按反馈修订 → 用户验收 → 用户明确批准后再 commit/deploy**。
- 请 **Review AI** 审查前，须给出：需求目标、改动文件列表、用户可见行为变化、已做验证、已知未决风险。
- 每轮实现结束后，更新 `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`（交接卡）。须包含：用户原话目标、改动文件、用户可见变化、验证情况、风险与开放点、是否要求严格 review、2～4 条用户验收步骤。
- 交接卡就绪后，对用户只说「可 review」；勿要求用户向 **Review AI** 粘贴大段代码、整份 diff 或截图。
- 最终 commit 或发布前，填写或摘要 `.agents/reviews/PRECOMMIT_CHECKLIST.md`。
- **严审**：见 `.agents/README.md` 与 `PROJECT_PROFILE.md`（存储/迁移/安全/关键 UX、或跨多文件等）。

## 角色与归属

- **代码 AI**：默认实现方（改代码、构建、按授权的部署与提交）。
- **Review AI**：默认可审不可改业务代码；审查 **代码 AI** 的 commit 或工作区 diff，除非用户在本线程明确授权例外且已写入 `STATE.md`。
- **顾问类 AI**：仅产品/流程/UX 建议；须先落成 `.agents` 任务卡再动代码。
- 任何非**代码 AI**要改业务代码，须用户明确授权，并在 `.agents/STATE.md` 记录 `owner` 与 `write-scope` 后方可开始。

## 工作区规则

- 仅以**主工作区**为常规开发目录；**Review AI** 针对主工作区审查。
- 默认不把额外 git worktree 纳入常规流程；若使用须在 `STATE.md` 记录例外。

## 交接必更新

**代码 AI**每完成一轮应：更新 `STATE.md`、`LOCK.md`，在 `log.md` 追加一行，更新活跃任务卡；若做了 review，在 `.agents/reviews/` 新增或更新文件。

## 提交信息前缀

- **代码 AI**：`[code-ai]`
- **Review AI**（审查/文档类 commit）：`[review-ai]`

## 对外部审查输入的期望

- **Review AI** 输出：可发布 / 需修复 / 建议回滚；P0/P1/P2；风险；修复顺序；最小复测；无阻塞时写明 **No blocking issues**。
- **顾问类 AI**：仅作参考，不当作可直接照抄的实现指令。

## 首次阅读

**代码 AI** 以 `.agents/AGENT_RULES.md` 为简明操作说明，以 `.agents/README.md` 为完整协议；阶段与角色以 [WORKFLOW.md](WORKFLOW.md)、[ROLES.md](ROLES.md) 为准；编码对照 [ENGINEERING_NOTES.md](ENGINEERING_NOTES.md)。

# 代码 AI 进入本仓库时的启动规则

本仓库使用 `.agents/` 协作协议。

## 进入后必做顺序

每次**代码 AI**进入本仓库时，先完成：

1. 运行 `git status --short`
2. 阅读 `.agents/README.md`
3. 阅读 `.agents/STATE.md`
4. 阅读 `STATE.md` 指向的当前任务文件
5. 阅读 `.agents/LOCK.md`

## 工作规则

- 不得在声明的 `write-scope` 之外改文件。
- 写入前在 `.agents/LOCK.md` 取得写锁。
- 若 `STATE.md` 正在等待其他角色且当前会话不是目标方，保持只读，除非用户明确要求协助。
- 仅当 `write-scope` 不重叠且不依赖他方未完成修改时，才允许并行工作。
- 若仅为 review、校验、文档且只读或另有独立 `write-scope`，可与实现并行。
- 除非用户明确使用「commit」「提交」或同等授权，否则不要创建 git commit。
- 「推进」「继续」「修一下」「整理一下」「验证一下」「同步到 Vault」等单独出现**不构成**提交授权。
- 紧急回滚或热修 commit 仍需用户明确授权，且授权原文须记入 `.agents/STATE.md`。
- 用户需求在功能、页面、流程或验收标准上变化时，新建 `.agents/tasks/*.md` 任务卡，勿混在旧任务里。
- 实验性 UX 在发布或同步 Vault 前，任务卡里须有回滚说明。
- 每轮对用户可见的进展应包含：当前状态、风险判断、建议用户如何测、通过条件。
- 常规功能流程：**用户目标 → 代码 AI 最小实现 → Review AI 审查 → 代码 AI 按反馈修订 → 用户验收 → 用户明确批准后再 commit/deploy**。
- 请 **Review AI** 审查前，须给出：需求目标、改动文件列表、用户可见行为变化、已做验证、已知未决风险。
- 每轮实现结束后，更新 `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`，作为给 **Review AI** 的固定交接卡。须包含：用户原话目标、改动文件、用户可见变化、验证情况、风险与开放点、是否要求严格 review、2～4 条用户验收步骤。
- 交接卡就绪后，对用户只说「可 review」；勿要求用户向 **Review AI** 粘贴大段代码、整份 diff 或截图。
- 最终 commit 或同步 Vault 前，填写或摘要 `.agents/reviews/PRECOMMIT_CHECKLIST.md`。
- 在修改存储/composer/renderer、移动端键盘/触摸/遮罩/返回逻辑、数据格式/迁移/保存路径，或改动超过 3 个文件时，须先经**严格 review**再提交。

## 角色与归属

- **代码 AI**：本插件的默认实现方（改代码、构建、按授权同步 Vault、按授权提交）。
- **Review AI**：默认可审不可改业务代码；审查**代码 AI** 的 commit 或当前工作区 diff，除非用户在本线程明确授权例外且已写入 `STATE.md`。
- **顾问类 AI**：仅产品/流程/UX 建议；须先落成 `.agents` 任务卡再动代码。
- **文档 / Prompt AI**：默认只修改文档、提示词与规范资产；`write-scope` 应限于文档或提示词路径。
- 任何非**代码 AI**要改插件代码，须用户明确授权，并在 `.agents/STATE.md` 记录 `owner` 与 `write-scope` 后方可开始。

## 工作区规则

- 仅以**主工作区**为常规开发目录。
- `.claude/worktrees/**` 及其他 git worktree 不纳入默认流程。
- **Review AI** 应直接针对主工作区审查。
- 若需使用 worktree，须用户明确要求并在 `.agents/STATE.md` 记录例外。

## 共享页面名

- `设置页`：Obsidian 第三方插件设置里齿轮进入的 Little Milestones 设置页。
- `打分页`：点击左侧栏星形图标打开的主打分页。
- `得分页`：生成的 Markdown 结果文档页面。

## 交接必更新

**代码 AI**每完成一轮应：

- 更新 `.agents/STATE.md`
- 更新 `.agents/LOCK.md`
- 在 `.agents/log.md` 追加一行
- 更新 `.agents/tasks/` 中活跃任务卡
- 若做了 review，在 `.agents/reviews/` 新增或更新文件

## 本仓库源码约定

- 优先改 `src/**` 与 `styles/**`。
- 除非构建链损坏且已在任务/日志中说明，否则不要手改 `styles.css`。
- `main.js` 可能仍为过渡期的实际产物；若由**代码 AI**手改，须在任务卡与 log 中说明原因。
- 若改了 `styles/**`，须在同轮重建并纳入 `styles.css`。
- 勿让源样式与生成 `styles.css` 长期不一致。
- 若 CSS diff 远大于预期改动，先用 `git ls-files --eol` 检查换行。
- 移动端布局优先查 `styles/07-mobile.css`。
- Vault 同步是**单独、须显式授权**的步骤。
- 仅从**主工作区**同步到 Obsidian Vault 插件目录；勿从 worktree 直同步 Vault。
- worktree 中的改动须先回到主工作区，再从主工作区同步 Vault。
- 同步前确认 `manifest.json`、`main.js`、`styles.css` 与主工作区当前版本一致。
- 同步后确认 Vault 中上述三份与主工作区一致。
- 勿并行执行 `git add`、`git status`、`git commit`；先 add，再确认，再 commit。

## 提交信息前缀

- **代码 AI** 提交的 commit 信息使用前缀：`[code-ai]`（表示由代码 AI 撰写）。

## 对外部审查输入的期望

- 将 **Review AI** 的反馈默认视为审查输入。
- **Review AI** 输出应给出：可发布 / 需修复 / 建议回滚；Findings 分 P0/P1/P2；风险点；建议修复顺序；最小复测步骤；无阻塞时写明 **No blocking issues**。
- 将**顾问类 AI**的建议视为产品与流程参考，**不**当作可直接照抄的代码指令。
- 非**代码 AI**修改插件代码时，必须已有用户授权，且 `STATE.md` 中写明 `owner` 与 `write-scope`。

## 首次阅读

**代码 AI** 应以 `.agents/AGENT_RULES.md` 为简明操作说明，以 `.agents/README.md` 为完整协议。

## 删除与备份（误删可恢复）

- **代码 AI / Review AI / 任何自动化工具**在删除、覆盖或批量移动文件前，须按 [agent-collaboration-kit/BACKUP_AND_DELETION.md](agent-collaboration-kit/BACKUP_AND_DELETION.md) 将待删内容备份到仓库根 **`.ai-deletion-backups/<时间戳>_<slug>/`**，并写入 **`MANIFEST.txt`**（原路径与原因）。
- **默认保留约 30 天**再由维护者清理；用户发现误删可从该目录拷回。
- 已纳入 git 且未提交的危险操作，仍建议备份；**已提交**的删除优先依赖 git 历史，备份作双保险。
- 本仓库 **`.gitignore`** 已忽略 `.ai-deletion-backups/`，勿将备份提交进远端。

## 可复用规则包（其它项目）

与本插件无关的通用模板在仓库内 **`agent-collaboration-kit/`**：**把整个文件夹复制**到新项目仓库根即可。内含 **`WORKFLOW.md`**（全流程）、**`ROLES.md`**（多角色）、**`ENGINEERING_NOTES.md`**（工程注意）、**`BACKUP_AND_DELETION.md`**（删除备份）、**`META_FOR_REVIEWERS.md`**（给外部 AI 改规则用的说明）等；详见 [agent-collaboration-kit/README.md](agent-collaboration-kit/README.md)（Cursor 规则可指向 `agent-collaboration-kit/AGENTS.md`）。

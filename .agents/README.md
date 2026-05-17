# Agent Collaboration Protocol

本仓库用基于文件的交接协议，让**代码 AI**、**Review AI** 与可选的**顾问类 AI** 通过共享文件安全协作。不绑定具体模型或产品名称。

## 角色划分

- **代码 AI**：默认的实现与集成方（改源码、构建、按授权同步 Vault、按授权提交）。
- **Review AI**：默认可审不可改业务代码；审查**代码 AI** 的 commit 或工作区 diff，识别缺陷与风险，除用户明确授权外不直接改插件代码。
- **顾问类 AI**（任意只做建议的会话）：可提供产品/UX/流程想法；须先落成 `.agents` 任务卡再进入编码环节。
- **文档 / Prompt AI**（可选）：仅修改文档、提示词、规范、注释资产等非业务逻辑内容；其 `write-scope` 应限于文档或提示词路径。
- 任何**非代码 AI**要改插件代码，必须经用户明确授权，并在 `.agents/STATE.md` 记录后方可开始。

## 目标

- 任务状态只有一处权威来源。
- 避免静默互相覆盖。
- 实现、审查、交接过程可追溯。
- 不依赖外部服务即可完成协作。

## 核心规则

- 用 `git` 与 `.agents/` 作为协作层。
- 当前任务在 `.agents/STATE.md` 中必须有清晰归属。
- 写权限由 `.agents/LOCK.md` 控制。
- 同一文件或范围的写权限互斥。
- 仅当 `write-scope` 不重叠且不依赖未完成修改时允许并行。
- 实现与（只读的）审查可并行，或各自使用独立 `write-scope`。
- 重要动作须更新 `STATE.md` 并在 `log.md` 追加一行。
- 除非用户明确「commit」「提交」或同等授权，否则不创建 git commit。
- 「推进」「继续」「修一下」「整理一下」「验证一下」「同步到 Vault」单独出现不构成提交授权。

## 角色职责（摘要）

- **代码 AI**：主实现、集成、Vault 同步（按授权）、提交（按授权）、代码结论默认责任方（除非用户另行指定）。
- **Review AI**：审查、校验、风险、回归关注点、对 **代码 AI** 产出给出简洁反馈；正常流程不改插件业务代码。
- **顾问类 AI**：代码链外的脑暴；建议须经**代码 AI**落成任务卡才进入实现。

角色不静默轮换：**代码 AI** 仍是默认实现方。**Review AI** 与**顾问类 AI** 仅在用户授权且 `STATE.md` 写明 `owner` 与 `write-scope` 时可改插件代码。

## 默认维护流程

1. 用户用自然语言描述期望行为。
2. **代码 AI** 创建或更新任务卡、改源码、重建产物、按需同步 Vault、更新 `.agents`、按授权使用 `[code-ai]` 前缀提交。
3. **Review AI** 审查最新 commit 或当前工作区 diff，聚焦明显缺陷、遗漏需求、移动端/Obsidian 回归与验证缺口。
4. **代码 AI** 根据已采纳的审查意见修改，并更新同一任务卡。
5. 用户在 Obsidian 中做最终体验确认。

**Review AI** 提示模板示例：

> 审查最新由**代码 AI**产生的 commit 或当前工作区 diff。只报告明确缺陷、回归、遗漏需求或验证缺口。正常审查不要求重构、不要求直接改代码。

## 固定工作流 V1

- 用户拥有：需求、体验反馈、最终验收，以及是否继续/回滚/commit/同步 Vault 的决策权。
- **代码 AI** 是唯一常规实现方：编辑、构建、修复、提交、Vault 同步（均须按授权）。
- **Review AI** 为审查方：结论、风险、建议修复与验收步骤；正常不改业务代码。
- 每个功能需求按序：
  1. 用户给出目标与问题。
  2. **代码 AI** 做最小合理改动并完成本地验证。
  3. **Review AI** 按严重度、风险、建议修复与验收步骤出审查意见。
  4. **代码 AI** 根据已采纳意见修订。
  5. 用户接受或拒绝当前体验。
  6. 仅在用户明确批准后 **代码 AI** 才 commit 或 deploy。
- **代码 AI** 每轮对用户须说明：当前状态、风险判断、建议测试动作、通过条件。
- **代码 AI** 每轮为 **Review AI** 须准备：需求目标、改动列表、用户可见变化、已做验证、已知风险。
- 每轮实现后，**代码 AI** 须维护 `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`，作为给 **Review AI** 的固定交接卡，包含：
  - 用户原话目标
  - 改动文件列表
  - 关键用户可见变化
  - 已做验证（含构建/类型检查/手测）
  - 风险与待确认点
  - 是否要求严格 review
  - 2～4 条用户验收步骤
- 交接卡就绪后，**代码 AI** 只对用户说「可 review」；勿要求用户向 **Review AI** 粘贴代码、整份 diff 或截图。
- **Review AI** 每次 review 结束后，除审查结论本体外，必须额外产出一段“给代码 AI / 下一步”的可执行文字：若有问题，写成可直接发送给代码 AI 的最小修复指令；若无明确修复项，写成可直接发送的下一步建议（如继续手测、同步 Vault、更新协议收口、准备提交等）。此要求适用于任何承担 review 角色的 AI。
- 最终 commit 或 Vault 同步前，**代码 AI** 须填写或摘要 `.agents/reviews/PRECOMMIT_CHECKLIST.md`。
- **Review AI** 输出建议包含：
  - 结论：可发布 / 需修复 / 建议回滚
  - Findings：P0 / P1 / P2
  - 建议修复顺序
  - 用户最小复测步骤
  - 给代码 AI 的可转发指令（有修复项时）
  - 或下一步建议（无阻塞问题时）
- **Review AI** 正常审查使用 `.agents/reviews/REVIEW_OUTPUT_TEMPLATE.md` 作为固定输出模板。
- 无阻塞问题时须写明 **No blocking issues**。
- 以下情况在 commit 前必须经过**严格 review**：存储/composer/renderer 变更；移动端键盘/触摸/遮罩/返回逻辑变更；数据格式/迁移/保存路径变更；或改动超过 3 个文件。

## 共享页面名

任务、审查、日志与交接中统一使用：

- `设置页`：Obsidian 第三方插件设置里齿轮进入的 Little Milestones 设置页。
- `打分页`：点击左侧栏星形图标打开的主打分页。
- `得分页`：生成的 Markdown 结果文档页面。

## 必备文件

- `.agents/STATE.md`：当前任务、状态、归属、交接、范围。
- `.agents/LOCK.md`：写锁。
- `.agents/tasks/*.md`：任务卡。
- `.agents/reviews/*.md`：审查结果与跟进。
- `.agents/log.md`：仅追加的事件日志。

## 任务拆分规则

- 功能、页面、流程或验收标准变化时，新建 `.agents/tasks/*.md`。
- 切换上下文时保留前一任务卡的状态与交接说明。
- 跟进任务可加可选字段 `origin` 指向来源任务。

## 工作区规则

- **主工作区**是唯一常规代码工作区。
- 以主工作区下的 `.agents/` 为协作权威。
- 默认不使用 `.claude/worktrees/**` 或其他 worktree 做实现。
- **Review AI** 应直接针对主工作区审查，不经过独立 worktree。
- 磁盘上可能留有历史 worktree，默认视为未激活，除非用户明确要求使用并在 `STATE.md` 记录。

## 固定开场流程

每个会话开始前：

1. `git status --short`
2. 读 `.agents/README.md`
3. 读 `.agents/STATE.md`
4. 读 `STATE.md` 指向的当前任务卡
5. 写入前查 `.agents/LOCK.md`

回合结束前：

1. 再次 `git status --short`
2. 更新 `.agents/STATE.md`
3. 更新 `.agents/LOCK.md`
4. 在 `.agents/log.md` 追加一行
5. 若做了审查，写或更新 `.agents/reviews/` 下对应文件
6. 若已 commit，在任务备注中记录 commit hash

## 加锁规则

- 仅锁的持有者可改声明的 `write-scope` 内文件。
- `LOCK.md` 显示他方持有相关范围时，勿改那些文件。
- 只读工作无需占锁。
- 交接、暂停或结束时释放锁。
- 锁过期或异常勿静默覆盖，在 `STATE.md` 与 `log.md` 说明。
- **Review AI** 默认不为插件源码占写锁（审查为主）。
- **非代码 AI** 在默认可审不可改规则下，也不为插件源码占写锁。
- 审查工作保持只读；写入范围通常为 `.agents/reviews/**`，除非用户授权例外。

## 范围规则

- `write-scope` 须具体，例如：`src/settings/settings-tab.ts`、`src/utils/**`、`.agents/**`。
- 可选 `read-scope` 用于广域阅读。
- 两名角色不得同时持有重叠的 `write-scope`。
- 默认插件源码的 `write-scope` 归属 **代码 AI**。
- **Review AI** 默认：`read-scope` + 可写 `.agents/reviews/**`。
- **文档 / Prompt AI** 默认：`read-scope` + 可写文档/提示词路径（如 `docs/**`、`prompts/**`）。
- **非代码 AI**（审查模式）同上。

## 代码与产物真相源

- 当前仓库中 `main.js` 可能仍是实际运行源之一。
- 优先维护 `src/**` 与 `styles/**`（在构建链支持的前提下）。
- `styles.css` 为生成/合并产物，非必要勿手改。
- 工作约定：优先改 `src/**`、`styles/**`；勿随意手改生成物；确需手改 `main.js` 等须在任务卡与 log 说明；改 `styles/**` 后须重建 `styles.css`；样式任务须源文件与 `styles.css` 同轮一致；异常巨大的 CSS diff 先查 `git ls-files --eol`。

## 实验性 UX 回滚

- 实验须能在一轮跟进编辑或一次 revert 内收回。
- 优先用独立 class、开关、小范围 CSS，勿打散到无关文件。
- 发布或同步 Vault 前任务卡须有回滚说明。

## 移动端样式

- iPhone/移动端优先看 `styles/07-mobile.css`。
- 仅当基础样式确属他文件时再扩散修改。
- 多文件改动时在任务卡或 log 中列出。

## Vault 同步

同步到 Obsidian Vault **不是**实现的隐含步骤。

默认 `npm run deploy` 的目标目录见 `scripts/deploy.mjs` 中的 `DEFAULT_VAULT_PLUGIN_DIR`。可用环境变量 `KID_SCORE_VAULT_DIR` 或 `LITTLE_MILESTONES_VAULT_DIR` 指向同一插件目录（`.obsidian/plugins/kid-score`）以覆盖。

本仓库额外约定：

- 仅从**主工作区**同步到 Vault 插件目录。
- worktree 禁止直同步 Vault。
- worktree 中改动须先回到主工作区，再从主工作区同步。
- 每次同步前后核对 `manifest.json`、`main.js`、`styles.css` 与主工作区一致（`diff`、哈希等）。

任务卡中显式跟踪：

- `sync-to-vault: pending | done | n/a`

同步发生时记录：同步了哪些文件、谁同步、何时。

## Git 安全

- 勿并行执行 `git add`、`git status`、`git commit`。
- 先 stage，再用 `git status --short` 确认，再 commit。
- commit 若含生成文件，须在同次 commit 中包含对应源文件。
- 除非用户当前指令明确要求 commit，否则不提交。
- 紧急回滚/热修须用户授权，授权原文记入 `STATE.md`。

## 提交信息前缀（可见角色标签）

- `[code-ai] …`：**代码 AI**（常规插件改动）
- `[review-ai] …`：**Review AI**（审查记录、文档等，常规为审查/文档向）

默认期望：

- 插件源码 commit 正常用 `[code-ai]`
- `[review-ai]` 通常限于审查输出、说明文档，或用户明确授权的其他例外

## 审查期望

每条审查应写明：发现项、严重度、建议修复、是否已解决。若无发现须明确说明。

## 验收清单指引

任务卡中应有可执行验证步骤。本插件常见项包括：iPhone 打分页、iPhone 设置页滚动、键盘遮挡、Obsidian 桌面端、Vault 同步核对。

## 实用说明

工作区不一定始终干净；`git status` 用于暴露当前状态，而非强制一切洁净后才能工作。

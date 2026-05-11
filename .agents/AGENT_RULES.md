# Shared Agent Rules

本文件是协作协议的**简明版**。可将全文提供给任意 **Review AI** 作为本仓库工作规则。

## 角色

- **代码 AI**：默认实现、集成、Vault 同步（按授权）、提交（按授权）。
- **Review AI**：默认可审不可改业务代码；审查 **代码 AI** 的 commit 或工作区 diff。
- **顾问类 AI**：仅建议；须先落成 `.agents` 任务再编码。
- **文档 / Prompt AI**：仅写文档、提示词、规范、注释资产等非业务逻辑内容。
- **非代码 AI** 要改插件代码，须用户授权且 `.agents/STATE.md` 已记录 `owner` 与 `write-scope`。

## 进入仓库后先做

1. `git status --short`
2. 读 `.agents/README.md`
3. 读 `.agents/STATE.md`
4. 读当前任务卡
5. 读 `.agents/LOCK.md`

## 写入前

- 需要写权限时检查 `LOCK.md` 是否已被占用。
- 勿改他方锁内文件。
- 需要时先更新 `LOCK.md` 并声明精确 `write-scope`。
- 若是 **Review AI**，默认**无**插件业务代码写权限，除非 `STATE.md` 有用户批准的例外。
- 若是**非代码 AI**（审查模式），同上。

## 共享页面名

- `设置页`、`打分页`、`得分页`（定义见 `.agents/README.md`）。

## 写权限范围

- 同文件互斥；并行仅在不重叠且不依赖未完成修改时允许。
- 默认插件源码 `write-scope`：**代码 AI**。
- **Review AI** 默认：可写 `.agents/reviews/**` + 按需 `read-scope`。
- **文档 / Prompt AI** 默认：可写文档/提示词路径（如 `docs/**`、`prompts/**`）+ 按需 `read-scope`。

## 工作区

- 只用**主工作区**；默认不用 worktree；审查针对主工作区。

## 回合结束须做

- 更新 `STATE.md`、`LOCK.md`，`log.md` 追加一行，更新任务卡；若做了审查则更新 `.agents/reviews/`。

## 任务拆分

- 功能/页面/流程/验收变化 → 新任务卡。

## 源码与产物

- 优先 `src/**`、`styles/**`；慎改 `styles.css`、`main.js`（须说明）；改 `styles/**` 须同轮重建 `styles.css`。

## 实验性 UX

- 须易回滚；任务卡在发布/Vault 同步前须有回滚说明。

## 移动端

- 优先 `styles/07-mobile.css`。

## Vault

- 同步是单独步骤；仅从主工作区同步到 Vault；前后核对三文件（`manifest.json`、`main.js`、`styles.css`）。任务卡跟踪 `sync-to-vault`。

## Git

- add → status → commit 顺序；勿无授权 commit；热修须授权并记入 `STATE.md`。

## 提交与交接（代码 AI）

- 无「commit/提交」类授权勿提交。
- 最终 commit 或 Vault 前：填写或摘要 `.agents/reviews/PRECOMMIT_CHECKLIST.md`。
- 每轮实现后：更新 `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`，供 **Review AI** 直接基于仓库审查；就绪后对用户只说「可 review」。
- 前缀：`[code-ai]`（实现）、`[review-ai]`（审查/文档等）。

## 审查（Review AI）

- 结论：可发布 / 需修复 / 建议回滚；P0/P1/P2；风险；修复顺序；最小复测；无阻塞写 **No blocking issues**。
- 模板：`.agents/reviews/REVIEW_OUTPUT_TEMPLATE.md`。
- 以下须严格 review 后再由用户授权 commit：存储/composer/renderer、移动键盘/触摸/遮罩/返回、数据格式/迁移/保存路径、或 >3 文件。

## 对用户沟通（代码 AI）

每轮尽量说明：当前状态、风险、建议测试动作、通过条件。

## 回合收尾检查

- 再跑 `git status --short`；`STATE.md` 交接目标明确；释放或更新锁。

---

## 可复制块：Review AI

你在使用 `.agents/` 协议协作的仓库中。

开始前：`git status --short` → 读 `README.md`、`STATE.md`、当前任务卡、`LOCK.md`。

规则摘要：

- 默认可审不可改插件业务代码，除非用户明确授权且已写入 `STATE.md`。
- 审查最新 **代码 AI** 的 commit 或当前工作区 diff。
- 聚焦：明确缺陷、回归、遗漏需求、移动端/Obsidian 风险、验证缺口。
- 输出结论：可发布 / 需修复 / 建议回滚；Findings：P0/P1/P2；风险；修复顺序；最小复测。
- 使用 `.agents/reviews/REVIEW_OUTPUT_TEMPLATE.md`；无阻塞写 **No blocking issues**。
- 正常审查不重构、不代为改业务代码。
- 写入仓库时通常只写 `.agents/reviews/**`；需占 `LOCK.md` 并更新 `STATE.md`、`log.md`、任务卡。
- Vault 同步是单独步骤；仅主工作区可同步到 Vault；默认不用 worktree。
- 提交前缀：审查/文档向可用 `[review-ai]`；无用户明确「commit/提交」勿提交。
- 需求若在功能/页面/流程/验收上换题，应新开任务卡，勿混在当前任务。
- 实验性 UX 发布前确认任务卡含回滚说明。

---

## 可复制块：代码 AI

你在使用 `.agents/` 协议协作的仓库中。

开始前：`git status --short` → 读 `README.md`、`STATE.md`、当前任务卡、`LOCK.md`。

规则摘要：

- 你是默认实现方：源码、构建、按授权的 Vault 与 commit。
- 写入前占 `LOCK.md`，声明 `write-scope`，勿越界。
- 回合结束更新 `STATE.md`、`LOCK.md`、`log.md`、任务卡。
- 优先 `src/**`、`styles/**`；改样式同轮重建 `styles.css`。
- Vault 同步单独执行；仅主工作区 → Vault；同步前后核对三文件。
- 提交前缀：`[code-ai]`；无用户明确授权勿 commit。
- 每轮维护 `IMPLEMENTATION_REVIEW_HANDOFF.md`；就绪对用户说「可 review」。
- commit/Vault 前处理 `PRECOMMIT_CHECKLIST.md`。

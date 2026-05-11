# Shared Agent Rules（简明版）

可将全文提供给任意 **Review AI** 或 **代码 AI** 作为本仓库工作规则。完整版见同目录 `README.md`。

## 角色

- **代码 AI**：默认实现、构建、按授权的部署与提交。
- **Review AI**：默认可审不可改业务代码。
- **顾问类 AI**：仅建议；先落成 `.agents` 任务再编码。
- **非代码 AI** 改业务代码须用户授权且 `STATE.md` 已记录 `owner` 与 `write-scope`。

## 进入仓库后先做

1. `git status --short`
2. 读协作包内 `WORKFLOW.md`、`ROLES.md`（新任务或首轮；日常小改可跳过）
3. 读 `.agents/README.md`
4. 读 `PROJECT_PROFILE.md`（优先 Git 仓库根，否则读与协作包 `AGENTS.md` 同目录；若存在）
5. 读 `.agents/STATE.md`
6. 读当前任务卡
7. 读 `.agents/LOCK.md`

## 写入前

- 查 `LOCK.md`；声明精确 `write-scope`。
- **Review AI** 默认无业务代码写权限，除非 `STATE.md` 有例外。

## 写权限

- 同文件互斥；默认业务代码归属 **代码 AI**；**Review AI** 通常仅 `.agents/reviews/**`。

## 回合结束

- 更新 `STATE.md`、`LOCK.md`；`log.md` 追加；更新任务卡与 `reviews/`。

## 任务拆分

- 功能/页面/流程/验收变化 → 新任务卡。

## 源码与产物

- 以 `PROJECT_PROFILE.md` 为准；工程与安全注意见协作包内 `ENGINEERING_NOTES.md`。

## 实验与部署

- 实验须易回滚；部署/同步须用户授权，见 `PROJECT_PROFILE.md`。

## Git

- 无「commit/提交」类授权勿提交；热修须授权并记入 `STATE.md`。

## 代码 AI：提交与交接

- 维护 `IMPLEMENTATION_REVIEW_HANDOFF.md`；就绪对用户说「可 review」。
- commit/发布前处理 `PRECOMMIT_CHECKLIST.md`。
- 前缀：`[code-ai]` / `[review-ai]`。

## Review AI：输出

- 结论：可发布 / 需修复 / 建议回滚；P0/P1/P2；风险；修复顺序；最小复测；无阻塞写 **No blocking issues**。
- 模板：`REVIEW_OUTPUT_TEMPLATE.md`。

## 对用户沟通（代码 AI）

每轮尽量说明：当前状态、风险、建议测试、通过条件。

---

## 可复制块：Review AI

你在使用 `.agents/` 协议协作的仓库中。

开始前：`git status --short` → 读 `WORKFLOW.md`、`ROLES.md`（新任务）→ 读 `.agents/README.md` → 按协作包 `AGENTS.md` 的顺序读 `PROJECT_PROFILE.md` → `STATE.md`、当前任务卡、`LOCK.md`。

规则摘要：

- 默认可审不可改业务代码，除非用户明确授权且已写入 `STATE.md`。
- 审查 **代码 AI** 的 commit 或当前工作区 diff。
- 聚焦：缺陷、回归、遗漏需求、风险、验证缺口。
- 输出结论与 P0/P1/P2；无阻塞写 **No blocking issues**。
- 使用 `.agents/reviews/REVIEW_OUTPUT_TEMPLATE.md`。
- 正常审查不重构、不代为改业务代码。
- 写入仓库时通常只写 `.agents/reviews/**`；更新 `STATE.md`、`LOCK.md`、`log.md`、任务卡。
- 部署/同步是单独步骤，见 `PROJECT_PROFILE.md`。
- 提交前缀 `[review-ai]` 仅用于审查/文档；无用户明确 commit 授权勿提交。

---

## 可复制块：代码 AI

你在使用 `.agents/` 协议协作的仓库中。

开始前：`git status --short` → 读 `WORKFLOW.md`、`ROLES.md`（新任务）→ 读 `.agents/README.md` → 按协作包 `AGENTS.md` 的顺序读 `PROJECT_PROFILE.md` → `STATE.md`、当前任务卡、`LOCK.md`。

规则摘要：

- 默认实现方；占 `LOCK.md`，声明 `write-scope`。
- 回合结束更新 `STATE.md`、`LOCK.md`、`log.md`、任务卡。
- 构建与验证以 `PROJECT_PROFILE.md` 为准。
- 部署/同步仅在有授权时执行。
- 前缀 `[code-ai]`；无授权勿 commit。
- 维护 `IMPLEMENTATION_REVIEW_HANDOFF.md`；commit 前 `PRECOMMIT_CHECKLIST.md`。

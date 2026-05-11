# IMPLEMENTATION_REVIEW_HANDOFF（代码 AI → Review AI 交接卡）

## Current round goal

用户原话目标：继续补最后一层，把 `agent-collaboration-kit` 里的状态字段命名和任务状态枚举彻底统一。

本轮收口点：

- 把 `status` 与 `awaiting` 的职责拆清：前者表示流程阶段，后者表示在等谁
- 统一 `STATE.md`、任务卡模板、流程文档与 example 的状态枚举
- 清掉旧的混合型状态命名（例如 `awaiting-fix` 一类）在通用模板里的推荐地位

## Architecture / approach summary（可选）

- 不改协议主流程，只补一层“状态契约”。
- 采用两条原则：
  - `status` 只表示流程阶段
  - `awaiting` 只表示在等谁
- `idle` 只保留给 `STATE.md`，表示当前没有活跃任务；`none` 只保留给 `Next Task.status`。

## Changed file list

- `agent-collaboration-kit/.agents/STATE.md`
- `agent-collaboration-kit/.agents/tasks/_template.md`
- `agent-collaboration-kit/.agents/README.md`
- `agent-collaboration-kit/.agents/AGENT_RULES.md`
- `agent-collaboration-kit/WORKFLOW.md`
- `agent-collaboration-kit/examples/minimal-project/README.md`
- `agent-collaboration-kit/examples/minimal-project/.agents/STATE.md`
- `agent-collaboration-kit/examples/minimal-project/.agents/tasks/2026-05-11-add-export-command.md`
- `.agents/tasks/2026-05-11-agent-collaboration-kit-polish.md`
- `.agents/STATE.md`
- `.agents/LOCK.md`
- `.agents/log.md`
- `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`

## User-visible behavior changes

- 规则包内部现在明确规定：`status` 只写流程阶段，`awaiting` 只写等待对象
- `STATE.md` 模板、任务卡模板、`WORKFLOW.md` 和 example 现在使用同一套推荐状态：
  - `planned`
  - `in-progress`
  - `awaiting-review`
  - `awaiting-user`
  - `awaiting-deploy`
  - `done`
  - `cancelled`
- example 里的 `Next Task.status` 已与模板统一为 `none`

## Verification already run

- `git diff --check -- agent-collaboration-kit/ .agents/STATE.md .agents/LOCK.md .agents/log.md .agents/tasks/2026-05-11-agent-collaboration-kit-polish.md .agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`
- `rg` 检查：`awaiting-fix`、`awaiting-user-feedback`、example 中的 ``status: n/a`` 已从规则包模板/示例中清掉
- 逐文件人工核对：
  - `agent-collaboration-kit/.agents/STATE.md`
  - `agent-collaboration-kit/.agents/tasks/_template.md`
  - `agent-collaboration-kit/.agents/README.md`
  - `agent-collaboration-kit/WORKFLOW.md`
  - `agent-collaboration-kit/examples/minimal-project/.agents/STATE.md`
  - `agent-collaboration-kit/examples/minimal-project/.agents/tasks/2026-05-11-add-export-command.md`

## Known risks / open points

- 本轮仍是 docs-only，没有运行构建或测试命令
- `examples/minimal-project/` 仍是“同一任务不同阶段的样板集合”，不是单一时刻快照
- 工作树中仍有大量插件业务代码相关未提交改动；review 时应只看本轮规则文档范围

## Strict Review AI review requested

- `否`

## Suggested user acceptance steps

1. 打开 `agent-collaboration-kit/.agents/STATE.md` 与 `.agents/tasks/_template.md`，确认 `status` / `awaiting` 的分工足够清楚
2. 打开 `agent-collaboration-kit/WORKFLOW.md`，确认流程阶段与推荐状态流转对得上
3. 打开 `agent-collaboration-kit/examples/minimal-project/.agents/STATE.md` 与任务卡，确认 example 也沿用了同一套状态口径

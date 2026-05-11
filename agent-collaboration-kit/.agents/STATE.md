## Current Task
- `task`: <none | 见 `.agents/tasks/` 中 slug>
- `status`: <idle | planned | in-progress | awaiting-review | awaiting-user | awaiting-deploy | done | cancelled>
- `last-actor`: <none>
- `last-commit`: HEAD
- `owner`: <none | code-ai | review-ai | docs-ai>
- `write-scope`: none
- `read-scope`: <可选，如 src/**>
- `awaiting`: <none | user | review-ai | code-ai | docs-ai>
- `handoff-note`: 新仓库接入协作规则后的初始状态。创建首个任务卡后把 `task` 与 `status` 指过去；`idle` 只用于这里表示“当前没有活跃任务”。

## Next Task
- `task`: none
- `status`: <none | planned>
- `owner`: none
- `handoff-note`: none

## Notes
- `status` 只表示**流程阶段**，不要把“在等谁”混进状态名里。
- `awaiting` 只表示**当前卡在等谁推进**。
- 推荐组合：
  - `in-progress` + `awaiting: none`
  - `awaiting-review` + `awaiting: review-ai`
  - `awaiting-user` + `awaiting: user`
  - `awaiting-deploy` + `awaiting: user` 或 `code-ai`（视是谁卡住部署动作）

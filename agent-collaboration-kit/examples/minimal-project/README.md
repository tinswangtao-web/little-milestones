# Minimal Project Example

这是一个**只用于演示规则如何填写**的最小样例，不是可运行项目。

其中的文件用于展示**同一任务在不同阶段**会留下什么记录，不要求每个文件都代表同一个瞬间的完整快照。

它展示了三件事：

1. 一个填好的 `PROJECT_PROFILE.md`
2. 一张按当前 `_template.md` 填好的任务卡
3. 一份实现交接卡和一份 review 输出

示例中也采用当前推荐口径：

- `status` 只表示流程阶段
- `awaiting` 只表示在等谁

## 这个目录怎么理解

在真实项目里，你会有：

```text
my-project/
├── agent-collaboration-kit/
├── PROJECT_PROFILE.md
├── src/
└── ...
```

而这里的 `minimal-project/` 只是把**关键文件单独摆出来**供参考，不重复放整套规则包。

## 推荐阅读顺序

1. `PROJECT_PROFILE.md`
2. `.agents/STATE.md`
3. `.agents/tasks/2026-05-11-add-export-command.md`
4. `.agents/reviews/IMPLEMENTATION_REVIEW_HANDOFF.md`
5. `.agents/reviews/2026-05-11-export-command-review.md`

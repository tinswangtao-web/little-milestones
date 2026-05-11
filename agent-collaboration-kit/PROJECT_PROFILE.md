# PROJECT_PROFILE（fallback stub）

> 这是随 `agent-collaboration-kit` 附带的**回退占位文件**，用于避免规则文档中出现悬空的 `PROJECT_PROFILE.md` 读取路径。
> 
> **推荐做法**：把 `PROJECT_PROFILE.template.md` 复制到 **Git 仓库根目录**，命名为 **`PROJECT_PROFILE.md`**，并按项目实际情况填写。  
> 当仓库根存在 `PROJECT_PROFILE.md` 时，应**优先读取仓库根那一份**；本文件仅作 fallback，不应替代真正的项目档案。

## 当前状态

- 仓库根 `PROJECT_PROFILE.md`：**尚未确认**
- 本文件用途：给第一次接入规则包的人类或 AI 一个最小提醒，说明还缺哪些项目专属信息

## 在开始实现前，至少补齐这些信息

1. 语言与最低版本
2. 包管理 / 锁文件
3. 主要源码路径与生成物路径
4. 构建 / 类型检查 / 测试命令
5. 是否存在部署 / 同步到运行环境的第二步
6. 本项目额外的严审触发条件

## 若仓库根还没有 `PROJECT_PROFILE.md`

- **代码 AI / Review AI** 可以继续阅读通用协议，但**不要猜测**项目特有命令、部署路径、源码目录或依赖策略。
- 涉及构建、测试、部署、路径选择、依赖引入前，应优先要求补齐仓库根 `PROJECT_PROFILE.md`，或在任务卡中明确记录临时约束。

## 下一步

- 复制 `PROJECT_PROFILE.template.md` 到仓库根
- 改名为 `PROJECT_PROFILE.md`
- 按项目实际情况填写后，再把本文件视为仅供回退参考

# 代码 AI / Review AI 协作规则包（可复用）

**用法就一步：把整个 `agent-collaboration-kit` 文件夹复制到新项目的仓库根目录。**

例如新项目结构：

```text
我的新项目/
├── agent-collaboration-kit/    ← 整夹拷过来，勿拆
│   ├── AGENTS.md
│   ├── WORKFLOW.md
│   ├── ROLES.md
│   ├── ARCHITECTURE_GUIDE.md      ← 架构与技术选型
│   ├── QUALITY_STANDARDS.md       ← 代码质量与测试
│   ├── ENGINEERING_NOTES.md
│   ├── META_FOR_REVIEWERS.md
│   ├── BACKUP_AND_DELETION.md
│   ├── PROJECT_PROFILE.md        ← 包内 fallback stub
│   ├── PROJECT_PROFILE.template.md
│   ├── README.md
│   └── .agents/
├── src/
└── ...
```

## 建议阅读顺序（人类与 AI）

1. **[QUICKSTART.md](QUICKSTART.md)**（第一次接入与第一轮协作）
2. **本 `README.md`**（接入方式与目录）
3. **[WORKFLOW.md](WORKFLOW.md)**（从需求到发布）
4. **[ROLES.md](ROLES.md)**（多角色与协作）
5. **[AGENTS.md](AGENTS.md)**（启动顺序与门禁）
6. **[.agents/README.md](.agents/README.md)**（锁、任务、审查流程）
7. **[ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md)**（架构设计与技术选型）
8. **[QUALITY_STANDARDS.md](QUALITY_STANDARDS.md)**（代码质量与测试标准）
9. **[ENGINEERING_NOTES.md](ENGINEERING_NOTES.md)**（实现与审查时对照）
10. **[BACKUP_AND_DELETION.md](BACKUP_AND_DELETION.md)**（删除前备份与恢复）
11. 若你要**帮用户改进规则**：[META_FOR_REVIEWERS.md](META_FOR_REVIEWERS.md)

## 复制之后（AI 引导完成）

把文件夹复制过去后，**告诉 AI 一句话**即可：

> "请读取 `agent-collaboration-kit/AGENTS.md`，按规则定义角色，并引导我完成项目接入。"

AI 进入项目后会检测是否首次接入。如果是，它会先说明计划与写入范围，在你确认后再写文件：

1. 先在 `agent-collaboration-kit/.agents/` 下创建 onboarding 任务卡并占对应写锁
2. **问你几个项目信息**（类型、语言、构建命令、部署方式等）
3. **根据 `PROJECT_PROFILE.template.md` 整理仓库根 `PROJECT_PROFILE.md` 草案**
4. **列出将写入的路径**（通常是仓库根 `PROJECT_PROFILE.md`，以及可选的仓库根 `.gitignore`）
5. **得到确认后写入正式 `PROJECT_PROFILE.md`**
6. **检查并修补 `.gitignore`**（追加 `.ai-deletion-backups/`，先征求确认）
7. **确认 `agent-collaboration-kit/.agents/` 状态文件就绪**

你只需回答问题并确认最终写入范围，不需要手动复制模板；首次接入本身也按 `.agents` 协议执行，不会绕过任务卡和写锁。

### 若你的 AI 工具需要手动配置规则文件

- 支持文件引用：指向 `agent-collaboration-kit/AGENTS.md`
- 不支持文件引用：把 `AGENTS.md` 内容直接粘贴为项目规则

## 非 Cursor 场景

- 若你的工具支持**项目规则文件 / 仓库级 system prompt**，直接指向：`agent-collaboration-kit/AGENTS.md`
- 若工具**不支持文件引用**，就把 [AGENTS.md](AGENTS.md) 的内容直接粘贴到该工具的项目规则 / 系统提示里
- 无论哪种工具，运行时状态仍记录在 `agent-collaboration-kit/.agents/`

## 想直接看样板

- 一屏式接入与日常使用：[`QUICKSTART.md`](QUICKSTART.md)
- 最小可参考骨架：[`examples/minimal-project/`](examples/minimal-project/)

## 包内路径约定

- **`AGENTS.md`** 与 **`.agents/`** 始终在**同一层**（都在这个文件夹里），不要只拷其中一个。
- 所有「读 `.agents/...`」都指：**本包目录下的** `.agents/`。
- 运行时状态写在 `agent-collaboration-kit/.agents/`；项目专属档案写在**仓库根** `PROJECT_PROFILE.md`。
- **`WORKFLOW.md` / `ROLES.md` 等**与 `AGENTS.md` 同级；链接在文档中已写为相对路径。

## 目录说明

| 路径 | 用途 |
|------|------|
| `WORKFLOW.md` | 需求澄清 → 方案 → 任务 → 实现 → 审查 → 发布 |
| `ROLES.md` | 代码 AI / Review AI / 顾问 / 文档与多角色并行 |
| `ARCHITECTURE_GUIDE.md` | 架构设计、技术选型、模块划分、数据流 |
| `QUALITY_STANDARDS.md` | Review AI 检查框架、测试策略、重构指导 |
| `ENGINEERING_NOTES.md` | 安全、依赖、兼容、测试等通用注意 |
| `META_FOR_REVIEWERS.md` | 给其他 AI：如何提规则改进建议 |
| `BACKUP_AND_DELETION.md` | 删除/覆盖前备份、保留期、恢复步骤 |
| `QUICKSTART.md` | 第一次接入、第一次协作、常见坑 |
| `PROJECT_PROFILE.md` | 包内 fallback 说明文件；仅作引用与提醒，不作为首次接入问答源 |
| `gitignore.snippet` | 新项目接入删除备份机制时可直接复制到根 `.gitignore` 的片段 |
| `AGENTS.md` | 给**代码 AI**的启动与门禁 |
| `.agents/README.md` | 完整协议（锁、任务、审查） |
| `.agents/AGENT_RULES.md` | 简明版 + 可复制块 |
| `.agents/STATE.md` / `LOCK.md` / `log.md` | 运行时状态（随任务更新） |
| `.agents/tasks/_template.md` | 新任务卡模板 |
| `.agents/reviews/*` | 交接卡、自检、Review 模板 |
| `examples/minimal-project/` | 一个填好的最小示例，演示项目档案、任务卡、交接与 review 输出 |
| `PROJECT_PROFILE.template.md` | 首次接入问答源；AI 据此在**仓库根**生成正式 `PROJECT_PROFILE.md` |

## 与其他 AI 一起改规则

改包内的 **`AGENTS.md`**、专题 **`WORKFLOW.md` / `ROLES.md` / `ENGINEERING_NOTES.md`** 或 **`.agents/*.md`**；项目专属内容写在仓库根的 **`PROJECT_PROFILE.md`**。给外部 AI 的说明见 **`META_FOR_REVIEWERS.md`**。

## 版本与来源

由 Little Milestones 仓库抽离并通用化；可随意改名、删减、分叉。

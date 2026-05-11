# 代码 AI / Review AI 协作规则包（可复用）

**用法就一步：把整个 `agent-collaboration-kit` 文件夹复制到新项目的仓库根目录。**

例如新项目结构：

```text
我的新项目/
├── agent-collaboration-kit/    ← 整夹拷过来，勿拆
│   ├── AGENTS.md
│   ├── WORKFLOW.md
│   ├── ROLES.md
│   ├── ENGINEERING_NOTES.md
│   ├── META_FOR_REVIEWERS.md
│   ├── PROJECT_PROFILE.template.md
│   ├── README.md
│   └── .agents/
├── src/
└── ...
```

## 建议阅读顺序（人类与 AI）

1. **本 `README.md`**（接入方式）
2. **[WORKFLOW.md](WORKFLOW.md)**（从需求到发布）
3. **[ROLES.md](ROLES.md)**（多角色与协作）
4. **[AGENTS.md](AGENTS.md)**（启动顺序与门禁）
5. **[.agents/README.md](.agents/README.md)**（锁、任务、审查流程）
6. **[ENGINEERING_NOTES.md](ENGINEERING_NOTES.md)**（实现与审查时对照）
7. 若你要**帮用户改进规则**：[META_FOR_REVIEWERS.md](META_FOR_REVIEWERS.md)

## 复制之后（两件小事）

1. **项目说明（推荐）**  
   把包里的 `PROJECT_PROFILE.template.md` **复制到仓库根**（与 `agent-collaboration-kit` 并列），改名为 **`PROJECT_PROFILE.md`**，按你的项目填写。  
   协议会**优先读仓库根**的 `PROJECT_PROFILE.md`；没放根目录时，才会读包内的同名片段（若你将来在包内也放了一份）。

2. **Cursor**  
   在项目规则里**引用**：

   `agent-collaboration-kit/AGENTS.md`

   这样不用把 `AGENTS.md` 再挪到根目录。

## 包内路径约定

- **`AGENTS.md`** 与 **`.agents/`** 始终在**同一层**（都在这个文件夹里），不要只拷其中一个。
- 所有「读 `.agents/...`」都指：**本包目录下的** `.agents/`。
- **`WORKFLOW.md` / `ROLES.md` 等**与 `AGENTS.md` 同级；链接在文档中已写为相对路径。

## 目录说明

| 路径 | 用途 |
|------|------|
| `WORKFLOW.md` | 需求澄清 → 方案 → 任务 → 实现 → 审查 → 发布 |
| `ROLES.md` | 代码 AI / Review AI / 顾问 / 文档与多角色并行 |
| `ENGINEERING_NOTES.md` | 安全、依赖、兼容、测试等通用注意 |
| `META_FOR_REVIEWERS.md` | 给其他 AI：如何提规则改进建议 |
| `AGENTS.md` | 给**代码 AI**的启动与门禁 |
| `.agents/README.md` | 完整协议（锁、任务、审查） |
| `.agents/AGENT_RULES.md` | 简明版 + 可复制块 |
| `.agents/STATE.md` / `LOCK.md` / `log.md` | 运行时状态（随任务更新） |
| `.agents/tasks/_template.md` | 新任务卡模板 |
| `.agents/reviews/*` | 交接卡、自检、Review 模板 |
| `PROJECT_PROFILE.template.md` | 复制到**仓库根** → `PROJECT_PROFILE.md` |

## 与其他 AI 一起改规则

改包内的 **`AGENTS.md`**、专题 **`WORKFLOW.md` / `ROLES.md` / `ENGINEERING_NOTES.md`** 或 **`.agents/*.md`**；项目专属内容写在仓库根的 **`PROJECT_PROFILE.md`**。给外部 AI 的说明见 **`META_FOR_REVIEWERS.md`**。

## 版本与来源

由 Little Milestones 仓库抽离并通用化；可随意改名、删减、分叉。

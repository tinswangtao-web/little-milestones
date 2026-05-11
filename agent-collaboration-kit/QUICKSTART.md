# Quick Start

适合第一次把 `agent-collaboration-kit` 用到新项目的人类或 AI。

## 接入（只需一步）

把整个 `agent-collaboration-kit/` 复制到新项目仓库根目录。

然后告诉你的 AI：

> "请读取 `agent-collaboration-kit/AGENTS.md`，按规则定义角色，并引导我完成项目接入。"

AI 会检测是否需要首次接入引导，并带你完成剩余步骤：

- 先创建 onboarding 任务卡并占对应写锁
- 问你几个项目信息（类型、语言、构建命令等）
- 读取 `PROJECT_PROFILE.template.md`，整理仓库根 `PROJECT_PROFILE.md` 草案
- 列出将写入的路径和项目档案摘要，等你确认
- 在确认后创建仓库根正式 `PROJECT_PROFILE.md`
- 检查并修补 `.gitignore`（加入 `.ai-deletion-backups/`，先征求确认）
- 确认 `agent-collaboration-kit/.agents/` 状态文件就绪

你只需回答问题并确认最终写入范围，不需要手动复制模板；首次接入本身也按 `.agents` 协议执行。

## 第一个需求怎么走

用一句话理解流程：

**需求澄清 → 方案（按需）→ 任务卡 → 实现与自测 → Review → 用户验收 → 用户明确授权后再 commit / deploy**

小改动可以跳过独立设计阶段；涉及存储、安全、迁移、关键交互时不要跳过。

## 你现在该看哪个文件

| 场景 | 先看 |
|------|------|
| 我想知道整体流程 | `WORKFLOW.md` |
| 我想知道不同 AI 怎么分工 | `ROLES.md` |
| 我想决定技术路线 / 架构 | `ARCHITECTURE_GUIDE.md` |
| 我想做 review / 补测试 | `QUALITY_STANDARDS.md` |
| 我怕误删、想可恢复 | `BACKUP_AND_DELETION.md` |
| 我想知道本项目自己的命令和约束 | 仓库根 `PROJECT_PROFILE.md` |

## 第一轮协作的最小动作

### 代码 AI

1. 创建一张任务卡：`agent-collaboration-kit/.agents/tasks/<date>-<slug>.md`
2. 在 `STATE.md` 指向这张卡
3. 若要写文件，先占 `LOCK.md`
4. 改动后填写 `IMPLEMENTATION_REVIEW_HANDOFF.md`
5. 对用户说「可 review」

### Review AI

1. 读任务卡、`STATE.md`、`IMPLEMENTATION_REVIEW_HANDOFF.md`
2. 看 `git diff`
3. 按 `REVIEW_OUTPUT_TEMPLATE.md` 输出
4. 无阻塞问题时写 **No blocking issues**

## 常见坑

- 没写任务卡就直接改代码
- 没占锁就和另一个 AI 改同一文件
- 用户没明确说"commit/提交"，就提前提交
- 删除/覆盖前没按 `BACKUP_AND_DELETION.md` 先备份
- 项目特有命令没写进仓库根 `PROJECT_PROFILE.md`

## 最小示例

可直接参考：

- `agent-collaboration-kit/examples/minimal-project/README.md`
- 其中的 `PROJECT_PROFILE.md`
- 其中的示例任务卡 / 交接卡 / review 输出

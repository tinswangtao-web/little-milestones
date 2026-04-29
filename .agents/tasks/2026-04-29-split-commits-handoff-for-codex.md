# 提交拆分执行卡（给 Codex）

- **slug**: 2026-04-29-split-commits-handoff
- **created**: 2026-04-29
- **owner**: codex
- **status**: awaiting-user-verification
- **origin**: Cursor review **P1-3** + 用户无法在 Vault 测试（尚未同步构建产物）

## 背景

当前 **working tree 混合**了多条独立用户故事（存储/读取路径、卡片显色、目标口径为总分、协作协议文档）。用户要求 **先按原子提交拆分并提交**，再由 Cursor review，最后用户 **一次性在 Vault 里测试**。

拆分完成后请：

1. 按下列顺序分别 `git add` → `npm run build` → `git add main.js` → `git commit`（每一步提交里 **`main.js` 必须与当前已 stage 的 `src/**` 一致**）。
2. **`styles.css` 若本轮无 `styles/**` 改动可不动**；若有改动须同轮重建并一并纳入对应功能提交。
3. 用户此前 **未能在 Vault 验证**：拆分提交后请按仓库惯例执行 **Vault 同步**（仅主工作区 → 用户约定的插件目录），并仅在用户已授权同步时执行；同步后可在 `.agents` 任务卡里勾选 `sync-to-vault`。
4. 更新 `.agents/STATE.md`、`.agents/LOCK.md`、`.agents/log.md`、相关任务卡 handoff。

## 提交顺序与文件清单

下列路径相对于仓库根目录。若某文件在你接手时已并入 `HEAD`，跳过该文件即可。

### Commit 1 — `[codex] feat: day-data read options, summary fast path, post-save fresh window`

**范围**：存储层、`readDayData`/`getAllScores` 选项透传、打分页加载与生成报告时的读取策略。

| 路径 |
|------|
| `src/storage/day-data-store.ts` |
| `src/main.ts` |
| `src/modals/helpers/daily-modal-state.ts` |
| `src/composers/day-data-composer.ts` |

**说明**：`StatsModal` 若在上一轮已进 `HEAD` 且工作区无 diff，不必强行纳入本提交。

---

### Commit 2 — `[codex] fix: score card negative styling only when score < 0`

| 路径 |
|------|
| `src/modals/panels/score-items-panel.ts` |

---

### Commit 3 — `[codex] feat: goal progress uses daily total score (UI, stats, report copy)`

| 路径 |
|------|
| `src/modals/helpers/daily-total-display.ts` |
| `src/modals/panels/stats-panel.ts` |
| `src/renderers/report-sections.ts` |
| `src/settings/goal-settings-section.ts` |

---

### Commit 4 — `[codex] chore: agent collaboration docs, review cards, and task templates`

**范围**：`.agents/**` 与根目录 `AGENTS.md` 的协议/卡片/模板；含当前 **untracked** 的 reviews、tasks 下新增文件时一并 `git add`。

**注意**：勿把插件源码混在本提交里。

---

## 每步固定命令（示例）

```bash
# 仅示例：按提交替换 FILE_LIST
git add FILE_LIST
npm run build
npx tsc --noEmit
node --check main.js
git add main.js
git commit -m "<上面对应的 subject>"
```

四轮完成后：`git log --oneline -5` 自检应为 **4 条新提交**（若你从已有 ahead 分支继续，以实际上屏为准）。

## User-visible 摘要（便于 STATE / log）

- **Commit 1**：统计/打分默认走 fast path；保存后短窗口 fresh；summary 读盘不抽日记正文；composer 侧按需 fresh。
- **Commit 2**：减分项仅在实际分数 < 0 时按「负分」样式显示。
- **Commit 3**：每日目标与周/月卡片、得分页文案统一为「总分相对目标」口径。
- **Commit 4**：协作协议与 review 资产，无运行时行为变更。

## Cursor 后续

用户约定：**Codex 完成拆分提交（并 Vault 同步若已授权）后**，由 Cursor 再跑一轮 review；通过后用户再统一测试。

## Codex 执行记录

- 2026-04-29 15:05 CST：已创建 Commit 1 `6a664dd` `[codex] feat: day-data read options, summary fast path, post-save fresh window`，并通过 `npm run build`、`npx tsc --noEmit`、`node --check main.js`。
- 2026-04-29 15:08 CST：已创建 Commit 2 `44b5505` `[codex] fix: score card negative styling only when score < 0`，并通过 `npm run build`、`npx tsc --noEmit`、`node --check main.js`。
- 2026-04-29 15:12 CST：已创建 Commit 3 `247450a` `[codex] feat: goal progress uses daily total score`，并通过 `npm run build`、`npx tsc --noEmit`、`node --check main.js`。
- 2026-04-29 15:18 CST：已创建 Commit 4 `[codex] chore: agent collaboration docs, review cards, and task templates`（最终 hash 以 `git log --oneline -1` 为准）。
- 2026-04-29 15:24 CST：最终 `npm run build`、`npx tsc --noEmit`、`node --check main.js` 通过。
- 2026-04-29 15:25 CST：已执行 `npm run deploy`，同步 `main.js`、`styles.css`、`manifest.json` 到 Vault；脚本校验三文件 `MATCH`。
- 2026-04-29 15:26 CST：等待 Cursor round review。
- 2026-04-29 16:02 CST：Cursor round review 完成，输出 `.agents/reviews/2026-04-29-round-review.md`；结论可发布，无 P0/P1 阻塞，待用户在 Vault 做最终回归验收。

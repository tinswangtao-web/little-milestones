# Codex -> Cursor Review Card

本卡合并最近几轮尚未手动转给 Cursor 的 Codex 改动，并包含最新 fresh `getAllScores()` 入口补强。Cursor 请直接读取当前 working-tree diff 和本卡内容进行 review。当前没有 commit，也没有 Vault sync。

## Review 范围总览

1. Stats summary fast path + freshness P0 修复
2. 打分页卡片显色逻辑修复
3. 目标/进度统一为最终得分口径
4. StatsModal / loadDailyModalState fresh getAllScores 入口补强

## 1) 本轮目标（用户原话）

### A. Stats summary fast path + freshness P0 修复

Cursor review 补充：发现一个更高优先问题（影响编辑页数据正确性）

现象：
- 在已打分日期再次编辑时，分数/临时项有时丢失或与之前不一致。

判断：
- 代码问题为主，跨终端同步会放大触发概率。
- 根因在 `DayDataStore.readDayData()`：读取时优先使用 `metadataCache` frontmatter，可能是旧值；而正文来自最新文件，导致状态不一致。

请修复（建议）：
1. `readDayData(dateStr, options?)` 增加 freshness 选项（如 `preferFreshFrontmatter`）。
2. 在编辑页加载路径（`loadDailyModalState`）调用时强制 fresh frontmatter（从文件内容解析），不要优先 metadata cache。
3. `readDaySummary()` 保持 fast path，但也支持 `preferFreshRead`，在“保存后立即统计”等场景启用。
4. 增加一个回归用例（至少手工）：
   - A端修改某日 -> B端立即打开该日编辑，确认 scores/customItems 与文件一致，不回落为旧值/0。

用户补充：
“请在 readDaySummary 增加 preferFreshRead 选项，并在保存后立即统计相关调用里启用，避免 metadata cache 窗口导致旧值。修完再给我一版 checklist + diff。”

### B. 打分页卡片显色逻辑修复

需求：统一打分页卡片显色逻辑：

目标规则：
1. 未获得分值（scoreVal === 0）：一律灰色（不分加分/减分项）
2. 获得正分（scoreVal > 0）：绿色背景
3. 获得负分（scoreVal < 0）：红色背景

请修改：
- 文件：`src/modals/panels/score-items-panel.ts`
- 函数：`renderScoreCard()` 和 `refreshScoreCard()`

当前问题：
- `isNeg` 计算把“scoreVal===0 且 item.points<0”也算成 negative，导致未打分减分项发红。

修法建议（最小改动）：
- 将 `isNeg` 改为仅 `scoreVal < 0`
- 保留 `isDeductedActive = isDeductItem && scoreVal !== 0`（用于减分项已打分态）

### C. 目标/进度统一为最终得分口径

需求：统一“目标/进度”统计口径为“最终得分”（加减分后的 total），覆盖 打分页 + 统计页 + 得分页(MD)。

一、打分页（实时目标条）
- 文件：`src/modals/helpers/daily-total-display.ts`
- 目标：
  - 进度值改为 `total`（当前分数总和）
  - 不再用 completed 项目数
  - 显示文案：`今日目标 {total}/{dailyGoal}`
  - 进度条：`pct = clamp(round(total / dailyGoal * 100), 0, 100)`（负分按0显示，不允许负宽度）

二、统计页（目标卡）
- 文件：`src/modals/panels/stats-panel.ts`
- 目标：
  - 保持周/月目标按得分累计（当前基本已是 `day.total`）
  - 把误导性命名改掉：
    - `calcCompleted` -> `calcGoalProgressByScore`（或同等语义）
    - `goalCompleted` -> `goalProgress`
  - 文案改为“得分进度”而不是“完成项目”

三、得分页（生成 Markdown）
- 文件：`src/renderers/report-sections.ts`
- 目标：
  1. `buildGoalCallout(report)` 改为按分数：
     - `progress = report.total`
     - 文案：`得分进度 **{progress}/{dailyGoal}**`
     - 进度条百分比同样 clamp 到 [0,100]
  2. `buildSummaryCallout(report)` 中“完成项目 x/y”这行改成得分口径
     - 示例：`🎯 目标进度：**{report.total}/{dailyGoal} ({pct}%)**`
     - 不要再出现完成项比例作为目标主指标

四、设置页文案同步：
- `以最终得分为统计标准（含加分、减分和临时事项）`

### D. StatsModal / loadDailyModalState fresh getAllScores 入口补强

“请把 StatsModal 和 loadDailyModalState 里的 getAllScores() 改为在关键场景可用 preferFreshRead: true（至少在打开统计页和加载打分页状态时），并给我更新后的 diff + 自检卡。”

Cursor review follow-up：
- fresh 覆盖正确，但性能 tradeoff 偏重，需补两点再提交。
- `StatsModal` 和 `loadDailyModalState` 不要默认每次都 full fresh，改成默认 normal fast path，仅在“保存后立即统计/刚切换日期需强一致”场景启用 fresh（一次性或短窗口）。
- `readDaySummary()` 的 fresh 分支不要解析 diary 内容；可从文件内容解析 frontmatter，但调用 `buildDayDataFromFrontmatter(frontmatter, dateStr)`（不传 content）。

## 2) 改动文件清单

### A. Stats summary fast path + freshness P0 修复

- `src/storage/day-data-store.ts`
- `src/main.ts`
- `src/composers/day-data-composer.ts`
- `src/modals/helpers/daily-modal-state.ts`
- `main.js`（build 生成）
- `.agents/tasks/2026-04-28-stats-summary-fast-path.md`
- `.agents/reviews/2026-04-28-stats-summary-fast-path-codex-checklist.md`
- `.agents/reviews/2026-04-28-stats-summary-fast-path-cursor-p0-followup.md`

### B. 打分页卡片显色逻辑修复

- `src/modals/panels/score-items-panel.ts`
- `main.js`（build 生成）
- `.agents/tasks/2026-04-28-score-card-color-logic.md`

### C. 目标/进度统一为最终得分口径

- `src/modals/helpers/daily-total-display.ts`
- `src/modals/panels/stats-panel.ts`
- `src/renderers/report-sections.ts`
- `src/settings/goal-settings-section.ts`
- `main.js`（build 生成）
- `.agents/tasks/2026-04-28-goal-progress-score-basis.md`
- `.agents/reviews/2026-04-28-goal-progress-score-basis-codex-checklist.md`

### D. StatsModal / loadDailyModalState fresh getAllScores 入口补强

- `src/storage/day-data-store.ts`
- `src/modals/stats-modal.ts`
- `src/modals/helpers/daily-modal-state.ts`
- `main.js`（build 生成）
- `.agents/tasks/2026-04-29-fresh-getallscores-entrypoints.md`
- `.agents/reviews/2026-04-29-fresh-getallscores-entrypoints-codex-checklist.md`

### 协作流程/卡片文件

- `.agents/reviews/CODEX_TO_CURSOR_REVIEW_CARD.md`
- `.agents/README.md`
- `.agents/AGENT_RULES.md`
- `AGENTS.md`
- `.agents/STATE.md`
- `.agents/LOCK.md`
- `.agents/log.md`

## 3) 关键行为变化（用户可见）

### A. Stats summary fast path + freshness P0 修复

- 统计页历史数据读取优先走 `readDaySummary()`，减少逐日读取完整正文。
- `readDayData()` 默认从文件内容解析 frontmatter，避免“最新正文 + 旧 metadata cache frontmatter”混用。
- 编辑旧日期时，`scores/customItems` 应与文件内容一致，不应回落旧值或 0。
- 保存生成报告时，累计分与 streak 相关读取使用 fresh 路径，避免保存后 metadata cache 窗口导致旧统计。

### B. 打分页卡片显色逻辑修复

- 未获得分值的加分项和减分项都显示灰色。
- 只有实际 `scoreVal > 0` 才显示绿色。
- 只有实际 `scoreVal < 0` 才显示红色。
- 减分项已打分态 `is-deducted-active` 保留。

### C. 目标/进度统一为最终得分口径

- `打分页` 实时目标条从“完成项目数/每日目标”改成“当前最终得分/每日目标”。
- `打分页` 目标进度条按 `total / dailyGoal` 显示，负分时宽度夹到 0%。
- 统计页周/月目标卡按周期内 `day.total` 累加显示，文案改为“本周得分进度”/“本月得分进度”。
- `得分页` Markdown 的目标 callout 和汇总 callout 都显示得分口径，不再把“完成项目”作为目标主指标。
- 设置页目标说明改为“以最终得分为统计标准（含加分、减分和临时事项）”。

### D. StatsModal / loadDailyModalState fresh getAllScores 入口补强

- 打开统计页和加载 `打分页` 状态默认恢复 `getAllScores()` fast path，避免大历史数据下每次 full fresh。
- `DayDataStore.saveDayData()` 保存成功后开启 2 秒 fresh read 短窗口；窗口内默认 `getAllScores()` 自动绕过 `_allScoresCache` 和 metadata cache summary。
- `readDaySummary()` 的 fresh 分支只解析 frontmatter，构造 summary 时不传正文 `content`，避免 `extractDiaryContent()` 开销。
- 这是对 A 项 freshness 修复的性能调优，不改变保存格式或 UI 文案。

## 4) 已执行验证（build/typecheck/手测）

### A. Stats summary fast path + freshness P0 修复

- `npx tsc --noEmit`：通过。
- `npm run build`：通过。
- `node --check main.js`：通过。
- 手测：未在 Obsidian 跨端完成，等待用户/ Cursor 复测。

### B. 打分页卡片显色逻辑修复

- `npx tsc --noEmit`：通过。
- `npm run build`：通过。
- `node --check main.js`：通过。
- 生成过本地显色对照截图：`/private/tmp/little-milestones-score-card-color-preview.png`。
- 手测：未在 Obsidian 内完成，等待用户体验复测。

### C. 目标/进度统一为最终得分口径

- `npx tsc --noEmit`：通过。
- `npm run build`：通过。
- `node --check main.js`：通过。
- 文案/命名扫描：
  - `calcCompleted` / `goalCompleted` 已从目标卡代码中移除。
  - 目标相关主文案已改为 `得分进度` / `目标进度`。
- 手测：未在 Obsidian 内完成，等待用户体验复测。

### D. StatsModal / loadDailyModalState fresh getAllScores 入口补强

- `npx tsc --noEmit`：通过。
- `npm run build`：通过。
- `node --check main.js`：通过。
- 代码扫描：
  - `StatsModal.onOpen()` 调用 `getAllScores()`。
  - `loadDailyModalState()` 的 `allScores` 调用 `getAllScores()`。
  - `readDaySummary()` fresh 分支调用 `buildDayDataFromFrontmatter(frontmatter, dateStr)`，不传 `content`。
- 手测：未在 Obsidian 内完成，等待用户体验复测。

## 5) 已知风险与待确认点

### A. Stats summary fast path + freshness P0 修复

- 涉及 storage/composer/edit-load 路径，属于严格 review 范围。
- 需要重点确认 `readDaySummary()` 的快路径不会影响旧 schema / 旧 Markdown 文件兼容。
- 需要确认 fresh read 场景绕过 5 秒 `getAllScores()` cache 后，保存后的累计分和 streak 使用最新数据。
- 跨终端同步场景仍需要手工复测：A 端修改某日 -> B 端立即打开同日编辑。

### B. 打分页卡片显色逻辑修复

- 风险较低，仅改 `isNeg` class 判断。
- 需要确认自定义调分正/负切换时 `refreshScoreCard()` 颜色即时正确。
- 需要确认 `is-deducted-active` 样式仍只在减分项已打分时出现。

### C. 目标/进度统一为最终得分口径

- 改动跨 4 个源码文件和 generated `main.js`，属于严格 review 范围。
- `report.goals.daily || 10` 保持旧逻辑；设置页仍限制目标为正数。
- `打分页` total 包含基础项目分数和临时事项分数，需确认与保存后的 `report.total` 一致。
- 统计页周/月目标卡在周期累计为负数时，数值会显示负数，进度条按 0% 展示。

### D. StatsModal / loadDailyModalState fresh getAllScores 入口补强

- 保存后 2 秒短窗口会比普通缓存路径稍慢；默认打开统计页和打分页状态加载应接近原 fast path。
- 需要确认保存后立即打开统计页时，历史累计、记录数、周/月目标等确实使用最新文件数据。
- 需要确认大历史数据下，非保存后的普通打开统计页/打分页首次速度明显不卡。

### 全局待确认

- 当前 working tree 同时包含三轮功能改动和协作协议文档改动，尚未 commit。
- 当前未做 Vault sync。

## 6) 是否请求 Cursor 严格review（是/否）

是。

原因：
- A 涉及 storage/composer/edit-load 数据读取路径。
- D 是 A 的入口补强，涉及统计页和打分页状态加载读取路径。
- C 涉及 renderers，并且改动跨 3 个以上文件。
- 当前 working tree 合并了多轮未提交改动，需要 Cursor 按当前 diff 一并检查回归风险。

## 7) 建议用户验收步骤（2-4步）

1. 打开一个已打分旧日期，确认 `打分页` 的基础分数和临时项没有丢失，也没有回落为旧值/0。
2. 在 `打分页` 同时观察加分项未打分、减分项未打分、已加分、已扣分四种卡片：未打分均灰色，正分绿色，负分红色。
3. 在 `打分页` 点加分和减分，确认目标条显示 `今日目标 total/目标`，负分时进度条不出现负宽度。
4. 保存生成 `得分页` 后立即打开统计页，确认 Markdown 目标 callout/汇总、统计页历史累计/记录数/周月目标卡都使用最新最终得分。

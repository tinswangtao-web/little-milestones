import { stringifyYaml } from "obsidian";
import type { CustomScoreItem, DayReport, ScoreItem, WeekSummary, MonthSummary } from "../types";

export function buildFrontmatter(report: DayReport): string {
  const scoresYaml = Object.fromEntries(
    report.items.map((item) => [item.id, report.scores[item.id] || 0])
  );

  const frontmatter: Record<string, unknown> = {
    schemaVersion: 2,
    date: report.dateStr,
    child: report.childName,
    total: report.total,
    scores: scoresYaml,
  };

  if (report.customItems.length > 0) {
    frontmatter.customItems = report.customItems.map((item) => ({
      id: item.id,
      emoji: item.emoji,
      name: item.name,
      points: item.points,
      ...(item.note && item.note.trim() ? { note: item.note.trim() } : {}),
    }));
  }
  const diaryModules = Object.fromEntries(
    Object.entries(report.diaryModules || {}).filter(([, value]) => String(value || "").trim())
  );
  if (Object.keys(diaryModules).length > 0) {
    frontmatter.diaryModules = diaryModules;
  }

  return "---\n" + stringifyYaml(frontmatter).trimEnd() + "\n---\n\n";
}

export function buildSummaryCallout(report: DayReport): string {
  const totalSign = report.total >= 0 ? "+" : "";
  const dailyGoal = report.goals.daily || 10;
  const goalPct = clampPercent(Math.round((report.total / dailyGoal) * 100));
  let summary =
    "> [!summary] 📊 今日汇总\n" +
    "> - 🏆 今日总分：**" +
    totalSign +
    report.total +
    " 分**\n";
  if (report.hasYesterday && report.yesterdayData) {
    const yTotalSign = report.yesterdayData.total >= 0 ? "+" : "";
    summary += "> - 📅 昨日总分：" + yTotalSign + report.yesterdayData.total + " 分\n";
  }
  const grandSign = report.grandTotal >= 0 ? "+" : "";
  summary +=
    "> - 🎯 目标进度：**" +
    report.total +
    "/" +
    dailyGoal +
    " (" +
    goalPct +
    "%)**\n" +
    "> - ➕ 加了分的项：" +
    report.positiveCount +
    " 项\n" +
    "> - ➖ 减了分的项：" +
    report.negativeCount +
    " 项\n" +
    "> - 📌 临时事项：" +
    report.customItems.length +
    " 项 (" +
    (report.customTotal >= 0 ? "+" : "") +
    report.customTotal +
    " 分)\n" +
    "> - 📈 累计总分：" +
    grandSign +
    report.grandTotal +
    " 分 · 📅 累计 " +
    report.grandDays +
    " 天 · 📊 日均 " +
    report.grandAvg +
    " 分\n";
  return summary;
}

export function buildGoalCallout(report: DayReport): string {
  const dailyGoal = report.goals.daily || 10;
  const progress = report.total;
  const goalPct = clampPercent(Math.round((progress / dailyGoal) * 100));
  const goalStatus = report.goalMet ? "🎉 目标已达成" : "⏳ 目标未达成";
  return (
    "> [!tip] 🎯 今日目标\n" +
    "> 得分进度 **" +
    progress +
    "/" +
    dailyGoal +
    "** · " +
    renderProgressBar(goalPct) +
    "\n" +
    "> " +
    goalStatus +
    " · 🏁 连续达标 " +
    report.streak +
    " 天\n"
  );
}

export function buildCategoryTables(report: DayReport): string {
  let content = "";
  for (const category of report.categories) {
    const items = report.items.filter((item) => item.category === category);
    if (items.length > 0) {
      content +=
        "\n### " +
        category +
        "\n\n" +
        "| 项目 | 默认 | 得分 | 状态 |\n|:---|---:|---:|:---:|\n" +
        renderCategoryRows(items, report) +
        "\n";
    }
  }

  const uncategorized = report.items.filter(
    (item) => !item.category || report.categories.indexOf(item.category) === -1
  );
  if (uncategorized.length > 0) {
    content +=
      "\n### 其他\n\n" +
      "| 项目 | 默认 | 得分 | 状态 |\n|:---|---:|---:|:---:|\n" +
      renderCategoryRows(uncategorized, report) +
      "\n";
  }

  return content;
}

export function buildCustomItemsCallout(customItems: CustomScoreItem[]): string {
  if (customItems.length === 0) return "";
  const customTotal = customItems.reduce((sum, item) => sum + item.points, 0);
  const hasNotes = customItems.some((item) => item.note && item.note.trim());
  let callout =
    "\n> [!info] 📌 临时事项（" +
    customItems.length +
    " 项，" +
    (customTotal >= 0 ? "+" : "") +
    customTotal +
    " 分）\n";

  if (hasNotes) {
    callout += "> | 事项 | 得分 | 备注 |\n> |:---|---:|:---|\n";
    for (const item of customItems) {
      callout +=
        "> | " +
        item.emoji +
        " " +
        item.name +
        " | " +
        (item.points >= 0 ? "+" : "") +
        item.points +
        " | " +
        (item.note || "") +
        " |\n";
    }
  } else {
    callout += "> | 事项 | 得分 |\n> |:---|---:|\n";
    for (const item of customItems) {
      callout +=
        "> | " +
        item.emoji +
        " " +
        item.name +
        " | " +
        (item.points >= 0 ? "+" : "") +
        item.points +
        " |\n";
    }
  }
  return callout + "\n";
}

export function buildWeeklySummary(summary: WeekSummary): string {
  const totalSign = summary.totalScore >= 0 ? "+" : "";
  const avgSign = summary.avgScore >= 0 ? "+" : "";
  return (
    "> [!info] 📅 上周目标完成情况（" +
    summary.weekStart +
    " ~ " +
    summary.weekEnd +
    "）\n" +
    "> - 📆 记录天数：" +
    summary.daysRecorded +
    " 天\n" +
    "> - 🎯 达标天数：" +
    summary.daysMetGoal +
    " 天\n" +
    "> - 📊 总得分：" +
    totalSign +
    summary.totalScore +
    " 分 · 日均 " +
    avgSign +
    summary.avgScore +
    " 分\n"
  );
}

export function buildMonthlySummary(summary: MonthSummary): string {
  const totalSign = summary.totalScore >= 0 ? "+" : "";
  const avgSign = summary.avgScore >= 0 ? "+" : "";
  return (
    "> [!info] 📅 上月目标完成情况（" +
    summary.month +
    "）\n" +
    "> - 📆 记录天数：" +
    summary.daysRecorded +
    " 天\n" +
    "> - 🎯 达标天数：" +
    summary.daysMetGoal +
    " 天\n" +
    "> - 📊 总得分：" +
    totalSign +
    summary.totalScore +
    " 分 · 日均 " +
    avgSign +
    summary.avgScore +
    " 分\n"
  );
}

function renderCategoryRows(items: ScoreItem[], report: DayReport): string {
  let rows = "";
  for (const item of items) {
    const actual = report.scores[item.id] || 0;
    const isDeductItem = item.category === "减分" || item.points < 0;
    const status = renderScoreStatusIcon(actual);
    const defaultSign = item.points >= 0 ? "+" : "";
    const noteMarker = actual !== 0 && actual !== item.points ? " 📝" : "";
    rows +=
      "| " +
      item.emoji +
      " " +
      item.name +
      " | " +
      defaultSign +
      item.points +
      " | " +
      renderScoreCell(actual, isDeductItem) +
      noteMarker +
      " | " +
      status +
      " |\n";

  }
  return rows;
}

function renderScoreStatusIcon(score: number): string {
  if (score > 0) return "✅";
  if (score < 0) return "🔴";
  return "🔵";
}

function renderProgressBar(pct: number): string {
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  return "`" + "█".repeat(filled) + "░".repeat(empty) + " " + pct + "%`";
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function renderScoreCell(actual: number, isDeduct: boolean): string {
  const sign = actual >= 0 ? "+" : "";
  const color = isDeduct ? "#dc2626" : "#16a34a";
  return (
    '<span style="color:' + color + ';font-weight:600">' + sign + actual + "</span>"
  );
}

import type { CustomScoreItem, DayReport, ScoreItem } from "../types";
import { toYamlInline } from "../utils/yaml";

export function buildFrontmatter(report: DayReport): string {
  const scoresYaml = report.items
    .map((item) => "  " + item.id + ": " + (report.scores[item.id] || 0))
    .join("\n");

  let customYaml = "";
  if (report.customItems.length > 0) {
    customYaml =
      "\ncustomItems:\n" +
      report.customItems
        .map(
          (item) =>
            "  - " + toYamlInline(item.emoji + "|" + item.name + "|" + item.points)
        )
        .join("\n");
  }

  return (
    "---\n" +
    "date: " +
    report.dateStr +
    "\n" +
    "child: " +
    report.childName +
    "\n" +
    "total: " +
    report.total +
    "\n" +
    "scores:\n" +
    scoresYaml +
    customYaml +
    "\n" +
    "---\n\n"
  );
}

export function buildSummaryCallout(report: DayReport): string {
  const totalSign = report.total >= 0 ? "+" : "";
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
    "> - ✅ 完成项目：**" +
    report.earnedCount +
    "/" +
    report.totalItems +
    " (" +
    report.completionRate +
    "%)**\n" +
    "> - ➕ 加分项：" +
    report.positiveCount +
    " 项\n" +
    "> - ➖ 减分项：" +
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
    " 分 · 🏁 连续 " +
    report.streak +
    " 天\n";
  return summary;
}

export function buildGoalCallout(report: DayReport): string {
  const dailyGoal = 10;
  const goalPct = Math.min(
    100,
    Math.round((report.earnedCount / dailyGoal) * 100)
  );
  return (
    "> [!tip] 🎯 今日目标\n" +
    "> 完成项目 **" +
    report.earnedCount +
    "/" +
    dailyGoal +
    "** · " +
    renderProgressBar(goalPct) +
    "\n"
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

function renderCategoryRows(items: ScoreItem[], report: DayReport): string {
  let rows = "";
  for (const item of items) {
    const actual = report.scores[item.id] || 0;
    const isDeductItem = item.category === "减分" || item.points < 0;
    const status = isDeductItem
      ? actual !== 0
        ? "⭕"
        : "🔵"
      : actual > 0
        ? "✅"
        : "❌";
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

    if (report.hasYesterday && report.yesterdayData) {
      const yVal = report.yesterdayData.scores[item.id] || 0;
      const ySign = yVal >= 0 ? "+" : "";
      const yIcon = yVal > 0 ? "✅" : yVal < 0 ? "❌" : "—";
      rows += "> [!quote]- 昨日：" + item.name + " " + ySign + yVal + " 分 " + yIcon + "\n";
    }
  }
  return rows;
}

function renderProgressBar(pct: number): string {
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  return "`" + "█".repeat(filled) + "░".repeat(empty) + " " + pct + "%`";
}

function renderScoreCell(actual: number, isDeduct: boolean): string {
  const sign = actual >= 0 ? "+" : "";
  const color = isDeduct ? "#dc2626" : "#16a34a";
  return (
    '<span style="color:' + color + ';font-weight:600">' + sign + actual + "</span>"
  );
}

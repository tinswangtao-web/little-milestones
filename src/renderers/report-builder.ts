import { DayReport } from "../types";
import { toYamlInline } from "../utils/yaml";

export class MarkdownReportBuilder {
  build(report: DayReport): string {
    const {
      dateStr,
      childName,
      scores,
      customItems,
      diaryContent,
      total,
      earnedCount,
      missedCount,
      positiveCount,
      negativeCount,
      customTotal,
      totalItems,
      completionRate,
      grandTotal,
      grandDays,
      grandAvg,
      streak,
      hasYesterday,
      yesterdayData,
      tags,
      diet,
      items,
      categories,
    } = report;

    // ─── YAML frontmatter ───────────────────────────────────────────────────
    const scoresYaml = items
      .map((item) => "  " + item.id + ": " + (scores[item.id] || 0))
      .join("\n");

    let customYaml = "";
    if (customItems.length > 0) {
      customYaml =
        "\ncustomItems:\n" +
        customItems
          .map((ci) => "  - " + toYamlInline(ci.emoji + "|" + ci.name + "|" + ci.points))
          .join("\n");
    }

    let scoreDetailYaml =
      "\nscoreDetail:\n" +
      items
        .map((item) => {
          const v = scores[item.id] || 0;
          return "  " + toYamlInline(item.name) + ": " + v;
        })
        .join("\n");
    if (customItems.length > 0) {
      for (const ci of customItems) {
        scoreDetailYaml += "\n  " + toYamlInline("临时-" + ci.name) + ": " + ci.points;
      }
    }

    const summaryYaml =
      "\nsummary:\n" +
      "  earned: " + earnedCount + "\n" +
      "  missed: " + missedCount + "\n" +
      "  positiveCount: " + positiveCount + "\n" +
      "  negativeCount: " + negativeCount + "\n" +
      "  customCount: " + customItems.length + "\n" +
      "  customTotal: " + customTotal + "\n" +
      "  cumulativeTotal: " + grandTotal + "\n" +
      "  cumulativeDays: " + grandDays + "\n" +
      "  cumulativeAvg: " + grandAvg + "\n" +
      "  streak: " + streak;

    let tagsYaml = "\ntags:";
    if (tags.weather) tagsYaml += "\n  weather: " + toYamlInline(tags.weather);
    if (tags.mood) tagsYaml += "\n  mood: " + toYamlInline(tags.mood);
    if (tags.homeCook) tagsYaml += "\n  homeCook: " + toYamlInline(tags.homeCook);
    if (tags.exercise) tagsYaml += "\n  exercise: " + toYamlInline(tags.exercise);
    if (tags.sleep) tagsYaml += "\n  sleep: " + toYamlInline(tags.sleep);
    tagsYaml += "\n  hasDiary: " + tags.hasDiary;

    let dietYaml = "";
    if (diet.breakfast || diet.lunch || diet.dinner) {
      dietYaml = "\ndiet:";
      if (diet.breakfast) dietYaml += "\n  breakfast: " + toYamlInline(diet.breakfast);
      if (diet.lunch) dietYaml += "\n  lunch: " + toYamlInline(diet.lunch);
      if (diet.dinner) dietYaml += "\n  dinner: " + toYamlInline(diet.dinner);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────
    const totalSign = total >= 0 ? "+" : "";
    const grandSign = grandTotal >= 0 ? "+" : "";

    const renderProgressBar = (pct: number) => {
      const filled = Math.round(pct / 5);
      const empty = 20 - filled;
      return "`" + "█".repeat(filled) + "░".repeat(empty) + " " + pct + "%`";
    };

    const renderScoreCell = (actual: number, isDeduct: boolean) => {
      const sign = actual >= 0 ? "+" : "";
      const color = isDeduct ? "#dc2626" : "#16a34a";
      return '<span style="color:' + color + ';font-weight:600">' + sign + actual + "</span>";
    };

    // ─── Callout: Summary ───────────────────────────────────────────────────
    let summaryCallout =
      "> [!summary] 📊 今日汇总\n" +
      "> - 🏆 今日总分：**" + totalSign + total + " 分**\n";
    if (hasYesterday && yesterdayData) {
      const yTotalSign = yesterdayData.total >= 0 ? "+" : "";
      summaryCallout += "> - 📅 昨日总分：" + yTotalSign + yesterdayData.total + " 分\n";
    }
    summaryCallout +=
      "> - ✅ 完成项目：**" + earnedCount + "/" + totalItems + " (" + completionRate + "%)**\n" +
      "> - ➕ 加分项：" + positiveCount + " 项\n" +
      "> - ➖ 减分项：" + negativeCount + " 项\n" +
      "> - 📌 临时事项：" + customItems.length + " 项 (" + (customTotal >= 0 ? "+" : "") + customTotal + " 分)\n" +
      "> - 📈 累计总分：" + grandSign + grandTotal + " 分 · 📅 累计 " + grandDays + " 天 · 📊 日均 " + grandAvg + " 分 · 🏁 连续 " + streak + " 天\n";

    // ─── Callout: Goal ──────────────────────────────────────────────────────
    const dailyGoal = 10; // placeholder, will be wired from settings in future
    const goalPct = Math.min(100, Math.round((earnedCount / dailyGoal) * 100));
    const goalCallout =
      "> [!tip] 🎯 今日目标\n" +
      "> 完成项目 **" + earnedCount + "/" + dailyGoal + "** · " + renderProgressBar(goalPct) + "\n";

    // ─── Tables ─────────────────────────────────────────────────────────────
    const renderCategoryTable = (list: typeof items) => {
      let rows = "";
      for (const item of list) {
        const actual = scores[item.id] || 0;
        const isDeductItem = item.category === "减分" || item.points < 0;
        const status = isDeductItem
          ? actual !== 0 ? "⭕" : "🔵"
          : actual > 0 ? "✅" : "❌";
        const dSign = item.points >= 0 ? "+" : "";
        const cn = actual !== 0 && actual !== item.points ? " 📝" : "";
        rows +=
          "| " + item.emoji + " " + item.name +
          " | " + dSign + item.points +
          " | " + renderScoreCell(actual, isDeductItem) + cn +
          " | " + status + " |\n";

        if (hasYesterday && yesterdayData) {
          const yVal = yesterdayData.scores[item.id] || 0;
          const ySign = yVal >= 0 ? "+" : "";
          const yIcon = yVal > 0 ? "✅" : yVal < 0 ? "❌" : "—";
          rows +=
            "> [!quote]- 昨日：" + item.name + " " + ySign + yVal + " 分 " + yIcon + "\n";
        }
      }
      return rows;
    };

    let tableContent = "";
    for (const cat of categories) {
      const catItems = items.filter((it) => it.category === cat);
      if (catItems.length > 0) {
        tableContent +=
          "\n### " + cat + "\n\n" +
          "| 项目 | 默认 | 得分 | 状态 |\n|:---|---:|---:|:---:|\n" +
          renderCategoryTable(catItems) +
          "\n";
      }
    }
    const uncatItems = items.filter(
      (it) => !it.category || categories.indexOf(it.category) === -1
    );
    if (uncatItems.length > 0) {
      tableContent +=
        "\n### 其他\n\n" +
        "| 项目 | 默认 | 得分 | 状态 |\n|:---|---:|---:|:---:|\n" +
        renderCategoryTable(uncatItems) +
        "\n";
    }

    // ─── Callout: Custom items ──────────────────────────────────────────────
    let customCallout = "";
    if (customItems.length > 0) {
      const hasCustomNotes = customItems.some((ci) => ci.note && ci.note.trim());
      customCallout =
        "\n> [!info] 📌 临时事项（" + customItems.length + " 项，" + (customTotal >= 0 ? "+" : "") + customTotal + " 分）\n";
      if (hasCustomNotes) {
        customCallout +=
          "> | 事项 | 得分 | 备注 |\n" +
          "> |:---|---:|:---|\n";
        for (const ci of customItems) {
          customCallout +=
            "> | " + ci.emoji + " " + ci.name +
            " | " + (ci.points >= 0 ? "+" : "") + ci.points +
            " | " + (ci.note || "") + " |\n";
        }
      } else {
        customCallout +=
          "> | 事项 | 得分 |\n" +
          "> |:---|---:|\n";
        for (const ci of customItems) {
          customCallout +=
            "> | " + ci.emoji + " " + ci.name +
            " | " + (ci.points >= 0 ? "+" : "") + ci.points + " |\n";
        }
      }
      customCallout += "\n";
    }

    // ─── Assemble ───────────────────────────────────────────────────────────
    const fileContent =
      "---\n" +
      "date: " + dateStr + "\n" +
      "child: " + childName + "\n" +
      "total: " + total + "\n" +
      "scores:\n" + scoresYaml + customYaml + "\n" +
      "---\n\n" +
      "# 📋 " + dateStr + " " + childName + "的每日记录\n\n" +
      summaryCallout + "\n" +
      goalCallout + "\n" +
      "---\n" + tableContent + customCallout + "---\n\n" +
      "## 📝 今日日记\n\n" + (diaryContent || "") + "\n";

    return fileContent;
  }
}

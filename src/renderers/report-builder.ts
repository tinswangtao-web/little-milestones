import { DayReport } from "../types";
import {
  buildCategoryTables,
  buildCustomItemsCallout,
  buildFrontmatter,
  buildGoalCallout,
  buildSummaryCallout,
} from "./report-sections";

export class MarkdownReportBuilder {
  build(report: DayReport): string {
    return (
      buildFrontmatter(report) +
      "# 📋 " +
      report.dateStr +
      " " +
      report.childName +
      "的每日记录\n\n" +
      buildSummaryCallout(report) +
      "\n" +
      buildGoalCallout(report) +
      "\n" +
      "---\n" +
      buildCategoryTables(report) +
      buildCustomItemsCallout(report.customItems) +
      "---\n\n" +
      "## 📝 今日日记\n\n" +
      (report.diaryContent || "") +
      "\n"
    );
  }
}

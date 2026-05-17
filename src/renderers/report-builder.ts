import { DayReport } from "../types";
import { composeDiaryCommentContent } from "../diary/modules";
import {
  buildCategoryTables,
  buildCustomItemsCallout,
  buildFrontmatter,
  buildGoalCallout,
  buildSummaryCallout,
  buildWeeklySummary,
  buildMonthlySummary,
} from "./report-sections";
import { USER_CONTENT_BOUNDARY_WRITE } from "../constants";

export class MarkdownReportBuilder {
  build(report: DayReport): string {
    const diaryComment = composeDiaryCommentContent(report.diaryModules || {});
    const commentSection = diaryComment ? "\n\n## 💬 评语\n\n" + diaryComment + "\n" : "\n";

    let sections =
      buildFrontmatter(report) +
      "# 📋 " +
      report.dateStr +
      " " +
      report.childName +
      "的每日记录\n\n" +
      buildSummaryCallout(report) +
      "\n" +
      buildGoalCallout(report) +
      "\n";

    if (report.weeklySummary) {
      sections += buildWeeklySummary(report.weeklySummary) + "\n";
    }
    if (report.monthlySummary) {
      sections += buildMonthlySummary(report.monthlySummary) + "\n";
    }

    sections +=
      "---\n" +
      buildCategoryTables(report) +
      buildCustomItemsCallout(report.customItems) +
      "---\n\n" +
      "> 字数（不含评语）：**" +
      report.diaryCharacterCount +
      " 字**\n\n" +
      "## 📝 今日日记\n\n" +
      (report.diaryContent || "") +
      commentSection;

    sections += USER_CONTENT_BOUNDARY_WRITE;

    return sections;
  }
}

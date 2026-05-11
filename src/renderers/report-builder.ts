import { DayReport } from "../types";
import { composeDiaryCommentContent } from "../diary/modules";
import {
  buildCategoryTables,
  buildCustomItemsCallout,
  buildFrontmatter,
  buildGoalCallout,
  buildSummaryCallout,
} from "./report-sections";

export class MarkdownReportBuilder {
  build(report: DayReport): string {
    const diaryComment = composeDiaryCommentContent(report.diaryModules || {});
    const commentSection = diaryComment ? "\n\n## 💬 评语\n\n" + diaryComment + "\n" : "\n";

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
      "> 字数（不含评语）：**" +
      report.diaryCharacterCount +
      " 字**\n\n" +
      "## 📝 今日日记\n\n" +
      (report.diaryContent || "") +
      commentSection
    );
  }
}

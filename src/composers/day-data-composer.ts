import type { DayData, DayReport, ScoreItem, CustomScoreItem } from "../types";
import type KidScorePlugin from "../main";

export class DayDataComposer {
  constructor(private plugin: KidScorePlugin) {}

  async compose(
    dateStr: string,
    scores: Record<string, number>,
    customItems: CustomScoreItem[],
    diaryContent: string
  ): Promise<DayReport> {
    const items = this.plugin.currentUser.items;
    const childName = this.plugin.currentUser.name;

    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() - 1);
    const yesterdayStr = d.toISOString().slice(0, 10);
    const yesterdayData = await this.plugin.readDayData(yesterdayStr);

    let total = 0;
    let earnedCount = 0;
    let missedCount = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    for (const item of items) {
      const val = scores[item.id] || 0;
      total += val;
      const isDeduct = item.category === "减分" || item.points < 0;
      if (isDeduct) {
        if (val !== 0) {
          earnedCount++;
          negativeCount++;
        } else {
          missedCount++;
        }
      } else {
        if (val > 0) {
          earnedCount++;
          positiveCount++;
        } else {
          missedCount++;
        }
      }
    }

    let customTotal = 0;
    for (const ci of customItems) {
      customTotal += ci.points;
    }
    total += customTotal;

    const allScores = await this.plugin.getAllScores();
    let cumulativeTotal = 0;
    let cumulativeDays = 0;
    for (const s of allScores) {
      if (s.date !== dateStr) {
        cumulativeTotal += s.total;
        cumulativeDays++;
      }
    }
    const grandTotal = cumulativeTotal + total;
    const grandDays = cumulativeDays + 1;
    const grandAvg = grandDays > 0 ? Math.round((grandTotal / grandDays) * 10) / 10 : 0;

    let streak = 0;
    const sortedScores = [...allScores].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    for (const s of sortedScores) {
      if (s.total > 0) streak++;
      else break;
    }
    if (total > 0) streak++;

    const diaryText = diaryContent || "";
    const weatherMatch = diaryText.match(/天气：\s*(.+)/);
    const moodMatch = diaryText.match(/心情：\s*(.+)/);
    const breakfastMatch = diaryText.match(/早餐：\s*(.+)/);
    const lunchMatch = diaryText.match(/午餐：\s*(.+)/);
    const dinnerMatch = diaryText.match(/晚餐：\s*(.+)/);
    const homeCookMatch = diaryText.match(/在家做饭：\s*(.+)/);
    const exerciseMatch = diaryText.match(/运动项目：\s*(.+)/);
    const sleepMatch = diaryText.match(/睡眠情况：\s*(.+)/);

    return {
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
      totalItems: items.length,
      completionRate: items.length > 0 ? Math.round((earnedCount / items.length) * 100) : 0,
      grandTotal,
      grandDays,
      grandAvg,
      streak,
      hasYesterday: !!yesterdayData,
      yesterdayData,
      tags: {
        weather: weatherMatch ? weatherMatch[1].trim() : undefined,
        mood: moodMatch ? moodMatch[1].trim() : undefined,
        homeCook: homeCookMatch ? homeCookMatch[1].trim() : undefined,
        exercise: exerciseMatch ? exerciseMatch[1].trim() : undefined,
        sleep: sleepMatch ? sleepMatch[1].trim() : undefined,
        hasDiary: diaryText.trim().length > 0,
      },
      diet: {
        breakfast: breakfastMatch ? breakfastMatch[1].trim() : undefined,
        lunch: lunchMatch ? lunchMatch[1].trim() : undefined,
        dinner: dinnerMatch ? dinnerMatch[1].trim() : undefined,
      },
      items,
      categories: this.plugin.currentUser.categories || [],
    };
  }
}

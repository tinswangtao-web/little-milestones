import { makeDefaultDiaryModules } from "../../constants";
import { parseDiaryModules } from "../../diary/modules";
import type { CustomScoreItem, DayData, DiaryModuleValues } from "../../types";
import type KidScorePlugin from "../../main";

export interface DailyModalStateSnapshot {
  yesterdayData: DayData | null;
  allScores: DayData[];
  scores: Record<string, number>;
  customItems: CustomScoreItem[];
  diaryContent: string;
  diaryModules: DiaryModuleValues;
}

export async function loadDailyModalState(
  plugin: KidScorePlugin,
  dateStr: string
): Promise<DailyModalStateSnapshot> {
  const yesterday = new Date(dateStr + "T00:00:00");
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const existingToday = await plugin.readDayData(dateStr);
  const yesterdayData = await plugin.readDayData(yesterdayStr);
  const allScores = await plugin.getAllScores();

  const scores: Record<string, number> = {};
  for (const item of plugin.currentUser.items) {
    if (existingToday && existingToday.scores[item.id] !== undefined) {
      scores[item.id] = existingToday.scores[item.id];
    } else {
      scores[item.id] = 0;
    }
  }

  const customItems = existingToday?.customItems || [];
  const diaryContent = existingToday?.diaryContent || "";
  const moduleConfig =
    plugin.currentUser.diaryModules && plugin.currentUser.diaryModules.length
      ? plugin.currentUser.diaryModules
      : makeDefaultDiaryModules();
  const diaryModules = diaryContent ? parseDiaryModules(diaryContent, moduleConfig) : {};

  return {
    yesterdayData,
    allScores,
    scores,
    customItems,
    diaryContent,
    diaryModules,
  };
}

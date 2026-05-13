import type { CustomScoreItem, DayData, DiaryModuleValues } from "../../types";
import type KidScorePlugin from "../../main";
import { shiftDateString } from "../../utils/date";

export interface DailyModalStateSnapshot {
  hasExistingRecord: boolean;
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
  const yesterdayStr = shiftDateString(dateStr, -1);
  const hasExistingRecord = plugin.getDayFile(dateStr) !== null;

  const existingToday = await plugin.readDayData(dateStr, { preferFreshRead: true });
  const yesterdayData = await plugin.readDayData(yesterdayStr, { preferFreshRead: true });
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
  const diaryModules = existingToday?.diaryModules || {};

  return {
    hasExistingRecord,
    yesterdayData,
    allScores,
    scores,
    customItems,
    diaryContent,
    diaryModules,
  };
}

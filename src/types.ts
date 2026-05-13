export interface ScoreItem {
  id: string;
  name: string;
  emoji: string;
  points: number;
  category: string;
  note?: string;
}

export interface CustomScoreItem {
  id: string;
  name: string;
  emoji: string;
  points: number;
  note?: string;
}

export interface UserGoals {
  daily: number;
  weekly: number;
  monthly: number;
}

export type DiaryModuleKind = "quick" | "multi";

export interface DiaryModuleDefinition {
  id: string;
  emoji?: string;
  label: string;
  placeholder: string;
  kind: DiaryModuleKind;
}

export interface DiaryModuleValues {
  [key: string]: string | undefined;
  freeWrite?: string;
}

export interface DiaryQuickPreset {
  emoji: string;
  label: string;
}

export interface User {
  id: string;
  name: string;
  savePath: string;
  items: ScoreItem[];
  categories: string[];
  scoringRules: string;
  diaryTemplate: string;
  diaryModules: DiaryModuleDefinition[];
  weatherPresets: DiaryQuickPreset[];
  moodPresets: DiaryQuickPreset[];
  goals: UserGoals;
}

export interface DayData {
  schemaVersion?: number;
  date: string;
  child: string;
  total: number;
  scores: Record<string, number>;
  customItems: CustomScoreItem[];
  diaryContent?: string;
  diaryModules?: DiaryModuleValues;
}

export interface DoubleTapThresholds {
  windows: number;
  mac: number;
  android: number;
  ios: number;
  fallback: number;
}

export interface PluginSettings {
  users: User[];
  currentUserId: string;
  doubleTapThresholds: DoubleTapThresholds;
}

export type MobilePlatform = "desktop" | "android" | "ios" | "mobile-other";

export type StatsPeriod = "week" | "month" | "all";

// ─── Report Types ───────────────────────────────────────────────────────────

export interface WeekSummary {
  weekStart: string;
  weekEnd: string;
  daysRecorded: number;
  daysMetGoal: number;
  totalScore: number;
  avgScore: number;
}

export interface MonthSummary {
  month: string;
  daysRecorded: number;
  daysMetGoal: number;
  totalScore: number;
  avgScore: number;
}

export interface DayReport {
  dateStr: string;
  childName: string;
  scores: Record<string, number>;
  customItems: CustomScoreItem[];
  diaryContent: string;
  diaryModules: DiaryModuleValues;
  diaryCharacterCount: number;
  goals: UserGoals;

  total: number;
  earnedCount: number;
  missedCount: number;
  positiveCount: number;
  negativeCount: number;
  customTotal: number;
  totalItems: number;
  completionRate: number;
  grandTotal: number;
  grandDays: number;
  grandAvg: number;
  streak: number;
  goalMet: boolean;
  weeklySummary?: WeekSummary;
  monthlySummary?: MonthSummary;

  hasYesterday: boolean;
  yesterdayData: DayData | null;

  tags: {
    weather?: string;
    mood?: string;
    homeCook?: string;
    exercise?: string;
    sleep?: string;
    hasDiary: boolean;
  };

  diet: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };

  items: ScoreItem[];
  categories: string[];
}

import type { PluginSettings, User, DiaryModuleDefinition, DiaryQuickPreset } from "./types";

export const DEFAULT_DIARY_TEMPLATE = `### 天气与心情
天气：
心情：

### 今日活动
地点：
活动：

### 饮食记录
早餐：
午餐：
晚餐：
零食/水果：
在家做饭：是/否
菜单：
评价：

### 运动与健康
运动项目：
运动时长：
睡眠情况：

### 学习与成长


### 其他记录

`;

export function makeDefaultDiaryModules(): DiaryModuleDefinition[] {
  return [
    {
      id: "weather",
      emoji: "☀️",
      label: "今天天气",
      placeholder: "选一个天气，也可以自己写",
      kind: "quick",
    },
    {
      id: "mood",
      emoji: "😊",
      label: "今天心情",
      placeholder: "选一个心情，也可以自己写",
      kind: "quick",
    },
    {
      id: "todayThing",
      emoji: "📝",
      label: "今天我做了...",
      placeholder: "例如：我上了数学课，还画了画",
      kind: "multi",
    },
    {
      id: "learnedThing",
      emoji: "🌱",
      label: "今天我学会了...",
      placeholder: "例如：我学会了写“春”字",
      kind: "multi",
    },
    {
      id: "happyThing",
      emoji: "🎉",
      label: "今天最开心的是...",
      placeholder: "例如：下课后我和同学一起玩",
      kind: "multi",
    },
    {
      id: "wantToSay",
      emoji: "💭",
      label: "我还想说...",
      placeholder: "可以写想对爸爸妈妈或自己说的话",
      kind: "multi",
    },
    {
      id: "comment",
      emoji: "💬",
      label: "评语",
      placeholder: "可以写今天的评语或反馈",
      kind: "multi",
    },
  ];
}

export function makeDefaultWeatherPresets(): DiaryQuickPreset[] {
  return [
    { emoji: "☀️", label: "晴" },
    { emoji: "⛅", label: "多云" },
    { emoji: "☁️", label: "阴" },
    { emoji: "🌦️", label: "小雨" },
    { emoji: "🌧️", label: "大雨" },
    { emoji: "⛈️", label: "雷雨" },
    { emoji: "🌀", label: "台风" },
    { emoji: "🌈", label: "彩虹" },
  ];
}

export function makeDefaultMoodPresets(): DiaryQuickPreset[] {
  return [
    { emoji: "😊", label: "开心" },
    { emoji: "😄", label: "兴奋" },
    { emoji: "😌", label: "平静" },
    { emoji: "😎", label: "很棒" },
    { emoji: "😮", label: "惊喜" },
    { emoji: "😢", label: "难过" },
    { emoji: "😠", label: "生气" },
    { emoji: "💪", label: "有力量" },
  ];
}

export function makeDefaultUser(): User {
  return {
    id: "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    name: "未命名",
    savePath: "Little Milestones/Daily Records",
    items: [],
    categories: ["加分项", "减分项"],
    scoringRules: "",
    diaryTemplate: DEFAULT_DIARY_TEMPLATE,
    diaryModules: makeDefaultDiaryModules(),
    weatherPresets: makeDefaultWeatherPresets(),
    moodPresets: makeDefaultMoodPresets(),
    goals: { daily: 10, weekly: 70, monthly: 300 },
  };
}

export const DEFAULT_SETTINGS: PluginSettings = {
  users: [],
  currentUserId: "",
  doubleTapThresholds: {
    windows: 220,
    mac: 240,
    android: 320,
    ios: 300,
    fallback: 260,
  },
};

export const DIARY_MARKER = "<!-- DIARY_START -->";

export { EMOJI_DATA, EMOJI_SEARCH } from "./data/emoji-data";

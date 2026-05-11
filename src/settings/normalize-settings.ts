import type { DiaryQuickPreset, PluginSettings, User } from "../types";
import {
  DEFAULT_DIARY_TEMPLATE,
  DEFAULT_SETTINGS,
  makeDefaultDiaryModules,
  makeDefaultMoodPresets,
  makeDefaultUser,
  makeDefaultWeatherPresets,
} from "../constants";

type LoadedSettings = Partial<PluginSettings> & {
  childName?: string;
  savePath?: string;
  items?: User["items"];
  categories?: string[];
  scoringRules?: string;
  diaryTemplate?: string;
  diaryModules?: User["diaryModules"];
  weatherPresets?: User["weatherPresets"];
  moodPresets?: User["moodPresets"];
};

export interface NormalizedSettingsResult {
  settings: PluginSettings;
  changed: boolean;
}

export function sanitizeDoubleTapThreshold(
  value: unknown,
  fallback: number
): number {
  const n = parseInt(String(value), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(120, Math.min(600, n));
}

export function normalizePluginSettings(
  loaded: unknown
): NormalizedSettingsResult {
  const data = ((loaded as LoadedSettings | null) || {}) as LoadedSettings;
  let changed = false;

  if (data.childName !== undefined && !data.users) {
    const user = makeDefaultUser();
    user.name = data.childName || "未命名";
    user.savePath = data.savePath || "Little Milestones/Daily Records";
    user.items = Array.isArray(data.items) ? data.items : [];
    user.categories =
      Array.isArray(data.categories) && data.categories.length
        ? data.categories
        : ["加分项", "减分项"];
    user.scoringRules = data.scoringRules || "";
    user.diaryTemplate = data.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
    user.diaryModules =
      Array.isArray(data.diaryModules) && data.diaryModules.length
        ? data.diaryModules
        : makeDefaultDiaryModules();
    ensureUserDefaults(user);
    return {
      settings: {
        users: [user],
        currentUserId: user.id,
        doubleTapThresholds: { ...DEFAULT_SETTINGS.doubleTapThresholds },
      },
      changed: true,
    };
  }

  const settings: PluginSettings = { ...DEFAULT_SETTINGS, ...data };
  const dt = {
    ...DEFAULT_SETTINGS.doubleTapThresholds,
    ...(settings.doubleTapThresholds || {}),
  };

  dt.windows = sanitizeDoubleTapThreshold(
    dt.windows,
    DEFAULT_SETTINGS.doubleTapThresholds.windows
  );
  dt.mac = sanitizeDoubleTapThreshold(
    dt.mac,
    DEFAULT_SETTINGS.doubleTapThresholds.mac
  );
  dt.android = sanitizeDoubleTapThreshold(
    dt.android,
    DEFAULT_SETTINGS.doubleTapThresholds.android
  );
  dt.ios = sanitizeDoubleTapThreshold(
    dt.ios,
    DEFAULT_SETTINGS.doubleTapThresholds.ios
  );
  dt.fallback = sanitizeDoubleTapThreshold(
    dt.fallback,
    DEFAULT_SETTINGS.doubleTapThresholds.fallback
  );
  settings.doubleTapThresholds = dt;

  if (!settings.users || !settings.users.length) {
    const user = makeDefaultUser();
    settings.users = [user];
    settings.currentUserId = user.id;
    changed = true;
  } else {
    for (const user of settings.users) {
      changed = ensureUserDefaults(user) || changed;
    }
    if (
      !settings.currentUserId ||
      !settings.users.find((user) => user.id === settings.currentUserId)
    ) {
      settings.currentUserId = settings.users[0].id;
      changed = true;
    }
  }

  return { settings, changed };
}

function ensureUserDefaults(user: User): boolean {
  let changed = false;
  const defaultDiaryModules = makeDefaultDiaryModules();

  if (!user.id) {
    user.id =
      "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    changed = true;
  }
  if (!user.name) {
    user.name = "未命名";
    changed = true;
  }
  if (!user.savePath || !String(user.savePath).trim()) {
    user.savePath = "Little Milestones/Daily Records";
    changed = true;
  }
  if (!Array.isArray(user.items)) {
    user.items = [];
    changed = true;
  }
  if (!Array.isArray(user.categories) || !user.categories.length) {
    user.categories = ["加分项", "减分项"];
    changed = true;
  }
  if (typeof user.scoringRules !== "string") {
    user.scoringRules = "";
    changed = true;
  }
  if (!user.diaryTemplate) {
    user.diaryTemplate = DEFAULT_DIARY_TEMPLATE;
    changed = true;
  }
  if (!Array.isArray(user.diaryModules) || user.diaryModules.length === 0) {
    user.diaryModules = defaultDiaryModules;
    changed = true;
  } else {
    user.diaryModules = user.diaryModules.map((moduleDef, index) => {
      const fallback = defaultDiaryModules[index];
      const next = {
        ...moduleDef,
        emoji:
          typeof moduleDef.emoji === "string" && moduleDef.emoji.trim()
            ? moduleDef.emoji
            : fallback?.emoji || "📝",
      };
      if (next.emoji !== moduleDef.emoji) changed = true;
      return next;
    });
  }
  const normalizedWeatherPresets = normalizeWeatherPresets(
    user.weatherPresets,
    makeDefaultWeatherPresets()
  );
  if (normalizedWeatherPresets.changed) changed = true;
  user.weatherPresets = normalizedWeatherPresets.presets;

  const normalizedMoodPresets = normalizeQuickPresets(
    user.moodPresets,
    makeDefaultMoodPresets()
  );
  if (normalizedMoodPresets.changed) changed = true;
  user.moodPresets = normalizedMoodPresets.presets;

  if (!user.goals) {
    user.goals = { daily: 10, weekly: 70, monthly: 300 };
    changed = true;
  }
  for (const item of user.items) {
    if (!item.category) {
      item.category =
        item.points >= 0 ? user.categories[0] : user.categories[1] || user.categories[0];
      changed = true;
    }
  }

  return changed;
}

const LEGACY_WEATHER_DEFAULT_LABELS = new Set([
  "晴",
  "晴转多云",
  "多云",
  "阴",
  "雨",
  "雷雨",
  "雪",
  "有风",
  "雾",
  "彩虹",
]);

function normalizeWeatherPresets(
  value: DiaryQuickPreset[] | undefined,
  defaults: DiaryQuickPreset[]
): { presets: DiaryQuickPreset[]; changed: boolean } {
  if (isLegacyDefaultWeatherPresetSet(value)) {
    return { presets: defaults.map((preset) => ({ ...preset })), changed: true };
  }
  return normalizeQuickPresets(value, defaults);
}

function isLegacyDefaultWeatherPresetSet(
  value: DiaryQuickPreset[] | undefined
): boolean {
  if (!Array.isArray(value) || value.length === 0) return false;
  const labels = value.map((preset) => String(preset?.label || "").trim());
  const legacyLabelCount = labels.filter((label) =>
    LEGACY_WEATHER_DEFAULT_LABELS.has(label)
  ).length;
  const hasSnow = labels.includes("雪");
  const hasLegacyOnlyLabel =
    labels.includes("晴转多云") || labels.includes("有风") || labels.includes("雾");

  return (
    hasSnow &&
    legacyLabelCount >= 6 &&
    (value.length > 8 || hasLegacyOnlyLabel)
  );
}

function normalizeQuickPresets(
  value: DiaryQuickPreset[] | undefined,
  defaults: DiaryQuickPreset[]
): { presets: DiaryQuickPreset[]; changed: boolean } {
  if (!Array.isArray(value) || value.length === 0) {
    return { presets: defaults.map((preset) => ({ ...preset })), changed: true };
  }

  let changed = value.length !== defaults.length;
  const next = defaults.map((fallback, index) => {
    const preset = value[index];
    const emoji =
      typeof preset?.emoji === "string" && preset.emoji.trim()
        ? preset.emoji.trim()
        : fallback.emoji;
    const label =
      typeof preset?.label === "string" && preset.label.trim()
        ? preset.label.trim()
        : fallback.label;
    if (!preset || emoji !== preset.emoji || label !== preset.label) {
      changed = true;
    }
    return { emoji, label };
  });

  return { presets: next, changed };
}

import type { PluginSettings, User } from "../types";
import {
  DEFAULT_DIARY_TEMPLATE,
  DEFAULT_SETTINGS,
  makeDefaultDiaryModules,
  makeDefaultUser,
} from "../constants";

type LoadedSettings = Partial<PluginSettings> & {
  childName?: string;
  savePath?: string;
  items?: User["items"];
  categories?: string[];
  scoringRules?: string;
  diaryTemplate?: string;
  diaryModules?: User["diaryModules"];
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
    user.name = data.childName || "小朋友";
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

  if (!user.id) {
    user.id =
      "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    changed = true;
  }
  if (!user.name) {
    user.name = "小朋友";
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
    user.diaryModules = makeDefaultDiaryModules();
    changed = true;
  }
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

import { Plugin, normalizePath } from "obsidian";
import type { PluginSettings, DayData, CustomScoreItem } from "./types";
import { DEFAULT_SETTINGS } from "./constants";
import { DailyScoringModal } from "./modals/daily-scoring-modal";
import { StatsModal } from "./modals/stats-modal";
import { KidScoreSettingTab } from "./settings/settings-tab";
import { normalizePluginSettings } from "./settings/normalize-settings";
import { DayDataStore } from "./storage/day-data-store";

export default class KidScorePlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;
  private readonly dayDataStore = new DayDataStore(this);

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon("star", "Little Milestones 🌱", () => {
      new DailyScoringModal(this.app, this).open();
    });

    this.addCommand({
      id: "open-daily-score",
      name: "打开今日打分",
      callback: () => new DailyScoringModal(this.app, this).open(),
    });

    this.addCommand({
      id: "view-stats",
      name: "查看打分统计",
      callback: () => new StatsModal(this.app, this).open(),
    });

    this.addSettingTab(new KidScoreSettingTab(this.app, this));
  }

  async loadSettings() {
    const { settings, changed } = normalizePluginSettings(await this.loadData());
    this.settings = settings;
    if (changed) await this.saveSettings();
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  sanitizeDoubleTapThreshold(value: unknown, fallback: number): number {
    const n = parseInt(String(value), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(120, Math.min(600, n));
  }

  detectPlatformKey(): string {
    const ua = (navigator.userAgent || "").toLowerCase();
    if (/android/.test(ua)) return "android";
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/macintosh|mac os x/.test(ua)) return "mac";
    if (/windows/.test(ua)) return "windows";
    return "fallback";
  }

  getDoubleTapThreshold(): number {
    const defaults = DEFAULT_SETTINGS.doubleTapThresholds;
    const cfg = this.settings.doubleTapThresholds || defaults;
    const key = this.detectPlatformKey();
    const fb = this.sanitizeDoubleTapThreshold(cfg.fallback, defaults.fallback);
    return this.sanitizeDoubleTapThreshold(
      (cfg as unknown as Record<string, number>)[key],
      fb
    );
  }

  get currentUser() {
    const cuid = this.settings.currentUserId;
    return (
      this.settings.users.find((u) => u.id === cuid) || this.settings.users[0]
    );
  }

  filePath(dateStr: string): string {
    return normalizePath(this.currentUser.savePath + "/" + dateStr + ".md");
  }

  async readDayData(dateStr: string): Promise<DayData | null> {
    return this.dayDataStore.readDayData(dateStr);
  }

  async saveDayData(
    dateStr: string,
    scores: Record<string, number>,
    customItems: CustomScoreItem[],
    diaryContent: string
  ) {
    await this.dayDataStore.saveDayData(
      dateStr,
      scores,
      customItems,
      diaryContent
    );
  }
  async renameUserInFiles(oldName: string, newName: string): Promise<void> {
    await this.dayDataStore.renameUserInFiles(oldName, newName);
  }

  async migrateSavePath(oldPath: string, newPath: string): Promise<void> {
    await this.dayDataStore.migrateSavePath(oldPath, newPath);
  }

  async getAllScores(): Promise<DayData[]> {
    return this.dayDataStore.getAllScores();
  }
}

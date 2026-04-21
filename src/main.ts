import { Plugin, normalizePath } from "obsidian";
import type { PluginSettings, DayData, CustomScoreItem } from "./types";
import { DEFAULT_SETTINGS } from "./constants";
import { DailyScoringModal } from "./modals/daily-scoring-modal";
import { StatsModal } from "./modals/stats-modal";
import { KidScoreSettingTab } from "./settings/settings-tab";
import { normalizePluginSettings } from "./settings/normalize-settings";
import { DayDataStore } from "./storage/day-data-store";
import { getPlatformKey } from "./utils/platform";

/*
 * MODULE_MAP — Quick reference for agents working on this codebase
 * ─────────────────────────────────────────────────────────────────
 * main.ts                  Plugin entry (KidScorePlugin), commands, ribbon icon
 * types.ts                 All TypeScript interfaces and types
 * constants.ts             DEFAULT_SETTINGS, emoji lists, diary module defaults
 *
 * modals/
 *   daily-scoring-modal.ts  Main scoring modal orchestrator
 *   stats-modal.ts          Statistics modal
 *   panels/                 UI panels rendered inside daily-scoring-modal
 *     modal-chrome.ts       Header, tabs, bottom action buttons
 *     score-panel.ts        Score grid + rules + banners container
 *     score-items-panel.ts  Score cards + custom items list rendering
 *     diary-panel.ts        Diary input + quick modules
 *     diary-panel-fields.ts Diary field widgets
 *     stats-panel.ts        Stats charts and tables
 *     rules-section.ts      Rules display/editor
 *   helpers/                Logic helpers for daily-scoring-modal
 *     daily-modal-actions.ts  Factory functions to open popups
 *     daily-modal-state.ts    Load/save modal state
 *     daily-total-display.ts  Total score banner rendering
 *     press-gesture.ts      Long-press / double-tap / single-tap gesture handler
 *   popups/                 Small modal popups
 *     score-item-modal.ts   Quick value adjust popup
 *     edit-item-modal.ts    Edit existing score item
 *     add-item-modal.ts     Add new score item to a category
 *     add-custom-modal.ts   Add one-off custom item
 *     edit-custom-modal.ts  Edit custom item
 *     quick-custom-modal.ts Quick adjust custom item points
 *     calendar-picker.ts    Date picker popup
 *     attach-file-modal.ts  Attachment / image insert helper
 *
 * settings/
 *   settings-tab.ts         Obsidian PluginSettingTab entry point
 *   content-sections.ts     Aggregates rules + diary template + diary modules
 *   user-settings-section.ts User list, add, switch, rename
 *   goal-settings-section.ts Daily/weekly/monthly goal inputs
 *   category-settings.ts    Category list management
 *   category-settings-list.ts Category row rendering
 *   item-settings.ts        Item list container (+ add/sort buttons)
 *   item-settings-list.ts   Individual item row rendering + drag-sort
 *   item-sorting.ts         Sort items by category order
 *   rules-settings-section.ts Rules textarea toggle
 *   diary-template-settings-section.ts Diary template editor
 *   diary-module-settings.ts Diary quick-module configuration
 *   import-export-settings.ts JSON import/export UI
 *   normalize-settings.ts   Settings migration / validation
 *
 * renderers/
 *   report-builder.ts       Assemble DayReport from DayData
 *   report-sections.ts      Markdown section generators
 *
 * storage/
 *   day-data-store.ts       Read/write DayData to vault files
 *
 * utils/
 *   platform.ts            🆕 Centralized platform detection (iOS/Android/touch)
 *   mobile-keyboard.ts      Modal keyboard avoidance (visualViewport based)
 *   mobile.ts              Modal drag gesture + keyboard setup re-export
 *   dom.ts                 Input focus helpers, overlay mount detection
 *   date.ts                Date formatting utilities
 *   yaml.ts                YAML frontmatter helpers
 *
 * ui/
 *   base-mobile-modal.ts    Abstract base class for all mobile-aware modals
 *   emoji-picker.ts         Emoji picker popup
 *   emoji-picker-search.ts  Emoji search/filter logic
 *
 * composers/
 *   day-data-composer.ts    Compose diary content from modules
 *
 * diary/
 *   modules.ts              Diary module value serialization
 *
 * data/
 *   emoji-data.ts           Hard-coded emoji list (was in constants.ts)
 */

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
    return getPlatformKey();
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

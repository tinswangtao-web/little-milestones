import { App, Notice, PluginSettingTab } from "obsidian";
import KidScorePlugin from "../main";
import { bindModalInputFocus, bindTouchScrollGuard } from "../utils/dom";
import { renderCategorySettings } from "./category-settings";
import { renderContentSettingsSections } from "./content-sections";
import { renderGoalSettingsSection } from "./goal-settings-section";
import { renderImportExportSettings } from "./import-export-settings";
import { renderItemSettings } from "./item-settings";
import { renderUserSettingsSection } from "./user-settings-section";
import { getMobilePlatform, isTouchDevice } from "../utils/platform";

export class KidScoreSettingTab extends PluginSettingTab {
  plugin: KidScorePlugin;
  private touchGuardCleanup: (() => void) | null = null;

  constructor(app: App, plugin: KidScorePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const self = this;
    const containerEl = this.containerEl;
    const isTouchLayout = getMobilePlatform() !== "desktop";
    containerEl.empty();
    containerEl.addClass("kid-score-settings");
    const bindSettingsInput = (input: HTMLElement | null) => {
      bindModalInputFocus(input, {
        manualTouchFocus: false,
        scrollOnIOSFocus: false,
      });
    };

    containerEl.createEl("h2", { text: "🌟 每日记录设置" });
    renderUserSettingsSection({
      app: self.plugin.app,
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      refresh: () => self.display(),
      isTouchLayout,
    });

    renderGoalSettingsSection({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      isTouchLayout,
    });

    renderContentSettingsSections({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      isTouchLayout,
    });

    renderCategorySettings({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      refreshItems: () => self.display(),
    });
    renderItemSettings({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      isTouchLayout,
    });

    renderImportExportSettings({
      plugin: self.plugin,
      containerEl,
      refresh: () => self.display(),
    });

    this.detachTouchScrollGuard();

    // ── Touch-scroll guard: prevent keyboard pop-up on accidental swipe ──
    if (isTouchDevice() && getMobilePlatform() !== "desktop") {
      this.touchGuardCleanup = bindTouchScrollGuard(containerEl, {
        releaseDelay: 120,
        moveThreshold: 18,
      });
    }
  }

  hide(): void {
    this.detachTouchScrollGuard();
    super.hide();
  }

  private detachTouchScrollGuard(): void {
    if (this.touchGuardCleanup) {
      this.touchGuardCleanup();
      this.touchGuardCleanup = null;
    }
  }
}

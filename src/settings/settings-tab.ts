import { App, Notice, PluginSettingTab } from "obsidian";
import KidScorePlugin from "../main";
import { bindModalInputFocus } from "../utils/dom";
import { renderCategorySettings } from "./category-settings";
import { renderContentSettingsSections } from "./content-sections";
import { renderGoalSettingsSection } from "./goal-settings-section";
import { renderImportExportSettings } from "./import-export-settings";
import { renderItemSettings } from "./item-settings";
import { renderUserSettingsSection } from "./user-settings-section";

export class KidScoreSettingTab extends PluginSettingTab {
  plugin: KidScorePlugin;

  constructor(app: App, plugin: KidScorePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const self = this;
    const containerEl = this.containerEl;
    containerEl.empty();
    containerEl.addClass("kid-score-settings");
    const bindSettingsInput = (input: HTMLElement | null) => {
      bindModalInputFocus(input, {
        manualTouchFocus: false,
        scrollOnIOSFocus: false,
      });
    };

    containerEl.createEl("h2", { text: "🌟 小朋友每日记录设置" });
    renderUserSettingsSection({
      app: self.plugin.app,
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      refresh: () => self.display(),
    });

    renderGoalSettingsSection({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
    });

    renderContentSettingsSections({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
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
    });

    renderImportExportSettings({
      plugin: self.plugin,
      containerEl,
      refresh: () => self.display(),
    });
  }
}

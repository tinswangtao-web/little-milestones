import type KidScorePlugin from "../main";
import { renderDiaryModuleSettingsSection } from "./diary-module-settings";
import { renderRulesSettingsSection } from "./rules-settings-section";

interface RenderContentSettingsSectionsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
}

export function renderContentSettingsSections({
  plugin,
  containerEl,
  bindSettingsInput,
}: RenderContentSettingsSectionsOptions) {
  renderRulesSettingsSection({
    plugin,
    containerEl,
    bindSettingsInput,
  });

  renderDiaryModuleSettingsSection({
    plugin,
    containerEl,
    bindSettingsInput,
  });
}

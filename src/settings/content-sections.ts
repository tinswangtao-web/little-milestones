import type KidScorePlugin from "../main";
import { renderDiaryModuleSettingsSection } from "./diary-module-settings";
import { renderDesktopSettingsSectionShell } from "./desktop-settings-shells";
import { renderMobileSettingsSectionShell } from "./mobile-settings-shells";
import { renderRulesSettingsSection } from "./rules-settings-section";

interface RenderContentSettingsSectionsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  isTouchLayout: boolean;
}

export function renderContentSettingsSections({
  plugin,
  containerEl,
  bindSettingsInput,
  isTouchLayout,
}: RenderContentSettingsSectionsOptions) {
  const shell = isTouchLayout
    ? renderMobileSettingsSectionShell(containerEl, "little-milestones-content-section", "🧱 内容设置")
    : renderDesktopSettingsSectionShell(containerEl, "little-milestones-content-section", "🧱 内容设置");

  renderRulesSettingsSection({
    plugin,
    containerEl: shell.body,
    bindSettingsInput,
  });

  renderDiaryModuleSettingsSection({
    plugin,
    containerEl: shell.body,
    bindSettingsInput,
  });
}

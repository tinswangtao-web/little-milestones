import { Notice } from "obsidian";
import type KidScorePlugin from "../main";
import { renderDesktopSettingsSectionShell } from "./desktop-settings-shells";
import { renderMobileSettingsSectionShell } from "./mobile-settings-shells";

interface RenderGoalSettingsSectionOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  isTouchLayout: boolean;
}

export function renderGoalSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput,
  isTouchLayout,
}: RenderGoalSettingsSectionOptions): void {
  const shell = isTouchLayout
    ? renderMobileSettingsSectionShell(
        containerEl,
        "kid-score-goals-section",
        "🎯 每日目标",
        "以最终得分为统计标准（含加分、减分和临时事项）"
      )
    : renderDesktopSettingsSectionShell(
        containerEl,
        "kid-score-goals-section",
        "🎯 每日目标",
        "以最终得分为统计标准（含加分、减分和临时事项）"
      );

  const goalsGrid = shell.body.createDiv({ cls: "kid-score-goals-grid" });
  const goalFields: Array<{ key: "daily" | "weekly" | "monthly"; label: string }> = [
    { key: "daily", label: "每日目标" },
    { key: "weekly", label: "每周目标" },
    { key: "monthly", label: "每月目标" },
  ];

  for (const goalField of goalFields) {
    const cell = goalsGrid.createDiv({ cls: "kid-score-goal-cell" });
    cell.createEl("label", { text: goalField.label });
    const input = cell.createEl("input", { cls: "kid-score-goal-input" });
    input.type = "number";
    input.min = "1";
    input.value = String(plugin.currentUser.goals[goalField.key] || 1);
    bindSettingsInput(input);
    input.onchange = async () => {
      const value = parseInt(input.value, 10);
      if (Number.isFinite(value) && value > 0) {
        plugin.currentUser.goals[goalField.key] = value;
        await plugin.saveSettings();
        new Notice("✅ " + goalField.label + "已更新为 " + value);
      }
    };
  }
}

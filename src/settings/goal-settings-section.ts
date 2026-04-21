import { Notice } from "obsidian";
import type KidScorePlugin from "../main";

interface RenderGoalSettingsSectionOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
}

export function renderGoalSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput,
}: RenderGoalSettingsSectionOptions): void {
  const goalsWrap = containerEl.createDiv({ cls: "kid-score-goals-section" });
  goalsWrap.createEl("h3", { text: "🎯 每日目标" });
  goalsWrap.createEl("p", {
    cls: "kid-score-hint",
    text: "以完成项目数为统计标准（含加分项、减分项和临时事项）",
  });

  const goalsGrid = goalsWrap.createDiv({ cls: "kid-score-goals-grid" });
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

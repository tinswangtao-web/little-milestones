import type { App, Component } from "obsidian";
import type { DayData, ScoreItem } from "../../types";
import type KidScorePlugin from "../../main";
import { renderRulesSection } from "./rules-section";
import { renderScoreCategorySections } from "./score-category-sections";

interface RenderScorePanelOptions {
  app: App;
  component: Component;
  plugin: KidScorePlugin;
  scorePanel: HTMLElement;
  yesterdayData: DayData | null;
  isTouchOptimizedMode: boolean;
  renderScoreCard: (item: ScoreItem, grid: HTMLElement, yesterdayData: DayData | null) => void;
  renderCustomItems: () => void;
  onAddItem: (category: string) => void;
  onAddCustom: () => void;
  onSetTotalDisplay: (element: HTMLElement) => void;
  onAfterRulesSaved: () => void;
}

export function renderScorePanel({
  app,
  component,
  plugin,
  scorePanel,
  yesterdayData,
  isTouchOptimizedMode,
  renderScoreCard,
  renderCustomItems,
  onAddItem,
  onAddCustom,
  onSetTotalDisplay,
  onAfterRulesSaved,
}: RenderScorePanelOptions) {
  if (plugin.currentUser.items.length === 0) {
    scorePanel.createEl("div", {
      cls: "kid-score-empty",
      text: "⚠️ 还没有设置打分项目，请先在插件设置中添加！",
    });
    return null;
  }

  renderRulesSection({
    app,
    component,
    plugin,
    container: scorePanel,
    onAfterRulesSaved,
  });

  if (yesterdayData) {
    const ySign = yesterdayData.total >= 0 ? "+" : "";
    scorePanel.createDiv({
      cls: "kid-score-yesterday-banner",
      text: "📊 昨天（" + yesterdayData.date + "）总分：" + ySign + yesterdayData.total + " 分",
    });
  }

  const itemsContainer = scorePanel.createDiv({ cls: "kid-score-items" });
  itemsContainer.createDiv({
    cls: "kid-score-hint",
    text: isTouchOptimizedMode
      ? "💡 点一下记分，长按或点右上角按钮调整分值"
      : "💡 下方打分项：点击打分 · 长按自定义分值",
  });
  const totalDisplay = scorePanel.createDiv({ cls: "kid-score-total-display" });
  onSetTotalDisplay(totalDisplay);

  const catRendered = renderScoreCategorySections({
    plugin,
    container: itemsContainer,
    yesterdayData,
    renderScoreCard,
    onAddItem,
  });

  if (catRendered) {
    itemsContainer.createEl("hr", { cls: "kid-score-divider" });
  }
  itemsContainer.createEl("h3", { text: "📌 临时事项", cls: "kid-score-section-title" });
  const customItemsContainer = itemsContainer.createDiv({ cls: "kid-score-custom-items" });
  renderCustomItems();
  const addCustomBtn = itemsContainer.createEl("button", {
    text: "＋ 添加临时加减分",
    cls: "kid-score-add-custom-btn",
  });
  addCustomBtn.onclick = () => onAddCustom();

  return { totalDisplay, customItemsContainer };
}

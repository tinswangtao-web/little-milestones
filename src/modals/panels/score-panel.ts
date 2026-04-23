import type { App, Component } from "obsidian";
import type { DayData, ScoreItem } from "../../types";
import type KidScorePlugin from "../../main";
import { renderRulesSection } from "./rules-section";
import { renderScoreCategorySections } from "./score-category-sections";
import { renderDesktopScorePanelLayout } from "./desktop-score-panel";
import { renderMobileScorePanelLayout } from "./mobile-score-panel";

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
    isTouchLayout: isTouchOptimizedMode,
  });

  if (yesterdayData) {
    const ySign = yesterdayData.total >= 0 ? "+" : "";
    scorePanel.createDiv({
      cls: "kid-score-yesterday-banner",
      text: "📊 昨天（" + yesterdayData.date + "）总分：" + ySign + yesterdayData.total + " 分",
    });
  }

  const layout = isTouchOptimizedMode
    ? renderMobileScorePanelLayout(scorePanel)
    : renderDesktopScorePanelLayout(scorePanel);
  layout.hint.setText(
    isTouchOptimizedMode
      ? "💡 点一下记分，长按或点右上角按钮调整分值"
      : "💡 下方打分项：点击打分 · 长按自定义分值"
  );
  onSetTotalDisplay(layout.totalDisplay);

  const catRendered = renderScoreCategorySections({
    plugin,
    container: layout.sections,
    yesterdayData,
    isTouchLayout: isTouchOptimizedMode,
    renderScoreCard,
    onAddItem,
  });

  if (catRendered) {
    layout.sections.createEl("hr", { cls: "kid-score-divider" });
  }
  layout.customSection.createEl("h3", {
    text: "📌 临时事项",
    cls: "kid-score-section-title",
  });
  renderCustomItems();
  const addCustomBtn = layout.customSection.createEl("button", {
    text: "＋ 添加临时加减分",
    cls: "kid-score-add-custom-btn",
  });
  addCustomBtn.onclick = () => onAddCustom();

  return {
    totalDisplay: layout.totalDisplay,
    customItemsContainer: layout.customItemsContainer,
  };
}

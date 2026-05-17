import type { DayData, ScoreItem } from "../../types";
import type KidScorePlugin from "../../main";
import { renderDesktopScoreCategoryLayout } from "./desktop-score-sections";
import { renderMobileScoreCategoryLayout } from "./mobile-score-sections";

interface RenderScoreCategorySectionsOptions {
  plugin: KidScorePlugin;
  container: HTMLElement;
  yesterdayData: DayData | null;
  isTouchLayout: boolean;
  renderScoreCard: (item: ScoreItem, grid: HTMLElement, yesterdayData: DayData | null) => void;
  onAddItem: (category: string) => void;
}

export function renderScoreCategorySections({
  plugin,
  container,
  yesterdayData,
  isTouchLayout,
  renderScoreCard,
  onAddItem,
}: RenderScoreCategorySectionsOptions): boolean {
  const categories = plugin.currentUser.categories || [];
  let catRendered = false;

  for (const category of categories) {
    const items = plugin.currentUser.items.filter((item) => item.category === category);
    if (items.length === 0) continue;
    if (catRendered) {
      container.createEl("hr", { cls: "little-milestones-divider" });
    }
    const layout = isTouchLayout
      ? renderMobileScoreCategoryLayout(container, true)
      : renderDesktopScoreCategoryLayout(container, true);
    layout.titleHost.createEl("h3", {
      text: category,
      cls: "little-milestones-section-title",
    });
    const addItemBtn = (layout.addButtonHost || layout.titleHost).createEl("button", {
      text: "+",
      cls: "little-milestones-add-item-btn",
    });
    addItemBtn.onclick = () => onAddItem(category);
    for (const item of items) {
      renderScoreCard(item, layout.grid, yesterdayData);
    }
    catRendered = true;
  }

  const uncategorized = plugin.currentUser.items.filter(
    (item) => !item.category || categories.indexOf(item.category) === -1
  );
  if (uncategorized.length > 0) {
    if (catRendered) {
      container.createEl("hr", { cls: "little-milestones-divider" });
    }
    const layout = isTouchLayout
      ? renderMobileScoreCategoryLayout(container, false)
      : renderDesktopScoreCategoryLayout(container, false);
    layout.titleHost.createEl("h3", { text: "其他", cls: "little-milestones-section-title" });
    for (const item of uncategorized) {
      renderScoreCard(item, layout.grid, yesterdayData);
    }
    catRendered = true;
  }

  return catRendered;
}

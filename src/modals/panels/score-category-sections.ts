import type { DayData, ScoreItem } from "../../types";
import type KidScorePlugin from "../../main";

interface RenderScoreCategorySectionsOptions {
  plugin: KidScorePlugin;
  container: HTMLElement;
  yesterdayData: DayData | null;
  renderScoreCard: (item: ScoreItem, grid: HTMLElement, yesterdayData: DayData | null) => void;
  onAddItem: (category: string) => void;
}

export function renderScoreCategorySections({
  plugin,
  container,
  yesterdayData,
  renderScoreCard,
  onAddItem,
}: RenderScoreCategorySectionsOptions): boolean {
  const categories = plugin.currentUser.categories || [];
  let catRendered = false;

  for (const category of categories) {
    const items = plugin.currentUser.items.filter((item) => item.category === category);
    if (items.length === 0) continue;
    if (catRendered) {
      container.createEl("hr", { cls: "kid-score-divider" });
    }
    const header = container.createDiv({ cls: "kid-score-cat-header" });
    header.createEl("h3", { text: category, cls: "kid-score-section-title" });
    const addItemBtn = header.createEl("button", {
      text: "+",
      cls: "kid-score-add-item-btn",
    });
    addItemBtn.onclick = () => onAddItem(category);
    const grid = container.createDiv({ cls: "kid-score-grid" });
    for (const item of items) {
      renderScoreCard(item, grid, yesterdayData);
    }
    catRendered = true;
  }

  const uncategorized = plugin.currentUser.items.filter(
    (item) => !item.category || categories.indexOf(item.category) === -1
  );
  if (uncategorized.length > 0) {
    if (catRendered) {
      container.createEl("hr", { cls: "kid-score-divider" });
    }
    container.createEl("h3", { text: "其他", cls: "kid-score-section-title" });
    const grid = container.createDiv({ cls: "kid-score-grid" });
    for (const item of uncategorized) {
      renderScoreCard(item, grid, yesterdayData);
    }
    catRendered = true;
  }

  return catRendered;
}

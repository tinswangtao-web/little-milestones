import type { ScorePanelLayoutRefs } from "./score-panel-layout";

export function renderMobileScorePanelLayout(scorePanel: HTMLElement): ScorePanelLayoutRefs {
  const itemsContainer = scorePanel.createDiv({
    cls: "little-milestones-items little-milestones-items-mobile",
  });
  const metaBar = itemsContainer.createDiv({
    cls: "little-milestones-meta-bar little-milestones-meta-bar-mobile",
  });
  const totalDisplay = metaBar.createDiv({
    cls: "little-milestones-total-display little-milestones-total-display-mobile",
  });
  const hint = metaBar.createDiv({
    cls: "little-milestones-hint little-milestones-hint-mobile",
  });
  const sections = itemsContainer.createDiv({
    cls: "little-milestones-sections little-milestones-sections-mobile",
  });
  const customSection = sections.createDiv({
    cls: "little-milestones-custom-section little-milestones-custom-section-mobile",
  });
  const customItemsContainer = customSection.createDiv({
    cls: "little-milestones-custom-items",
  });
  return {
    itemsContainer,
    metaBar,
    hint,
    totalDisplay,
    sections,
    customSection,
    customItemsContainer,
  };
}

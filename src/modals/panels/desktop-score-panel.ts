import type { ScorePanelLayoutRefs } from "./score-panel-layout";

export function renderDesktopScorePanelLayout(scorePanel: HTMLElement): ScorePanelLayoutRefs {
  const itemsContainer = scorePanel.createDiv({
    cls: "little-milestones-items little-milestones-items-desktop",
  });
  const metaBar = itemsContainer.createDiv({
    cls: "little-milestones-meta-bar little-milestones-meta-bar-desktop",
  });
  const hint = metaBar.createDiv({
    cls: "little-milestones-hint little-milestones-hint-desktop",
  });
  const totalDisplay = metaBar.createDiv({
    cls: "little-milestones-total-display little-milestones-total-display-desktop",
  });
  const sections = itemsContainer.createDiv({
    cls: "little-milestones-sections little-milestones-sections-desktop",
  });
  const customSection = sections.createDiv({
    cls: "little-milestones-custom-section little-milestones-custom-section-desktop",
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

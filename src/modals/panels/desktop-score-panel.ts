import type { ScorePanelLayoutRefs } from "./score-panel-layout";

export function renderDesktopScorePanelLayout(scorePanel: HTMLElement): ScorePanelLayoutRefs {
  const itemsContainer = scorePanel.createDiv({
    cls: "kid-score-items kid-score-items-desktop",
  });
  const metaBar = itemsContainer.createDiv({
    cls: "kid-score-meta-bar kid-score-meta-bar-desktop",
  });
  const hint = metaBar.createDiv({
    cls: "kid-score-hint kid-score-hint-desktop",
  });
  const totalDisplay = metaBar.createDiv({
    cls: "kid-score-total-display kid-score-total-display-desktop",
  });
  const sections = itemsContainer.createDiv({
    cls: "kid-score-sections kid-score-sections-desktop",
  });
  const customSection = sections.createDiv({
    cls: "kid-score-custom-section kid-score-custom-section-desktop",
  });
  const customItemsContainer = customSection.createDiv({
    cls: "kid-score-custom-items",
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

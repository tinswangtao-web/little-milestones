import type { ScorePanelLayoutRefs } from "./score-panel-layout";

export function renderMobileScorePanelLayout(scorePanel: HTMLElement): ScorePanelLayoutRefs {
  const itemsContainer = scorePanel.createDiv({
    cls: "kid-score-items kid-score-items-mobile",
  });
  const metaBar = itemsContainer.createDiv({
    cls: "kid-score-meta-bar kid-score-meta-bar-mobile",
  });
  const totalDisplay = metaBar.createDiv({
    cls: "kid-score-total-display kid-score-total-display-mobile",
  });
  const hint = metaBar.createDiv({
    cls: "kid-score-hint kid-score-hint-mobile",
  });
  const sections = itemsContainer.createDiv({
    cls: "kid-score-sections kid-score-sections-mobile",
  });
  const customSection = sections.createDiv({
    cls: "kid-score-custom-section kid-score-custom-section-mobile",
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

import type { ScoreCardLayoutRefs } from "./score-card-layout";

export function renderMobileScoreCardLayout(grid: HTMLElement, cardClassName: string): ScoreCardLayoutRefs {
  const card = grid.createDiv({
    cls: `little-milestones-card little-milestones-card-mobile ${cardClassName}`.trim(),
  });
  const content = card.createDiv({
    cls: "little-milestones-card-content little-milestones-card-content-mobile",
  });
  const emoji = content.createDiv({
    cls: "card-emoji card-emoji-mobile",
  });
  const name = content.createDiv({
    cls: "card-name card-name-mobile",
  });
  const noteHost = content.createDiv({
    cls: "card-note-host card-note-host-mobile",
  });
  const points = content.createDiv({
    cls: "card-points card-points-mobile",
  });
  const yesterday = content.createDiv({
    cls: "card-yesterday card-yesterday-mobile",
  });
  return { card, content, emoji, name, noteHost, points, yesterday };
}

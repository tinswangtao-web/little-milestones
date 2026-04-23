import type { ScoreCardLayoutRefs } from "./score-card-layout";

export function renderDesktopScoreCardLayout(grid: HTMLElement, cardClassName: string): ScoreCardLayoutRefs {
  const card = grid.createDiv({
    cls: `kid-score-card kid-score-card-desktop ${cardClassName}`.trim(),
  });
  const content = card.createDiv({
    cls: "kid-score-card-content kid-score-card-content-desktop",
  });
  const emoji = content.createDiv({
    cls: "card-emoji card-emoji-desktop",
  });
  const name = content.createDiv({
    cls: "card-name card-name-desktop",
  });
  const noteHost = content.createDiv({
    cls: "card-note-host card-note-host-desktop",
  });
  const points = content.createDiv({
    cls: "card-points card-points-desktop",
  });
  const yesterday = content.createDiv({
    cls: "card-yesterday card-yesterday-desktop",
  });
  return { card, content, emoji, name, noteHost, points, yesterday };
}

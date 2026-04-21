import type { ScoreItem } from "../types";

export function sortItemsByCategories(items: ScoreItem[], categories: string[]) {
  items.sort((a, b) => {
    let ai = categories.indexOf(a.category);
    if (ai === -1) ai = 9999;
    let bi = categories.indexOf(b.category);
    if (bi === -1) bi = 9999;
    return ai - bi;
  });
}

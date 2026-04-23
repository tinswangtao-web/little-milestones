import type { CustomItemRowLayoutRefs, ScoreCategoryLayoutRefs } from "./score-sections-layout";

export function renderDesktopScoreCategoryLayout(
  container: HTMLElement,
  withHeader: boolean
): ScoreCategoryLayoutRefs {
  const section = container.createDiv({
    cls: "kid-score-category-section kid-score-category-section-desktop",
  });
  let header: HTMLElement | null = null;
  let titleHost = section;
  let addButtonHost: HTMLElement | null = null;

  if (withHeader) {
    header = section.createDiv({
      cls: "kid-score-cat-header kid-score-cat-header-desktop",
    });
    titleHost = header.createDiv({
      cls: "kid-score-cat-title-host kid-score-cat-title-host-desktop",
    });
    addButtonHost = header.createDiv({
      cls: "kid-score-cat-action-host kid-score-cat-action-host-desktop",
    });
  }

  const grid = section.createDiv({
    cls: "kid-score-grid kid-score-grid-desktop",
  });
  return { section, header, titleHost, addButtonHost, grid };
}

export function renderDesktopCustomItemRowLayout(
  container: HTMLElement
): CustomItemRowLayoutRefs {
  const wrap = container.createDiv({
    cls: "kid-score-custom-wrap kid-score-custom-wrap-desktop",
  });
  const row = wrap.createDiv({
    cls: "kid-score-custom-row kid-score-custom-row-desktop",
  });
  const main = row.createDiv({
    cls: "kid-score-custom-main kid-score-custom-main-desktop",
  });
  return { wrap, row, main };
}

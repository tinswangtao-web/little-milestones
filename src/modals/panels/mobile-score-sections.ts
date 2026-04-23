import type { CustomItemRowLayoutRefs, ScoreCategoryLayoutRefs } from "./score-sections-layout";

export function renderMobileScoreCategoryLayout(
  container: HTMLElement,
  withHeader: boolean
): ScoreCategoryLayoutRefs {
  const section = container.createDiv({
    cls: "kid-score-category-section kid-score-category-section-mobile",
  });
  let header: HTMLElement | null = null;
  let titleHost = section;
  let addButtonHost: HTMLElement | null = null;

  if (withHeader) {
    header = section.createDiv({
      cls: "kid-score-cat-header kid-score-cat-header-mobile",
    });
    titleHost = header.createDiv({
      cls: "kid-score-cat-title-host kid-score-cat-title-host-mobile",
    });
    addButtonHost = header.createDiv({
      cls: "kid-score-cat-action-host kid-score-cat-action-host-mobile",
    });
  }

  const grid = section.createDiv({
    cls: "kid-score-grid kid-score-grid-mobile",
  });
  return { section, header, titleHost, addButtonHost, grid };
}

export function renderMobileCustomItemRowLayout(
  container: HTMLElement
): CustomItemRowLayoutRefs {
  const wrap = container.createDiv({
    cls: "kid-score-custom-wrap kid-score-custom-wrap-mobile",
  });
  const row = wrap.createDiv({
    cls: "kid-score-custom-row kid-score-custom-row-mobile",
  });
  const main = row.createDiv({
    cls: "kid-score-custom-main kid-score-custom-main-mobile",
  });
  return { wrap, row, main };
}

import type { CustomItemRowLayoutRefs, ScoreCategoryLayoutRefs } from "./score-sections-layout";

export function renderMobileScoreCategoryLayout(
  container: HTMLElement,
  withHeader: boolean
): ScoreCategoryLayoutRefs {
  const section = container.createDiv({
    cls: "little-milestones-category-section little-milestones-category-section-mobile",
  });
  let header: HTMLElement | null = null;
  let titleHost = section;
  let addButtonHost: HTMLElement | null = null;

  if (withHeader) {
    header = section.createDiv({
      cls: "little-milestones-cat-header little-milestones-cat-header-mobile",
    });
    titleHost = header.createDiv({
      cls: "little-milestones-cat-title-host little-milestones-cat-title-host-mobile",
    });
    addButtonHost = header.createDiv({
      cls: "little-milestones-cat-action-host little-milestones-cat-action-host-mobile",
    });
  }

  const grid = section.createDiv({
    cls: "little-milestones-grid little-milestones-grid-mobile",
  });
  return { section, header, titleHost, addButtonHost, grid };
}

export function renderMobileCustomItemRowLayout(
  container: HTMLElement
): CustomItemRowLayoutRefs {
  const wrap = container.createDiv({
    cls: "little-milestones-custom-wrap little-milestones-custom-wrap-mobile",
  });
  const row = wrap.createDiv({
    cls: "little-milestones-custom-row little-milestones-custom-row-mobile",
  });
  const main = row.createDiv({
    cls: "little-milestones-custom-main little-milestones-custom-main-mobile",
  });
  return { wrap, row, main };
}

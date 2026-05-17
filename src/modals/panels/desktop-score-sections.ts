import type { CustomItemRowLayoutRefs, ScoreCategoryLayoutRefs } from "./score-sections-layout";

export function renderDesktopScoreCategoryLayout(
  container: HTMLElement,
  withHeader: boolean
): ScoreCategoryLayoutRefs {
  const section = container.createDiv({
    cls: "little-milestones-category-section little-milestones-category-section-desktop",
  });
  let header: HTMLElement | null = null;
  let titleHost = section;
  let addButtonHost: HTMLElement | null = null;

  if (withHeader) {
    header = section.createDiv({
      cls: "little-milestones-cat-header little-milestones-cat-header-desktop",
    });
    titleHost = header.createDiv({
      cls: "little-milestones-cat-title-host little-milestones-cat-title-host-desktop",
    });
    addButtonHost = header.createDiv({
      cls: "little-milestones-cat-action-host little-milestones-cat-action-host-desktop",
    });
  }

  const grid = section.createDiv({
    cls: "little-milestones-grid little-milestones-grid-desktop",
  });
  return { section, header, titleHost, addButtonHost, grid };
}

export function renderDesktopCustomItemRowLayout(
  container: HTMLElement
): CustomItemRowLayoutRefs {
  const wrap = container.createDiv({
    cls: "little-milestones-custom-wrap little-milestones-custom-wrap-desktop",
  });
  const row = wrap.createDiv({
    cls: "little-milestones-custom-row little-milestones-custom-row-desktop",
  });
  const main = row.createDiv({
    cls: "little-milestones-custom-main little-milestones-custom-main-desktop",
  });
  return { wrap, row, main };
}

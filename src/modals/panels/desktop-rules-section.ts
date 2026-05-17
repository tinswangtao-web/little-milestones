import type { RulesSectionLayoutRefs } from "./rules-section-layout";

export function renderDesktopRulesSectionLayout(container: HTMLElement): RulesSectionLayoutRefs {
  const section = container.createDiv({
    cls: "little-milestones-rules-section little-milestones-rules-section-desktop",
  });
  const header = section.createDiv({
    cls: "little-milestones-rules-header little-milestones-rules-header-desktop",
  });
  const titleHost = header.createDiv({
    cls: "little-milestones-rules-title-host little-milestones-rules-title-host-desktop",
  });
  const actionHost = header.createDiv({
    cls: "little-milestones-rules-action-host little-milestones-rules-action-host-desktop",
  });
  const body = section.createDiv({
    cls: "little-milestones-rules-body little-milestones-rules-body-desktop",
  });
  const view = body.createDiv({
    cls: "little-milestones-rules-view little-milestones-rules-view-desktop",
  });
  const edit = body.createDiv({
    cls: "little-milestones-rules-edit little-milestones-rules-edit-desktop is-hidden",
  });
  return { section, header, titleHost, actionHost, body, view, edit };
}

import type { RulesSectionLayoutRefs } from "./rules-section-layout";

export function renderMobileRulesSectionLayout(container: HTMLElement): RulesSectionLayoutRefs {
  const section = container.createDiv({
    cls: "little-milestones-rules-section little-milestones-rules-section-mobile",
  });
  const header = section.createDiv({
    cls: "little-milestones-rules-header little-milestones-rules-header-mobile",
  });
  const titleHost = header.createDiv({
    cls: "little-milestones-rules-title-host little-milestones-rules-title-host-mobile",
  });
  const actionHost = header.createDiv({
    cls: "little-milestones-rules-action-host little-milestones-rules-action-host-mobile",
  });
  const body = section.createDiv({
    cls: "little-milestones-rules-body little-milestones-rules-body-mobile",
  });
  const view = body.createDiv({
    cls: "little-milestones-rules-view little-milestones-rules-view-mobile",
  });
  const edit = body.createDiv({
    cls: "little-milestones-rules-edit little-milestones-rules-edit-mobile is-hidden",
  });
  return { section, header, titleHost, actionHost, body, view, edit };
}

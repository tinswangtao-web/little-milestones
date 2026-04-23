import type { RulesSectionLayoutRefs } from "./rules-section-layout";

export function renderDesktopRulesSectionLayout(container: HTMLElement): RulesSectionLayoutRefs {
  const section = container.createDiv({
    cls: "kid-score-rules-section kid-score-rules-section-desktop",
  });
  const header = section.createDiv({
    cls: "kid-score-rules-header kid-score-rules-header-desktop",
  });
  const titleHost = header.createDiv({
    cls: "kid-score-rules-title-host kid-score-rules-title-host-desktop",
  });
  const actionHost = header.createDiv({
    cls: "kid-score-rules-action-host kid-score-rules-action-host-desktop",
  });
  const body = section.createDiv({
    cls: "kid-score-rules-body kid-score-rules-body-desktop",
  });
  const view = body.createDiv({
    cls: "kid-score-rules-view kid-score-rules-view-desktop",
  });
  const edit = body.createDiv({
    cls: "kid-score-rules-edit kid-score-rules-edit-desktop is-hidden",
  });
  return { section, header, titleHost, actionHost, body, view, edit };
}

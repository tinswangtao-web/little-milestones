import type { RulesSectionLayoutRefs } from "./rules-section-layout";

export function renderMobileRulesSectionLayout(container: HTMLElement): RulesSectionLayoutRefs {
  const section = container.createDiv({
    cls: "kid-score-rules-section kid-score-rules-section-mobile",
  });
  const header = section.createDiv({
    cls: "kid-score-rules-header kid-score-rules-header-mobile",
  });
  const titleHost = header.createDiv({
    cls: "kid-score-rules-title-host kid-score-rules-title-host-mobile",
  });
  const actionHost = header.createDiv({
    cls: "kid-score-rules-action-host kid-score-rules-action-host-mobile",
  });
  const body = section.createDiv({
    cls: "kid-score-rules-body kid-score-rules-body-mobile",
  });
  const view = body.createDiv({
    cls: "kid-score-rules-view kid-score-rules-view-mobile",
  });
  const edit = body.createDiv({
    cls: "kid-score-rules-edit kid-score-rules-edit-mobile is-hidden",
  });
  return { section, header, titleHost, actionHost, body, view, edit };
}

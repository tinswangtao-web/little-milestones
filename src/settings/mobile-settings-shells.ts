import type { SettingsSectionShellRefs } from "./settings-shell-layout";

export function renderMobileSettingsSectionShell(
  containerEl: HTMLElement,
  sectionClassName: string,
  titleText: string,
  hintText?: string
): SettingsSectionShellRefs {
  const section = containerEl.createDiv({
    cls: `kid-score-settings-section kid-score-settings-section-mobile ${sectionClassName}`.trim(),
  });
  const title = section.createEl("h3", { text: titleText });
  const hint = hintText
    ? section.createEl("p", {
        cls: "kid-score-hint",
        text: hintText,
      })
    : null;
  const body = section.createDiv({
    cls: "kid-score-settings-section-body kid-score-settings-section-body-mobile",
  });
  return { section, title, hint, body };
}

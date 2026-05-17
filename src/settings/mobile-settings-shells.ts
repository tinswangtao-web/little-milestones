import type { SettingsSectionShellRefs } from "./settings-shell-layout";

export function renderMobileSettingsSectionShell(
  containerEl: HTMLElement,
  sectionClassName: string,
  titleText: string,
  hintText?: string
): SettingsSectionShellRefs {
  const section = containerEl.createDiv({
    cls: `little-milestones-settings-section little-milestones-settings-section-mobile ${sectionClassName}`.trim(),
  });
  const title = section.createEl("h3", { text: titleText });
  const hint = hintText
    ? section.createEl("p", {
        cls: "little-milestones-hint",
        text: hintText,
      })
    : null;
  const body = section.createDiv({
    cls: "little-milestones-settings-section-body little-milestones-settings-section-body-mobile",
  });
  return { section, title, hint, body };
}

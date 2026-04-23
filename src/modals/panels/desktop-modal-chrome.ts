import type { BottomActionsLayoutRefs, DailyHeaderLayoutRefs } from "./modal-chrome-layout";

export function renderDesktopDailyHeaderLayout(
  containerEl: HTMLElement,
  title: string
): DailyHeaderLayoutRefs {
  const header = containerEl.createDiv({ cls: "kid-score-header kid-score-header-desktop" });
  header.createEl("h2", { text: title });
  const dateNav = header.createDiv({ cls: "kid-score-date-nav kid-score-date-nav-desktop" });
  const userSwitcher = containerEl.createDiv({
    cls: "kid-score-user-switcher kid-score-user-switcher-desktop",
  });
  return { header, dateNav, userSwitcher };
}

export function renderDesktopBottomActionsLayout(
  containerEl: HTMLElement
): BottomActionsLayoutRefs {
  const actions = containerEl.createDiv({ cls: "kid-score-actions kid-score-actions-desktop" });
  const previewBtn = actions.createEl("button", {
    text: "查看预览",
    cls: "kid-score-preview-btn",
  });
  const saveBtn = actions.createEl("button", {
    text: "💾 保存记录",
    cls: "mod-cta kid-score-save-btn",
  });
  const statsBtn = actions.createEl("button", {
    text: "📊 查看统计",
    cls: "kid-score-stats-btn",
  });
  return { actions, previewBtn, saveBtn, statsBtn };
}

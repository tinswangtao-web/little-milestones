import type { BottomActionsLayoutRefs, DailyHeaderLayoutRefs } from "./modal-chrome-layout";

export function renderMobileDailyHeaderLayout(
  containerEl: HTMLElement,
  title: string
): DailyHeaderLayoutRefs {
  const header = containerEl.createDiv({ cls: "kid-score-header kid-score-header-mobile" });
  header.createEl("h2", { text: title });
  const dateNav = header.createDiv({ cls: "kid-score-date-nav kid-score-date-nav-mobile" });
  const userSwitcher = containerEl.createDiv({
    cls: "kid-score-user-switcher kid-score-user-switcher-mobile",
  });
  return { header, dateNav, userSwitcher };
}

export function renderMobileBottomActionsLayout(
  containerEl: HTMLElement
): BottomActionsLayoutRefs {
  const actions = containerEl.createDiv({ cls: "kid-score-actions kid-score-actions-mobile" });
  const saveBtn = actions.createEl("button", {
    text: "💾 保存记录",
    cls: "mod-cta kid-score-save-btn",
  });
  const statsBtn = actions.createEl("button", {
    text: "📊 查看统计",
    cls: "kid-score-stats-btn",
  });
  return { actions, saveBtn, statsBtn };
}

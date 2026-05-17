import type { BottomActionsLayoutRefs, DailyHeaderLayoutRefs } from "./modal-chrome-layout";

export function renderDesktopDailyHeaderLayout(
  containerEl: HTMLElement,
  title: string
): DailyHeaderLayoutRefs {
  const header = containerEl.createDiv({ cls: "little-milestones-header little-milestones-header-desktop" });
  header.createEl("h2", { text: title });
  const dateNav = header.createDiv({ cls: "little-milestones-date-nav little-milestones-date-nav-desktop" });
  const userSwitcher = containerEl.createDiv({
    cls: "little-milestones-user-switcher little-milestones-user-switcher-desktop",
  });
  return { header, dateNav, userSwitcher };
}

export function renderDesktopBottomActionsLayout(
  containerEl: HTMLElement
): BottomActionsLayoutRefs {
  const actions = containerEl.createDiv({ cls: "little-milestones-actions little-milestones-actions-desktop" });
  const saveBtn = actions.createEl("button", {
    text: "💾 保存记录",
    cls: "mod-cta little-milestones-save-btn",
  });
  const statsBtn = actions.createEl("button", {
    text: "📊 查看统计",
    cls: "little-milestones-stats-btn",
  });
  return { actions, saveBtn, statsBtn };
}

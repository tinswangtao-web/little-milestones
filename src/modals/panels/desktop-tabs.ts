import type { MainTabsLayoutRefs } from "./tabs-layout";

export function renderDesktopMainTabsLayout(containerEl: HTMLElement): MainTabsLayoutRefs {
  const tabs = containerEl.createDiv({
    cls: "little-milestones-main-tabs little-milestones-main-tabs-desktop",
  });
  const scoreTab = tabs.createEl("button", {
    text: "⭐ 打分",
    cls: "little-milestones-main-tab little-milestones-main-tab-desktop is-active",
  });
  const diaryTab = tabs.createEl("button", {
    text: "📝 日记",
    cls: "little-milestones-main-tab little-milestones-main-tab-desktop",
  });
  const scorePanel = containerEl.createDiv({
    cls: "little-milestones-tab-panel little-milestones-tab-panel-desktop",
  });
  const diaryPanel = containerEl.createDiv({
    cls: "little-milestones-tab-panel little-milestones-tab-panel-desktop is-hidden",
  });
  return { tabs, scoreTab, diaryTab, scorePanel, diaryPanel };
}

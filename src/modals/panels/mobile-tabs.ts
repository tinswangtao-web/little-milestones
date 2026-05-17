import type { MainTabsLayoutRefs } from "./tabs-layout";

export function renderMobileMainTabsLayout(containerEl: HTMLElement): MainTabsLayoutRefs {
  const tabs = containerEl.createDiv({
    cls: "little-milestones-main-tabs little-milestones-main-tabs-mobile",
  });
  const scoreTab = tabs.createEl("button", {
    text: "⭐ 打分",
    cls: "little-milestones-main-tab little-milestones-main-tab-mobile is-active",
  });
  const diaryTab = tabs.createEl("button", {
    text: "📝 日记",
    cls: "little-milestones-main-tab little-milestones-main-tab-mobile",
  });
  const scorePanel = containerEl.createDiv({
    cls: "little-milestones-tab-panel little-milestones-tab-panel-mobile",
  });
  const diaryPanel = containerEl.createDiv({
    cls: "little-milestones-tab-panel little-milestones-tab-panel-mobile is-hidden",
  });
  return { tabs, scoreTab, diaryTab, scorePanel, diaryPanel };
}

import type { MainTabsLayoutRefs } from "./tabs-layout";

export function renderDesktopMainTabsLayout(containerEl: HTMLElement): MainTabsLayoutRefs {
  const tabs = containerEl.createDiv({
    cls: "kid-score-main-tabs kid-score-main-tabs-desktop",
  });
  const scoreTab = tabs.createEl("button", {
    text: "⭐ 打分",
    cls: "kid-score-main-tab kid-score-main-tab-desktop is-active",
  });
  const diaryTab = tabs.createEl("button", {
    text: "📝 日记",
    cls: "kid-score-main-tab kid-score-main-tab-desktop",
  });
  const scorePanel = containerEl.createDiv({
    cls: "kid-score-tab-panel kid-score-tab-panel-desktop",
  });
  const diaryPanel = containerEl.createDiv({
    cls: "kid-score-tab-panel kid-score-tab-panel-desktop is-hidden",
  });
  return { tabs, scoreTab, diaryTab, scorePanel, diaryPanel };
}

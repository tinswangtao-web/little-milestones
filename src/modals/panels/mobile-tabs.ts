import type { MainTabsLayoutRefs } from "./tabs-layout";

export function renderMobileMainTabsLayout(containerEl: HTMLElement): MainTabsLayoutRefs {
  const tabs = containerEl.createDiv({
    cls: "kid-score-main-tabs kid-score-main-tabs-mobile",
  });
  const scoreTab = tabs.createEl("button", {
    text: "⭐ 打分",
    cls: "kid-score-main-tab kid-score-main-tab-mobile is-active",
  });
  const diaryTab = tabs.createEl("button", {
    text: "📝 日记",
    cls: "kid-score-main-tab kid-score-main-tab-mobile",
  });
  const scorePanel = containerEl.createDiv({
    cls: "kid-score-tab-panel kid-score-tab-panel-mobile",
  });
  const diaryPanel = containerEl.createDiv({
    cls: "kid-score-tab-panel kid-score-tab-panel-mobile is-hidden",
  });
  return { tabs, scoreTab, diaryTab, scorePanel, diaryPanel };
}

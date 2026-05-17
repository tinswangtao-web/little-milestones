import { Notice } from "obsidian";
import type KidScorePlugin from "../../main";
import { formatDate } from "../../utils/date";
import { renderDesktopBottomActionsLayout, renderDesktopDailyHeaderLayout } from "./desktop-modal-chrome";
import { renderMobileBottomActionsLayout, renderMobileDailyHeaderLayout } from "./mobile-modal-chrome";
import { renderDesktopMainTabsLayout } from "./desktop-tabs";
import { renderMobileMainTabsLayout } from "./mobile-tabs";

interface RenderDailyHeaderOptions {
  containerEl: HTMLElement;
  plugin: KidScorePlugin;
  dateStr: string;
  allScores: Array<{ total: number }>;
  onPrevDay: () => void;
  onNextDay: () => void;
  onCalendar: () => void;
  onGoToday: () => void;
  onSwitchUser: (userId: string) => Promise<void>;
  isTouchLayout: boolean;
}

interface RenderTabsOptions {
  containerEl: HTMLElement;
  onShowScore: () => void;
  onShowDiary: () => void;
  isTouchLayout: boolean;
  activeTab?: "score" | "diary";
}

interface RenderBottomActionsOptions {
  containerEl: HTMLElement;
  onSave: () => Promise<void>;
  onStats: () => void;
  isTouchLayout: boolean;
  bindDiaryActions: (buttons: {
    saveBtn: HTMLButtonElement;
    statsBtn: HTMLButtonElement | null;
    actions: HTMLElement;
  }) => void;
}

export function renderDailyHeader({
  containerEl,
  plugin,
  dateStr,
  allScores,
  onPrevDay,
  onNextDay,
  onCalendar,
  onGoToday,
  onSwitchUser,
  isTouchLayout,
}: RenderDailyHeaderOptions) {
  const layout = isTouchLayout
    ? renderMobileDailyHeaderLayout(containerEl, plugin.currentUser.name + " 的每日记录")
    : renderDesktopDailyHeaderLayout(containerEl, plugin.currentUser.name + " 的每日记录");
  const { dateNav, userSwitcher } = layout;
  const prevBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "◀" });
  prevBtn.onclick = onPrevDay;
  dateNav.createEl("button", {
    cls: "date-nav-display",
    text: dateStr,
  });
  const calBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "📅" });
  calBtn.title = "日历跳选";
  calBtn.onclick = onCalendar;
  const nextBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "▶" });
  const isToday = dateStr === formatDate(0);
  if (isToday) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.3";
  }
  nextBtn.onclick = () => {
    if (!isToday) onNextDay();
  };
  const todayBtn = dateNav.createEl("button", {
    cls: "date-nav-today" + (isToday ? " is-today" : ""),
    text: isToday ? "今天" : "回到今天",
  });
  if (!isToday) {
    todayBtn.onclick = onGoToday;
    containerEl.createDiv({
      cls: "little-milestones-past-banner",
      text: "📅 正在编辑 " + dateStr + " 的记录",
    });
  }

  const cumulativeTotal = allScores.reduce((sum, s) => sum + s.total, 0);
  const cumulativeDays = allScores.length;
  if (cumulativeDays > 0) {
    const cSign = cumulativeTotal >= 0 ? "+" : "";
    const cumDiv = containerEl.createDiv({ cls: "little-milestones-cumulative-banner" });
    cumDiv.createSpan({ cls: "cumulative-label", text: "🎖️ 历史累计" });
    cumDiv.createSpan({ cls: "cumulative-value", text: cSign + cumulativeTotal + " 分" });
    cumDiv.createSpan({ cls: "cumulative-days", text: "共 " + cumulativeDays + " 天" });
  }

  plugin.settings.users.forEach((u) => {
    const uBtn = userSwitcher.createEl("button", {
      cls:
        "little-milestones-user-btn " +
        (isTouchLayout ? "little-milestones-user-btn-mobile" : "little-milestones-user-btn-desktop") +
        (u.id === plugin.settings.currentUserId ? " is-active" : ""),
      text: u.name,
    });
    if (plugin.settings.users.length > 1) {
      uBtn.onclick = async () => {
        try {
          await onSwitchUser(u.id);
        } catch (e) {
          new Notice("❌ 切换用户失败：" + (e instanceof Error ? e.message : String(e)));
        }
      };
    }
  });
}

export function renderMainTabs({
  containerEl,
  onShowScore,
  onShowDiary,
  isTouchLayout,
  activeTab = "score",
}: RenderTabsOptions) {
  const { tabs, scoreTab, diaryTab, scorePanel, diaryPanel } = isTouchLayout
    ? renderMobileMainTabsLayout(containerEl)
    : renderDesktopMainTabsLayout(containerEl);

  scoreTab.onclick = () => {
    scoreTab.addClass("is-active");
    diaryTab.removeClass("is-active");
    scorePanel.removeClass("is-hidden");
    diaryPanel.addClass("is-hidden");
    onShowScore();
  };
  diaryTab.onclick = () => {
    diaryTab.addClass("is-active");
    scoreTab.removeClass("is-active");
    diaryPanel.removeClass("is-hidden");
    scorePanel.addClass("is-hidden");
    onShowDiary();
  };

  if (activeTab === "diary") {
    diaryTab.addClass("is-active");
    scoreTab.removeClass("is-active");
    diaryPanel.removeClass("is-hidden");
    scorePanel.addClass("is-hidden");
  }

  return { tabs, scoreTab, diaryTab, scorePanel, diaryPanel };
}

export function renderBottomActions({
  containerEl,
  onSave,
  onStats,
  isTouchLayout,
  bindDiaryActions,
}: RenderBottomActionsOptions) {
  const { actions, saveBtn, statsBtn } = isTouchLayout
    ? renderMobileBottomActionsLayout(containerEl)
    : renderDesktopBottomActionsLayout(containerEl);

  bindDiaryActions({ saveBtn, statsBtn, actions });
  saveBtn.onclick = () => void onSave();
  if (statsBtn) statsBtn.onclick = onStats;
}

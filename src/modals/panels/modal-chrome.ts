import { Notice } from "obsidian";
import type KidScorePlugin from "../../main";
import { formatDate } from "../../utils/date";

interface RenderDailyHeaderOptions {
  containerEl: HTMLElement;
  plugin: KidScorePlugin;
  dateStr: string;
  allScores: Array<{ total: number }>;
  onPrevDay: () => void;
  onNextDay: () => void;
  onPickDate: (dateStr: string) => void;
  onCalendar: () => void;
  onGoToday: () => void;
  onSwitchUser: (userId: string) => Promise<void>;
}

interface RenderTabsOptions {
  containerEl: HTMLElement;
  onShowScore: () => void;
  onShowDiary: () => void;
}

interface RenderBottomActionsOptions {
  containerEl: HTMLElement;
  onPreview: () => void;
  onSave: () => Promise<void>;
  onStats: () => void;
  bindDiaryActions: (buttons: {
    previewBtn: HTMLButtonElement;
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
  onPickDate,
  onCalendar,
  onGoToday,
  onSwitchUser,
}: RenderDailyHeaderOptions) {
  const header = containerEl.createDiv({ cls: "kid-score-header" });
  header.createEl("h2", { text: plugin.currentUser.name + " 的每日记录" });
  const dateNav = header.createDiv({ cls: "kid-score-date-nav" });
  const prevBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "◀" });
  prevBtn.onclick = onPrevDay;
  const dateInput = dateNav.createEl("input", { cls: "date-nav-input" });
  dateInput.type = "date";
  dateInput.value = dateStr;
  dateInput.max = formatDate(0);
  dateInput.onchange = () => {
    if (dateInput.value) onPickDate(dateInput.value);
  };
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
      cls: "kid-score-past-banner",
      text: "📅 正在编辑 " + dateStr + " 的记录",
    });
  }

  const cumulativeTotal = allScores.reduce((sum, s) => sum + s.total, 0);
  const cumulativeDays = allScores.length;
  if (cumulativeDays > 0) {
    const cSign = cumulativeTotal >= 0 ? "+" : "";
    const cumDiv = containerEl.createDiv({ cls: "kid-score-cumulative-banner" });
    cumDiv.createSpan({ cls: "cumulative-label", text: "🎖️ 历史累计" });
    cumDiv.createSpan({ cls: "cumulative-value", text: cSign + cumulativeTotal + " 分" });
    cumDiv.createSpan({ cls: "cumulative-days", text: "共 " + cumulativeDays + " 天" });
  }

  const userSwitcher = containerEl.createDiv({ cls: "kid-score-user-switcher" });
  plugin.settings.users.forEach((u) => {
    const uBtn = userSwitcher.createEl("button", {
      cls: "kid-score-user-btn" + (u.id === plugin.settings.currentUserId ? " is-active" : ""),
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
}: RenderTabsOptions) {
  const mainTabs = containerEl.createDiv({ cls: "kid-score-main-tabs" });
  const scoreTab = mainTabs.createEl("button", {
    text: "⭐ 打分",
    cls: "kid-score-main-tab is-active",
  });
  const diaryTab = mainTabs.createEl("button", {
    text: "📝 日记",
    cls: "kid-score-main-tab",
  });
  const scorePanel = containerEl.createDiv({ cls: "kid-score-tab-panel" });
  const diaryPanel = containerEl.createDiv({ cls: "kid-score-tab-panel is-hidden" });

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

  return { scorePanel, diaryPanel };
}

export function renderBottomActions({
  containerEl,
  onPreview,
  onSave,
  onStats,
  bindDiaryActions,
}: RenderBottomActionsOptions) {
  const actions = containerEl.createDiv({ cls: "kid-score-actions" });
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

  bindDiaryActions({ previewBtn, saveBtn, statsBtn, actions });
  previewBtn.onclick = onPreview;
  saveBtn.onclick = () => void onSave();
  statsBtn.onclick = onStats;
}

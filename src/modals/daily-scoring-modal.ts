import { Notice, Component } from "obsidian";
import type { App } from "obsidian";
import { BaseMobileModal } from "../ui/base-mobile-modal";
import { formatDate, shiftDateString } from "../utils/date";
import { makeDefaultDiaryModules } from "../constants";
import type {
  ScoreItem,
  CustomScoreItem,
  DayData,
  DiaryModuleValues,
} from "../types";
import type KidScorePlugin from "../main";
import { StatsModal } from "./stats-modal";
import { openCalendarPicker } from "./popups/calendar-picker";
import { buildDiaryPanel, type DiaryPanelControls } from "./panels/diary-panel";
import {
  openAddCustomItemModal,
  openAddItemModal,
  openAttachmentInsertModal,
  openEditCustomItemModal,
  openQuickCustomAdjustModal,
  openScoreItemValueModal,
} from "./helpers/daily-modal-actions";
import { loadDailyModalState } from "./helpers/daily-modal-state";
import { renderDailyTotalDisplay } from "./helpers/daily-total-display";
import {
  renderBottomActions,
  renderDailyHeader,
  renderMainTabs,
} from "./panels/modal-chrome";
import {
  refreshScoreCard,
  renderCustomItemsList,
  renderScoreCard,
} from "./panels/score-items-panel";
import { renderScorePanel } from "./panels/score-panel";
import { composeDiaryContent } from "../diary/modules";

export class DailyScoringModal extends BaseMobileModal {
  scores: Record<string, number> = {};
  customItems: CustomScoreItem[] = [];
  diaryContent = "";
  dateStr: string;
  totalDisplay: HTMLElement | null = null;
  customItemsContainer: HTMLElement | null = null;
  diaryTextarea: HTMLTextAreaElement | null = null;
  diaryModules: DiaryModuleValues = {};
  diaryControls: DiaryPanelControls | null = null;
  activeTab: "score" | "diary" = "score";
  protected enableKeyboardAdjustment = false;

  constructor(app: App, plugin: KidScorePlugin, initialDate?: string) {
    super(app, plugin);
    this.dateStr = initialDate || formatDate(0);
  }

  onOpen(): void {
    super.onOpen();
    this.renderModal();
  }

  private isTouchOptimizedMode(): boolean {
    return this.mobilePlatform !== "desktop";
  }

  async renderModal() {
    const self = this;
    const contentEl = this.contentEl;
    contentEl.empty();
    contentEl.addClass("kid-score-modal", "kid-score-daily-modal");

    this.scores = {};
    this.customItems = [];
    this.diaryContent = "";
    this.diaryModules = {};
    this.diaryControls = null;

    const state = await loadDailyModalState(this.plugin, this.dateStr);
    const yesterdayData = state.yesterdayData;
    this.scores = state.scores;
    this.customItems = state.customItems;
    this.diaryContent = state.diaryContent;
    this.diaryModules = state.diaryModules;

    renderDailyHeader({
      containerEl: contentEl,
      plugin: this.plugin,
      dateStr: this.dateStr,
      allScores: state.allScores,
      onPrevDay: () => {
        self.dateStr = shiftDateString(self.dateStr, -1);
        self.renderModal();
      },
      onNextDay: () => {
        self.dateStr = shiftDateString(self.dateStr, 1);
        self.renderModal();
      },
      onCalendar: () => self.showCalendarPicker(),
      onGoToday: () => {
        self.dateStr = formatDate(0);
        self.renderModal();
      },
      onSwitchUser: async (userId) => {
        self.plugin.settings.currentUserId = userId;
        await self.plugin.saveSettings();
        await self.renderModal();
      },
    });

    const { scorePanel, diaryPanel } = renderMainTabs({
      containerEl: contentEl,
      onShowScore: () => {
        self.syncDiaryContent();
        self.activeTab = "score";
        contentEl.scrollTop = 0;
      },
      onShowDiary: () => {
        self.activeTab = "diary";
        contentEl.scrollTop = 0;
      },
    });

    const renderedScorePanel = renderScorePanel({
      app: this.app as App,
      component: this as unknown as Component,
      plugin: this.plugin,
      scorePanel,
      yesterdayData,
      isTouchOptimizedMode: this.isTouchOptimizedMode(),
      renderScoreCard: (item, grid, previousDay) => this.renderScoreCard(item, grid, previousDay),
      renderCustomItems: () => this.renderCustomItems(),
      onAddItem: (category) => self.showAddItemPopup(category),
      onAddCustom: () => self.showAddCustomItemForm(),
      onSetTotalDisplay: (element) => {
        this.totalDisplay = element;
      },
      onAfterRulesSaved: () => this.updateTotalDisplay(),
    });
    this.customItemsContainer = renderedScorePanel?.customItemsContainer || null;
    this.updateTotalDisplay();

    this.diaryControls = buildDiaryPanel({
      app: this.app,
      plugin: this.plugin,
      component: this as unknown as Component,
      panel: diaryPanel,
      diaryContent: this.diaryContent,
      diaryModules: this.diaryModules,
      setDiaryTextarea: (textarea) => {
        this.diaryTextarea = textarea;
      },
      updateDiaryContent: (content) => {
        this.diaryContent = content;
      },
      updateDiaryModules: (values) => {
        this.diaryModules = values;
      },
      composeDiaryContent: () => this.syncDiaryContent(),
      insertAttachment: (label, ext) => this.insertAttachment(label, ext),
      insertDiaryText: (text) => this.insertTextAtCursor(text),
      wrapDiarySelection: (prefix, suffix, placeholder) =>
        this.wrapDiarySelection(prefix, suffix, placeholder),
    });
    renderBottomActions({
      containerEl: contentEl,
      onPreview: () => {
        this.diaryControls?.togglePreview();
      },
      onSave: async () => {
        self.syncDiaryContent();
        try {
          await self.plugin.saveDayData(self.dateStr, self.scores, self.customItems, self.diaryContent);
          self.close();
        } catch (e) {
          new Notice("❌ 保存失败：" + (e instanceof Error ? e.message : String(e)));
        }
      },
      onStats: () => {
        self.close();
        new StatsModal(self.app, self.plugin).open();
      },
      bindDiaryActions: (buttons) => this.diaryControls?.bindActionButtons(buttons),
    });
  }

  syncDiaryContent() {
    const moduleConfig =
      this.plugin.currentUser.diaryModules && this.plugin.currentUser.diaryModules.length
        ? this.plugin.currentUser.diaryModules
        : makeDefaultDiaryModules();
    this.diaryContent = composeDiaryContent(this.diaryModules || {}, moduleConfig);
    return this.diaryContent;
  }

  insertTextAtCursor(text: string) {
    if (!this.diaryTextarea) return;
    const ta = this.diaryTextarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    this.diaryModules.freeWrite = ta.value;
    this.syncDiaryContent();
    ta.focus();
  }

  wrapDiarySelection(prefix: string, suffix = "", placeholder = "") {
    if (!this.diaryTextarea) return;
    const ta = this.diaryTextarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const body = selected || placeholder;
    const text = prefix + body + suffix;
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    const cursorPos = start + text.length;
    ta.selectionStart = ta.selectionEnd = cursorPos;
    this.diaryModules.freeWrite = ta.value;
    this.syncDiaryContent();
    ta.focus();
  }

  insertAttachment(label: string, ext: string) {
    openAttachmentInsertModal({
      app: this.app,
      plugin: this.plugin,
      label,
      ext,
      dateStr: this.dateStr,
      onInsert: (text) => this.insertTextAtCursor(text),
    });
  }

  renderScoreCard(item: ScoreItem, grid: HTMLElement, yesterdayData: DayData | null) {
    return renderScoreCard({
      item,
      grid,
      yesterdayData,
      getScore: (itemId) => this.scores[itemId] || 0,
      isTouchMode: this.isTouchOptimizedMode(),
      longPressMs: this.getLongPressDuration(),
      getDoubleTapThreshold: () => this.plugin.getDoubleTapThreshold(),
      triggerHaptic: (style) => this.triggerHaptic(style),
      onToggleScore: (targetItem) => {
        this.scores[targetItem.id] = this.scores[targetItem.id] === 0 ? targetItem.points : 0;
        this.refreshCardByItem(targetItem);
        this.updateTotalDisplay();
      },
      onCustomValue: (targetItem, quickOnly, card) => {
        this.showCustomValuePopup(
          targetItem,
          (v) => {
            this.scores[targetItem.id] = v;
            refreshScoreCard(card, targetItem, this.scores[targetItem.id] || 0);
            this.updateTotalDisplay();
          },
          quickOnly
        );
      },
    });
  }

  refreshCardByItem(item: ScoreItem) {
    const card = this.contentEl.querySelector<HTMLElement>('.kid-score-card[data-item-id="' + item.id + '"]');
    if (!card) return;
    refreshScoreCard(card, item, this.scores[item.id] || 0);
  }

  showCustomValuePopup(item: ScoreItem, callback: (val: number) => void, quickOnly = false) {
    openScoreItemValueModal({
      app: this.app,
      plugin: this.plugin,
      item,
      currentValue: this.scores[item.id] || item.points,
      quickOnly,
      onValue: callback,
      onRefresh: async () => {
        await this.renderModal();
      },
    });
  }

  showAddItemPopup(category: string) {
    openAddItemModal(this.app, this.plugin, category, async () => {
      await this.renderModal();
    });
  }

  renderCustomItems() {
    const self = this;
    const container = this.customItemsContainer;
    if (!container) return;
    renderCustomItemsList({
      container,
      customItems: this.customItems,
      isTouchMode: this.isTouchOptimizedMode(),
      longPressMs: this.getLongPressDuration(),
      onQuickAdjust: (idx) => self.showQuickCustomScorePopup(idx),
      onEdit: (idx) => self.showEditCustomItemPopup(idx),
      onDelete: (idx) => {
        const ci = self.customItems[idx];
        if (!ci) return;
        if (!confirm("确定删除临时事项「" + ci.name + "」吗？")) return;
        self.customItems.splice(idx, 1);
        self.renderCustomItems();
        self.updateTotalDisplay();
      },
    });
  }

  showAddCustomItemForm() {
    openAddCustomItemModal({
      app: this.app,
      plugin: this.plugin,
      onSubmit: (emoji, name, points, note) => {
        this.customItems.push({
        id: "custom_" + Date.now(),
        emoji,
        name,
        points,
        note,
      });
        this.renderCustomItems();
        this.updateTotalDisplay();
      },
    });
  }

  showEditCustomItemPopup(idx: number) {
    openEditCustomItemModal({
      app: this.app,
      plugin: this.plugin,
      customItem: this.customItems[idx],
      onSubmit: (emoji, name, points, note) => {
        this.customItems[idx].emoji = emoji;
        this.customItems[idx].name = name;
        this.customItems[idx].points = points;
        this.customItems[idx].note = note;
        this.renderCustomItems();
        this.updateTotalDisplay();
      },
    });
  }

  showQuickCustomScorePopup(idx: number) {
    openQuickCustomAdjustModal({
      app: this.app,
      plugin: this.plugin,
      customItem: this.customItems[idx],
      onSubmit: (points) => {
        this.customItems[idx].points = points;
        this.renderCustomItems();
        this.updateTotalDisplay();
      },
    });
  }

  async showCalendarPicker() {
    const allScores = await this.plugin.getAllScores();
    openCalendarPicker({
      currentDate: this.dateStr,
      recordDates: new Set(allScores.map((s) => s.date)),
      onSelect: (dateStr) => {
        this.dateStr = dateStr;
        this.renderModal();
      },
    });
  }

  updateTotalDisplay() {
    if (!this.totalDisplay) return;
    renderDailyTotalDisplay({
      element: this.totalDisplay,
      items: this.plugin.currentUser.items,
      scores: this.scores,
      customItems: this.customItems,
      dailyGoal: this.plugin.currentUser.goals?.daily || 1,
    });
  }
}

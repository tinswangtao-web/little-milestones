import { Notice, Component, TFile } from "obsidian";
import type { App } from "obsidian";
import { BaseMobileModal } from "../ui/base-mobile-modal";
import { showConfirmModal } from "../ui/confirm-modal";
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

interface DiaryUiDraftState {
  quickCustomInputs: Record<string, string>;
}

interface DiaryDraftState {
  diaryContent: string;
  diaryModules: DiaryModuleValues;
  uiDrafts: DiaryUiDraftState;
  /** Report vault file mtime when draft was saved; if file is newer, drop draft on reopen. */
  sourceVaultMtime: number;
}

function cloneDiaryUiDrafts(value: DiaryUiDraftState | undefined): DiaryUiDraftState {
  return {
    quickCustomInputs: { ...(value?.quickCustomInputs || {}) },
  };
}

export class DailyScoringModal extends BaseMobileModal {
  private static diaryDrafts = new Map<string, DiaryDraftState>();
  private static readonly maxDiaryDrafts = 50;

  readonly modalType = "daily";
  private isRendering = false;
  private needsRerender = false;
  scores: Record<string, number> = {};
  customItems: CustomScoreItem[] = [];
  diaryContent = "";
  dateStr: string;
  totalDisplay: HTMLElement | null = null;
  customItemsContainer: HTMLElement | null = null;
  diaryTextarea: HTMLTextAreaElement | null = null;
  diaryModules: DiaryModuleValues = {};
  diaryControls: DiaryPanelControls | null = null;
  diaryUiDrafts: DiaryUiDraftState = cloneDiaryUiDrafts(undefined);
  activeTab: "score" | "diary" = "score";
  private pendingDiaryScrollId: string | null = null;
  private pendingScoreScrollTop: number | null = null;
  private skipNextCloseDraftSave = false;
  private mobileTabSwipeEvents: Component | null = null;
  private pendingRenderState:
    | {
        scores: Record<string, number>;
        customItems: CustomScoreItem[];
        diaryContent: string;
        diaryModules: DiaryModuleValues;
        diaryUiDrafts: DiaryUiDraftState;
      }
    | null = null;
  protected enableKeyboardAdjustment = true;

  constructor(app: App, plugin: KidScorePlugin, initialDate?: string) {
    super(app, plugin);
    this.dateStr = initialDate || formatDate(0);
  }

  onOpen(): void {
    super.onOpen();
    this.renderModal();
  }

  onClose(): void {
    this.clearMobileTabSwipeEvents();
    if (this.skipNextCloseDraftSave) {
      this.skipNextCloseDraftSave = false;
    } else {
      this.saveDiaryDraft();
    }
    super.onClose();
  }

  private isTouchOptimizedMode(): boolean {
    return this.mobilePlatform !== "desktop";
  }

  async renderModal() {
    if (this.isRendering) {
      this.needsRerender = true;
      return;
    }
    this.isRendering = true;
    this.needsRerender = false;
    const self = this;
    try {
      const contentEl = this.contentEl;
      this.clearMobileTabSwipeEvents();
      contentEl.empty();
      contentEl.addClass("kid-score-modal", "kid-score-daily-modal");
      contentEl.toggleClass("is-diary-tab-active", this.activeTab === "diary");

      this.scores = {};
      this.customItems = [];
      this.diaryContent = "";
      this.diaryModules = {};
      this.diaryUiDrafts = cloneDiaryUiDrafts(undefined);
      this.diaryControls = null;

      const state = await loadDailyModalState(this.plugin, this.dateStr);
      const pendingState = this.pendingRenderState;
      this.pendingRenderState = null;
      const yesterdayData = state.yesterdayData;
      this.scores = pendingState?.scores ?? state.scores;
      this.customItems = pendingState?.customItems ?? state.customItems;
      this.diaryContent = pendingState?.diaryContent ?? state.diaryContent;
      this.diaryModules = pendingState?.diaryModules ?? state.diaryModules;
      this.diaryUiDrafts = cloneDiaryUiDrafts(pendingState?.diaryUiDrafts);
      let diaryDraft = this.getDiaryDraft();
      if (diaryDraft && this.shouldDiscardDiaryDraftForVaultUpdate(diaryDraft)) {
        this.clearDiaryDraft();
        diaryDraft = null;
      }
      if (diaryDraft) {
        this.diaryContent = diaryDraft.diaryContent;
        this.diaryModules = { ...diaryDraft.diaryModules };
        this.diaryUiDrafts = cloneDiaryUiDrafts(diaryDraft.uiDrafts);
      }

      renderDailyHeader({
        containerEl: contentEl,
        plugin: this.plugin,
        dateStr: this.dateStr,
        allScores: state.allScores,
        onPrevDay: () => {
          self.saveDiaryDraft();
          self.dateStr = shiftDateString(self.dateStr, -1);
          self.renderModal();
        },
        onNextDay: () => {
          self.saveDiaryDraft();
          self.dateStr = shiftDateString(self.dateStr, 1);
          self.renderModal();
        },
        onCalendar: () => self.showCalendarPicker(),
        onGoToday: () => {
          self.saveDiaryDraft();
          self.dateStr = formatDate(0);
          self.renderModal();
        },
        onSwitchUser: async (userId) => {
          self.saveDiaryDraft();
          self.plugin.settings.currentUserId = userId;
          await self.plugin.saveSettings();
          await self.renderModal();
        },
        isTouchLayout: this.isTouchOptimizedMode(),
      });

      const { scoreTab, diaryTab, scorePanel, diaryPanel } = renderMainTabs({
        containerEl: contentEl,
        isTouchLayout: this.isTouchOptimizedMode(),
        activeTab: this.activeTab,
        onShowScore: () => {
          self.syncDiaryContent();
          self.activeTab = "score";
          contentEl.toggleClass("is-diary-tab-active", false);
          contentEl.scrollTop = 0;
        },
        onShowDiary: () => {
          self.syncDiaryContent();
          self.activeTab = "diary";
          contentEl.toggleClass("is-diary-tab-active", true);
          contentEl.scrollTop = 0;
        },
      });
      this.bindMobileTabSwipe(scorePanel, diaryPanel, scoreTab, diaryTab);

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
        allowDefaultDiaryTemplate: !state.hasExistingRecord,
        setDiaryTextarea: (textarea) => {
          this.diaryTextarea = textarea;
        },
        updateDiaryContent: (content) => {
          this.diaryContent = content;
        },
        updateDiaryModules: (values) => {
          this.diaryModules = values;
          this.saveDiaryDraft();
        },
        quickCustomDrafts: this.diaryUiDrafts.quickCustomInputs,
        updateQuickCustomDraft: (moduleId, value) => {
          this.diaryUiDrafts.quickCustomInputs[moduleId] = value;
          this.saveDiaryDraft();
        },
        composeDiaryContent: () => this.syncDiaryContent(),
        insertAttachment: (label, ext) => this.insertAttachment(label, ext),
        insertDiaryText: (text) => this.insertTextAtCursor(text),
        wrapDiarySelection: (prefix, suffix, placeholder) =>
          this.wrapDiarySelection(prefix, suffix, placeholder),
        onModulesChanged: async () => {
          this.syncDiaryContent();
          this.saveDiaryDraft();
          this.pendingRenderState = {
            scores: { ...this.scores },
            customItems: this.customItems.map((item) => ({ ...item })),
            diaryContent: this.diaryContent,
            diaryModules: { ...this.diaryModules },
            diaryUiDrafts: cloneDiaryUiDrafts(this.diaryUiDrafts),
          };
          await this.plugin.saveSettings();
          this.activeTab = "diary";
          await this.renderModal();
        },
        requestScrollToModule: (id) => {
          this.pendingDiaryScrollId = id;
        },
        isTouchLayout: this.isTouchOptimizedMode(),
      });
      renderBottomActions({
        containerEl: contentEl,
        onSave: async () => {
          self.syncDiaryContent();
          try {
            await self.plugin.saveDayData(
              self.dateStr,
              self.scores,
              self.customItems,
              self.diaryContent,
              self.diaryModules
            );
            self.skipNextCloseDraftSave = true;
            self.clearDiaryDraft();
            const file = self.plugin.getDayFile(self.dateStr);
            self.close();
            if (file instanceof TFile) {
              await self.app.workspace.getLeaf(true).openFile(file, { active: true });
            }
          } catch (e) {
            new Notice("❌ 保存失败：" + (e instanceof Error ? e.message : String(e)));
          }
        },
        onStats: () => {
          const returnDate = self.dateStr;
          const returnTab = self.activeTab;
          self.saveDiaryDraft();
          self.close();
          new StatsModal(self.app, self.plugin, {
            onBack: () => {
              const dailyModal = new DailyScoringModal(self.app, self.plugin, returnDate);
              dailyModal.activeTab = returnTab;
              dailyModal.open();
            },
          }).open();
        },
        isTouchLayout: this.isTouchOptimizedMode(),
        bindDiaryActions: (buttons) => this.diaryControls?.bindActionButtons(buttons),
      });
    } finally {
      this.isRendering = false;
      if (this.needsRerender) {
        this.needsRerender = false;
        await this.renderModal();
      }
      const scrollId = this.pendingDiaryScrollId;
      this.pendingDiaryScrollId = null;
      if (scrollId) {
        requestAnimationFrame(() => {
          const el = this.contentEl.querySelector(`[data-module-id="${scrollId}"]`);
          if (el) {
            (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
      const pendingScrollTop = this.pendingScoreScrollTop;
      this.pendingScoreScrollTop = null;
      if (typeof pendingScrollTop === "number") {
        requestAnimationFrame(() => {
          this.contentEl.scrollTop = pendingScrollTop;
        });
      }
    }
  }

  private captureScoreScrollTop(): void {
    if (this.activeTab !== "score") return;
    this.pendingScoreScrollTop = this.contentEl.scrollTop;
  }

  private bindMobileTabSwipe(
    scorePanel: HTMLElement,
    diaryPanel: HTMLElement,
    scoreTab: HTMLButtonElement,
    diaryTab: HTMLButtonElement
  ): void {
    if (!this.isTouchOptimizedMode()) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const shouldIgnoreSwipeTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return true;
      if (target.closest("input, textarea, select, button, a, [role='button']")) return true;
      for (let el: HTMLElement | null = target; el; el = el.parentElement) {
        if (el.isContentEditable) return true;
      }
      return false;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || !event.isPrimary) return;
      if (shouldIgnoreSwipeTarget(event.target)) return;
      startX = event.clientX;
      startY = event.clientY;
      tracking = true;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!tracking) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dy) > 18 && Math.abs(dy) > Math.abs(dx)) {
        tracking = false;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) < 72) return;
      if (Math.abs(dx) <= Math.abs(dy) * 1.35) return;

      event.preventDefault();
      event.stopPropagation();
      if (dx < 0 && this.activeTab === "score") {
        diaryTab.click();
      } else if (dx > 0 && this.activeTab === "diary") {
        scoreTab.click();
      }
    };

    const onPointerCancel = () => {
      tracking = false;
    };

    const swipeEvents = new Component();
    swipeEvents.load();
    this.mobileTabSwipeEvents = swipeEvents;
    for (const panel of [scorePanel, diaryPanel]) {
      swipeEvents.registerDomEvent(panel, "pointerdown", onPointerDown);
      swipeEvents.registerDomEvent(panel, "pointermove", onPointerMove);
      swipeEvents.registerDomEvent(panel, "pointerup", onPointerUp);
      swipeEvents.registerDomEvent(panel, "pointercancel", onPointerCancel);
    }
  }

  private clearMobileTabSwipeEvents(): void {
    if (!this.mobileTabSwipeEvents) return;
    this.mobileTabSwipeEvents.unload();
    this.mobileTabSwipeEvents = null;
  }

  syncDiaryContent() {
    const moduleConfig =
      this.plugin.currentUser.diaryModules && this.plugin.currentUser.diaryModules.length
        ? this.plugin.currentUser.diaryModules
        : makeDefaultDiaryModules();
    this.diaryContent = composeDiaryContent(this.diaryModules || {}, moduleConfig);
    return this.diaryContent;
  }

  private getDiaryDraftKey(): string {
    return `${this.plugin.currentUser.id || this.plugin.settings.currentUserId || "default"}:${this.dateStr}`;
  }

  /** Mtime of the on-disk day report for this date, or 0 if the file does not exist yet. */
  private getDayReportVaultMtime(): number {
    const file = this.plugin.getDayFile(this.dateStr);
    return file?.stat?.mtime ?? 0;
  }

  /** If the vault file was modified after the draft was captured, the draft must not override readDayData. */
  private shouldDiscardDiaryDraftForVaultUpdate(draft: DiaryDraftState): boolean {
    const file = this.plugin.getDayFile(this.dateStr);
    if (!file) return false;
    const currentMtime = file.stat?.mtime ?? 0;
    const draftMtime = draft.sourceVaultMtime ?? 0;
    return currentMtime > draftMtime;
  }

  private getDiaryDraft(): DiaryDraftState | null {
    const draft = DailyScoringModal.diaryDrafts.get(this.getDiaryDraftKey());
    if (!draft) return null;
    return {
      diaryContent: draft.diaryContent,
      diaryModules: { ...draft.diaryModules },
      uiDrafts: cloneDiaryUiDrafts(draft.uiDrafts),
      sourceVaultMtime: draft.sourceVaultMtime ?? 0,
    };
  }

  private saveDiaryDraft(): void {
    this.syncDiaryContent();
    const key = this.getDiaryDraftKey();
    DailyScoringModal.diaryDrafts.delete(key);
    DailyScoringModal.diaryDrafts.set(key, {
      diaryContent: this.diaryContent,
      diaryModules: { ...this.diaryModules },
      uiDrafts: cloneDiaryUiDrafts(this.diaryUiDrafts),
      sourceVaultMtime: this.getDayReportVaultMtime(),
    });
    while (DailyScoringModal.diaryDrafts.size > DailyScoringModal.maxDiaryDrafts) {
      const oldestKey = DailyScoringModal.diaryDrafts.keys().next().value;
      if (!oldestKey) break;
      DailyScoringModal.diaryDrafts.delete(oldestKey);
    }
  }

  private clearDiaryDraft(): void {
    DailyScoringModal.diaryDrafts.delete(this.getDiaryDraftKey());
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
    this.saveDiaryDraft();
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
    this.saveDiaryDraft();
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
    this.captureScoreScrollTop();
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
    this.captureScoreScrollTop();
    openAddItemModal(this.app, this.plugin, category, async () => {
      this.activeTab = "score";
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
        showConfirmModal(this.app, {
          title: "删除临时事项",
          message: "确定删除临时事项「" + ci.name + "」吗？",
          isDestructive: true,
          onConfirm: () => {
            self.customItems.splice(idx, 1);
            self.renderCustomItems();
            self.updateTotalDisplay();
          },
        });
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
        this.saveDiaryDraft();
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

import { MarkdownRenderer, Notice, Component } from "obsidian";
import type { App } from "obsidian";
import { BaseMobileModal } from "../ui/base-mobile-modal";
import { formatDate } from "../utils/date";
import { bindModalInputFocus } from "../utils/dom";
import { DIARY_TEMPLATES } from "../constants";
import type { ScoreItem, CustomScoreItem, DayData } from "../types";
import type KidScorePlugin from "../main";
import { StatsModal } from "./stats-modal";
import { AttachFileModal } from "./popups/attach-file-modal";
import { EditItemModal } from "./popups/edit-item-modal";
import { ScoreItemModal } from "./popups/score-item-modal";
import { AddItemModal } from "./popups/add-item-modal";
import { AddCustomModal } from "./popups/add-custom-modal";
import { EditCustomModal } from "./popups/edit-custom-modal";
import { QuickCustomModal } from "./popups/quick-custom-modal";

export class DailyScoringModal extends BaseMobileModal {
  scores: Record<string, number> = {};
  customItems: CustomScoreItem[] = [];
  diaryContent = "";
  dateStr: string;
  totalDisplay: HTMLElement | null = null;
  customItemsContainer: HTMLElement | null = null;
  diaryTextarea: HTMLTextAreaElement | null = null;
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

    const yesterday = new Date(this.dateStr + "T00:00:00");
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const existingToday = await this.plugin.readDayData(this.dateStr);
    const yesterdayData = await this.plugin.readDayData(yesterdayStr);

    for (const item of this.plugin.currentUser.items) {
      if (existingToday && existingToday.scores[item.id] !== undefined) {
        this.scores[item.id] = existingToday.scores[item.id];
      } else {
        this.scores[item.id] = 0;
      }
    }
    if (existingToday) {
      this.customItems = existingToday.customItems || [];
      this.diaryContent = existingToday.diaryContent || "";
    }

    const header = contentEl.createDiv({ cls: "kid-score-header" });
    header.createEl("h2", { text: this.plugin.currentUser.name + " 的每日记录" });
    const dateNav = header.createDiv({ cls: "kid-score-date-nav" });
    const prevBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "◀" });
    prevBtn.onclick = () => {
      const d = new Date(self.dateStr + "T00:00:00");
      d.setDate(d.getDate() - 1);
      self.dateStr = d.toISOString().slice(0, 10);
      self.renderModal();
    };
    const dateInput = dateNav.createEl("input", { cls: "date-nav-input" });
    dateInput.type = "date";
    dateInput.value = this.dateStr;
    dateInput.max = formatDate(0);
    dateInput.onchange = () => {
      if (dateInput.value) {
        self.dateStr = dateInput.value;
        self.renderModal();
      }
    };
    const calBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "📅" });
    calBtn.title = "日历跳选";
    calBtn.onclick = () => {
      self.showCalendarPicker();
    };
    const nextBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "▶" });
    const isToday = this.dateStr === formatDate(0);
    if (isToday) {
      nextBtn.disabled = true;
      nextBtn.style.opacity = "0.3";
    }
    nextBtn.onclick = () => {
      if (isToday) return;
      const d = new Date(self.dateStr + "T00:00:00");
      d.setDate(d.getDate() + 1);
      self.dateStr = d.toISOString().slice(0, 10);
      self.renderModal();
    };
    const todayBtn = dateNav.createEl("button", {
      cls: "date-nav-today" + (isToday ? " is-today" : ""),
      text: isToday ? "今天" : "回到今天",
    });
    if (!isToday) {
      todayBtn.onclick = () => {
        self.dateStr = formatDate(0);
        self.renderModal();
      };
    }
    if (!isToday) {
      contentEl.createDiv({
        cls: "kid-score-past-banner",
        text: "📅 正在编辑 " + this.dateStr + " 的记录",
      });
    }

    const allScores = await this.plugin.getAllScores();
    const cumulativeTotal = allScores.reduce((sum, s) => sum + s.total, 0);
    const cumulativeDays = allScores.length;
    if (cumulativeDays > 0) {
      const cSign = cumulativeTotal >= 0 ? "+" : "";
      const cumDiv = contentEl.createDiv({ cls: "kid-score-cumulative-banner" });
      cumDiv.createSpan({ cls: "cumulative-label", text: "🎖️ 历史累计" });
      cumDiv.createSpan({ cls: "cumulative-value", text: cSign + cumulativeTotal + " 分" });
      cumDiv.createSpan({ cls: "cumulative-days", text: "共 " + cumulativeDays + " 天" });
    }

    const allUsers = self.plugin.settings.users;
    const userSwitcher = contentEl.createDiv({ cls: "kid-score-user-switcher" });
    allUsers.forEach((u) => {
      const uBtn = userSwitcher.createEl("button", {
        cls:
          "kid-score-user-btn" +
          (u.id === self.plugin.settings.currentUserId ? " is-active" : ""),
        text: u.name,
      });
      if (allUsers.length > 1) {
        uBtn.onclick = async () => {
          try {
            self.plugin.settings.currentUserId = u.id;
            await self.plugin.saveSettings();
            await self.renderModal();
          } catch (e) {
            new Notice("❌ 切换用户失败：" + (e instanceof Error ? e.message : String(e)));
          }
        };
      }
    });

    const mainTabs = contentEl.createDiv({ cls: "kid-score-main-tabs" });
    const scoreTab = mainTabs.createEl("button", {
      text: "⭐ 打分",
      cls: "kid-score-main-tab is-active",
    });
    const diaryTab = mainTabs.createEl("button", {
      text: "📝 日记",
      cls: "kid-score-main-tab",
    });
    const scorePanel = contentEl.createDiv({ cls: "kid-score-tab-panel" });
    const diaryPanel = contentEl.createDiv({ cls: "kid-score-tab-panel is-hidden" });
    scoreTab.onclick = () => {
      if (self.diaryTextarea) self.diaryContent = self.diaryTextarea.value;
      self.activeTab = "score";
      scoreTab.addClass("is-active");
      diaryTab.removeClass("is-active");
      scorePanel.removeClass("is-hidden");
      diaryPanel.addClass("is-hidden");
      contentEl.scrollTop = 0;
    };
    diaryTab.onclick = () => {
      self.activeTab = "diary";
      diaryTab.addClass("is-active");
      scoreTab.removeClass("is-active");
      diaryPanel.removeClass("is-hidden");
      scorePanel.addClass("is-hidden");
      contentEl.scrollTop = 0;
    };

    if (this.plugin.currentUser.items.length === 0) {
      scorePanel.createEl("div", {
        cls: "kid-score-empty",
        text: "⚠️ 还没有设置打分项目，请先在插件设置中添加！",
      });
    } else {
      const rulesSection = scorePanel.createDiv({ cls: "kid-score-rules-section" });
      const rulesHeader = rulesSection.createDiv({ cls: "kid-score-rules-header" });
      const rulesToggle = rulesHeader.createEl("span", {
        cls: "kid-score-rules-toggle",
        text: "▶",
      });
      rulesHeader.createEl("span", { cls: "kid-score-rules-title", text: "📋 打分规则" });
      const rulesEditBtn = rulesHeader.createEl("button", {
        cls: "kid-score-rules-edit-btn",
        text: "✏️",
      });
      const rulesBody = rulesSection.createDiv({ cls: "kid-score-rules-body" });
      const rulesView = rulesBody.createDiv({ cls: "kid-score-rules-view" });
      const rulesEdit = rulesBody.createDiv({ cls: "kid-score-rules-edit is-hidden" });
      const rulesTextarea = rulesEdit.createEl("textarea", { cls: "kid-score-rules-textarea" });
      bindModalInputFocus(rulesTextarea);
      rulesTextarea.value = self.plugin.currentUser.scoringRules || "";
      const rulesActRow = rulesEdit.createDiv({ cls: "kid-score-rules-actions" });
      const rulesSaveBtn = rulesActRow.createEl("button", {
        cls: "mod-cta kid-score-rules-save-btn",
        text: "保存规则",
      });
      const rulesCancelBtn = rulesActRow.createEl("button", {
        cls: "kid-score-rules-cancel-btn",
        text: "取消",
      });
      const renderRulesView = () => {
        rulesView.empty();
        const text = self.plugin.currentUser.scoringRules || "";
        if (text.trim()) {
          MarkdownRenderer.render(self.app, text, rulesView, "", this as unknown as Component);
        } else {
          rulesView.createEl("p", {
            cls: "kid-score-rules-empty",
            text: "暂无规则，点击 ✏️ 添加打分规则",
          });
        }
      };
      renderRulesView();
      let rulesOpen = !!(self.plugin.currentUser.scoringRules && self.plugin.currentUser.scoringRules.trim());
      if (!rulesOpen) {
        rulesBody.addClass("is-hidden");
      } else {
        rulesToggle.textContent = "▼";
      }
      rulesHeader.addEventListener("click", (e) => {
        if (e.target === rulesEditBtn || rulesEditBtn.contains(e.target as Node)) return;
        rulesOpen = !rulesOpen;
        rulesToggle.textContent = rulesOpen ? "▼" : "▶";
        rulesBody.toggleClass("is-hidden", !rulesOpen);
      });
      let rulesIsEditing = false;
      rulesEditBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        rulesIsEditing = !rulesIsEditing;
        if (rulesIsEditing) {
          rulesOpen = true;
          rulesToggle.textContent = "▼";
          rulesBody.removeClass("is-hidden");
          rulesTextarea.value = self.plugin.currentUser.scoringRules || "";
          rulesView.addClass("is-hidden");
          rulesEdit.removeClass("is-hidden");
          rulesTextarea.focus();
        } else {
          rulesView.removeClass("is-hidden");
          rulesEdit.addClass("is-hidden");
        }
      });
      rulesSaveBtn.addEventListener("click", async () => {
        self.plugin.currentUser.scoringRules = rulesTextarea.value;
        await self.plugin.saveSettings();
        rulesIsEditing = false;
        rulesView.removeClass("is-hidden");
        rulesEdit.addClass("is-hidden");
        renderRulesView();
        new Notice("✅ 打分规则已保存！");
      });
      rulesCancelBtn.addEventListener("click", () => {
        rulesIsEditing = false;
        rulesView.removeClass("is-hidden");
        rulesEdit.addClass("is-hidden");
      });

      if (yesterdayData) {
        const ySign = yesterdayData.total >= 0 ? "+" : "";
        scorePanel.createDiv({
          cls: "kid-score-yesterday-banner",
          text: "📊 昨天（" + yesterdayStr + "）总分：" + ySign + yesterdayData.total + " 分",
        });
      }
      const itemsContainer = scorePanel.createDiv({ cls: "kid-score-items" });
      itemsContainer.createDiv({
        cls: "kid-score-hint",
        text: this.isTouchOptimizedMode()
          ? "💡 点一下记分，长按或点右上角按钮调整分值"
          : "💡 下方打分项：点击打分 · 长按自定义分值",
      });
      this.totalDisplay = scorePanel.createDiv({ cls: "kid-score-total-display" });
      const categories = this.plugin.currentUser.categories || [];
      let catRendered = false;
      for (const cat of categories) {
        const catItems = this.plugin.currentUser.items.filter((it) => it.category === cat);
        if (catItems.length > 0) {
          if (catRendered) {
            itemsContainer.createEl("hr", { cls: "kid-score-divider" });
          }
          const catHeader = itemsContainer.createDiv({ cls: "kid-score-cat-header" });
          catHeader.createEl("h3", { text: cat, cls: "kid-score-section-title" });
          ((c: string) => {
            const addItemBtn = catHeader.createEl("button", { text: "+", cls: "kid-score-add-item-btn" });
            addItemBtn.onclick = () => {
              self.showAddItemPopup(c);
            };
          })(cat);
          const grid = itemsContainer.createDiv({ cls: "kid-score-grid" });
          for (const itm of catItems) {
            this.renderCard(itm, grid, yesterdayData);
          }
          catRendered = true;
        }
      }
      const uncatItems = this.plugin.currentUser.items.filter(
        (it) => !it.category || categories.indexOf(it.category) === -1
      );
      if (uncatItems.length > 0) {
        if (catRendered) {
          itemsContainer.createEl("hr", { cls: "kid-score-divider" });
        }
        itemsContainer.createEl("h3", { text: "其他", cls: "kid-score-section-title" });
        const grid2 = itemsContainer.createDiv({ cls: "kid-score-grid" });
        for (const itm of uncatItems) {
          this.renderCard(itm, grid2, yesterdayData);
        }
        catRendered = true;
      }
      if (catRendered) {
        itemsContainer.createEl("hr", { cls: "kid-score-divider" });
      }
      itemsContainer.createEl("h3", { text: "📌 临时事项", cls: "kid-score-section-title" });
      this.customItemsContainer = itemsContainer.createDiv({ cls: "kid-score-custom-items" });
      this.renderCustomItems();
      const addCustomBtn = itemsContainer.createEl("button", {
        text: "＋ 添加临时加减分",
        cls: "kid-score-add-custom-btn",
      });
      addCustomBtn.onclick = () => {
        self.showAddCustomItemForm();
      };
      this.updateTotalDisplay();
    }

    this.buildDiaryPanel(diaryPanel);
    const actions = contentEl.createDiv({ cls: "kid-score-actions" });
    const saveBtn = actions.createEl("button", {
      text: "💾 保存记录",
      cls: "mod-cta kid-score-save-btn",
    });
    saveBtn.onclick = async () => {
      if (self.diaryTextarea) self.diaryContent = self.diaryTextarea.value;
      try {
        await self.plugin.saveDayData(self.dateStr, self.scores, self.customItems, self.diaryContent);
        self.close();
      } catch (e) {
        new Notice("❌ 保存失败：" + (e instanceof Error ? e.message : String(e)));
      }
    };
    const statsBtn = actions.createEl("button", {
      text: "📊 查看统计",
      cls: "kid-score-stats-btn",
    });
    statsBtn.onclick = () => {
      self.close();
      new StatsModal(self.app, self.plugin).open();
    };
  }

  buildDiaryPanel(panel: HTMLElement) {
    const self = this;
    let isPreview = false;
    const toolbar = panel.createDiv({ cls: "diary-toolbar" });
    const templateBtn = toolbar.createEl("button", {
      cls: "diary-tool-btn",
      text: "📋 插入模板",
    });
    templateBtn.onclick = () => {
      if (!self.diaryTextarea) return;
      const overlay = document.createElement("div");
      overlay.className = "kid-score-value-overlay";
      const popup = document.createElement("div");
      popup.className = "kid-score-value-popup";
      const header = document.createElement("div");
      header.className = "value-popup-header";
      header.textContent = "选择日记模板";
      popup.appendChild(header);
      const templateList = document.createElement("div");
      templateList.style.cssText =
        "display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;";

      const removeOverlay = () => {
        overlay.remove();
        window.removeEventListener("popstate", onPopstate);
        if ((history.state as any)?.kidScoreOverlay) {
          history.back();
        }
      };

      for (const key in DIARY_TEMPLATES) {
        const template = (DIARY_TEMPLATES as unknown as Record<string, { name: string; content: string }>)[key];
        const templateItem = document.createElement("button");
        templateItem.style.cssText =
          "text-align: left; padding: 10px; border: 1px solid var(--background-modifier-border); border-radius: 8px; background: var(--background-secondary); cursor: pointer; transition: all 0.15s;";
        templateItem.textContent = template.name;
        templateItem.onclick = () => {
          const current = self.diaryTextarea!.value;
          if (current.trim()) {
            const pos = self.diaryTextarea!.selectionStart || current.length;
            self.diaryTextarea!.value =
              current.slice(0, pos) + "\n\n" + template.content + current.slice(pos);
          } else {
            self.diaryTextarea!.value = template.content;
          }
          self.diaryContent = self.diaryTextarea!.value;
          self.diaryTextarea!.focus();
          removeOverlay();
        };
        templateList.appendChild(templateItem);
      }
      popup.appendChild(templateList);
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "value-popup-cancel";
      cancelBtn.textContent = "取消";
      cancelBtn.onclick = () => {
        removeOverlay();
      };
      popup.appendChild(cancelBtn);
      overlay.appendChild(popup);
      overlay.addEventListener("mousedown", (e) => {
        if (e.target === overlay) {
          e.preventDefault();
          removeOverlay();
        }
      });

      const onPopstate = (e: PopStateEvent) => {
        if ((e.state as any)?.kidScoreOverlay) {
          overlay.remove();
          window.removeEventListener("popstate", onPopstate);
        }
      };
      history.pushState({ kidScoreOverlay: true }, "");
      window.addEventListener("popstate", onPopstate);

      document.body.appendChild(overlay);
    };

    [
      { t: "🖼️ 图片", e: "png" },
      { t: "🎬 视频", e: "mp4" },
      { t: "🎵 音频", e: "mp3" },
    ].forEach((a) => {
      const btn = toolbar.createEl("button", { cls: "diary-tool-btn", text: a.t });
      btn.onclick = () => {
        self.insertAttachment(a.t.split(" ")[1], a.e);
      };
    });

    const previewBtn = toolbar.createEl("button", {
      cls: "diary-tool-btn diary-preview-btn",
      text: "预览",
    });
    previewBtn.onclick = () => {
      isPreview = !isPreview;
      if (isPreview) {
        self.diaryContent = self.diaryTextarea!.value;
        self.diaryTextarea!.rows = 5;
        previewWrap.style.display = "";
        previewWrap.empty();
        MarkdownRenderer.render(
          self.app,
          self.diaryContent || "_还没有内容_",
          previewWrap,
          "",
          this as unknown as Component
        );
        self.diaryTextarea!.oninput = () => {
          self.diaryContent = self.diaryTextarea!.value;
          updateCC();
          previewWrap.empty();
          MarkdownRenderer.render(
            self.app,
            self.diaryTextarea!.value || "_还没有内容_",
            previewWrap,
            "",
            this as unknown as Component
          );
        };
        previewBtn.textContent = "继续编辑";
      } else {
        self.diaryTextarea!.rows = 12;
        previewWrap.style.display = "none";
        self.diaryTextarea!.oninput = () => {
          self.diaryContent = self.diaryTextarea!.value;
          updateCC();
        };
        previewBtn.textContent = "预览";
        self.diaryTextarea!.focus();
      }
    };

    const quickRow = panel.createDiv({ cls: "diary-quick-row" });
    const weatherEmojis = [
      { e: "☀️", l: "晴" },
      { e: "⛅", l: "多云" },
      { e: "🌧️", l: "雨" },
      { e: "🌨️", l: "雪" },
      { e: "🌬️", l: "风" },
      { e: "🌤️", l: "晴转多云" },
    ];
    const moodEmojis = [
      { e: "😊", l: "开心" },
      { e: "😎", l: "很棒" },
      { e: "🤔", l: "思考" },
      { e: "😢", l: "难过" },
      { e: "😠", l: "生气" },
      { e: "😴", l: "困" },
    ];
    const wWrap = quickRow.createDiv({ cls: "diary-quick-group" });
    wWrap.createSpan({ cls: "diary-quick-label", text: "天气" });
    weatherEmojis.forEach((w) => {
      const b = wWrap.createEl("button", { cls: "diary-quick-btn", text: w.e });
      b.title = w.l;
      b.onclick = () => {
        self.insertTextAtCursor(w.e + " " + w.l + " ");
      };
    });
    const mWrap = quickRow.createDiv({ cls: "diary-quick-group" });
    mWrap.createSpan({ cls: "diary-quick-label", text: "心情" });
    moodEmojis.forEach((m) => {
      const b = mWrap.createEl("button", { cls: "diary-quick-btn", text: m.e });
      b.title = m.l;
      b.onclick = () => {
        self.insertTextAtCursor(m.e + " " + m.l + " ");
      };
    });

    const textareaWrap = panel.createDiv({ cls: "diary-textarea-wrap" });
    this.diaryTextarea = textareaWrap.createEl("textarea", {
      cls: "diary-textarea",
      placeholder:
        "在这里记录今天的故事...\n\n点击“插入模板”开始写日记，或直接自由书写。",
    });
    bindModalInputFocus(this.diaryTextarea);
    this.diaryTextarea.value = this.diaryContent || "";
    this.diaryTextarea.rows = 12;
    this.diaryTextarea.oninput = () => {
      self.diaryContent = self.diaryTextarea!.value;
      updateCC();
    };

    const previewWrap = panel.createDiv({ cls: "diary-preview-wrap" });
    previewWrap.style.display = "none";
    const charCount = panel.createDiv({ cls: "diary-char-count" });
    const updateCC = () => {
      charCount.textContent = (self.diaryTextarea!.value || "").length + " 字";
    };
    updateCC();
  }

  insertTextAtCursor(text: string) {
    if (!this.diaryTextarea) return;
    const ta = this.diaryTextarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    this.diaryContent = ta.value;
    ta.focus();
  }

  insertAttachment(label: string, ext: string) {
    const self = this;
    const attachModal = new AttachFileModal(
      self.app,
      self.plugin,
      label,
      self.dateStr,
      (f) => {
        let filename = f;
        if (!filename.includes(".")) filename += "." + ext;
        self.insertTextAtCursor("\n![[" + filename + "]]\n");
      }
    );
    attachModal.open();
  }

  renderCard(item: ScoreItem, grid: HTMLElement, yesterdayData: DayData | null) {
    const self = this;
    const scoreVal = this.scores[item.id] || 0;
    const isEarned = scoreVal > 0;
    const isNeg = scoreVal < 0 || (scoreVal === 0 && item.points < 0);
    const isDeductItem = item.category === "减分" || item.points < 0;
    const isDeductedActive = isDeductItem && scoreVal !== 0;
    const card = grid.createDiv({
      cls:
        "kid-score-card" +
        (isEarned ? " is-earned" : "") +
        (isNeg ? " is-negative" : "") +
        (isDeductedActive ? " is-deducted-active" : ""),
    });
    card.dataset.itemId = item.id;
    const moreBtn = card.createEl("button", {
      cls: "kid-score-card-more-btn",
      text: "⋯",
    });
    moreBtn.setAttribute("aria-label", "调整分值");
    moreBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      self.showCustomValuePopup(item, (v) => {
        self.scores[item.id] = v;
        self.refreshCard(card, item);
        self.updateTotalDisplay();
      }, false);
    };
    card.createDiv({ cls: "card-emoji", text: item.emoji });
    card.createDiv({ cls: "card-name", text: item.name });
    if (item.note) {
      card.createDiv({ cls: "card-note", text: item.note });
    }
    const pointsText =
      scoreVal !== 0
        ? (scoreVal >= 0 ? "+" : "") +
          scoreVal +
          " 分" +
          (scoreVal !== item.points ? " 📝" : "")
        : (item.points >= 0 ? "+" : "") + item.points + " 分";
    card.createDiv({ cls: "card-points", text: pointsText });
    if (yesterdayData) {
      const yScore = yesterdayData.scores[item.id] || 0;
      const yClass = yScore > 0 ? "was-earned" : yScore < 0 ? "was-negative" : "was-missed";
      const ySign = yScore > 0 ? "+" : "";
      card.createDiv({
        cls: "card-yesterday " + yClass,
        text: "昨 " + ySign + yScore + " 分",
      });
    } else {
      card.createDiv({ cls: "card-yesterday was-missed", text: "昨 -" });
    }

    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let isLongPress = false;
    let hasMoved = false;
    let startX = 0;
    let startY = 0;
    let clickTimer: ReturnType<typeof setTimeout> | null = null;
    let lastTapAt = 0;
    const longPressMs = self.getLongPressDuration();
    const isTouchMode = self.isTouchOptimizedMode();

    card.addEventListener("pointerdown", (e) => {
      if (e.target === moreBtn || moreBtn.contains(e.target as Node)) return;
      isLongPress = false;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      pressTimer = setTimeout(() => {
        if (!hasMoved) {
          isLongPress = true;
          self.triggerHaptic("longpress");
          self.showCustomValuePopup(item, (v) => {
            self.scores[item.id] = v;
            self.refreshCard(card, item);
            self.updateTotalDisplay();
          }, false);
        }
      }, longPressMs);
    });
    card.addEventListener("pointermove", (e) => {
      if (!hasMoved && (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8)) {
        hasMoved = true;
        if (pressTimer) clearTimeout(pressTimer);
      }
    });
    card.addEventListener("pointerup", () => {
      if (pressTimer) clearTimeout(pressTimer);
      if (!isLongPress && !hasMoved) {
        if (isTouchMode) {
          self.scores[item.id] = self.scores[item.id] === 0 ? item.points : 0;
          self.refreshCard(card, item);
          self.updateTotalDisplay();
          return;
        }
        const now = Date.now();
        const threshold = self.plugin.getDoubleTapThreshold();
        if (lastTapAt && now - lastTapAt <= threshold) {
          if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
          }
          lastTapAt = 0;
          self.showCustomValuePopup(item, (v) => {
            self.scores[item.id] = v;
            self.refreshCard(card, item);
            self.updateTotalDisplay();
          }, true);
          return;
        }
        lastTapAt = now;
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        clickTimer = setTimeout(() => {
          self.scores[item.id] = self.scores[item.id] === 0 ? item.points : 0;
          self.refreshCard(card, item);
          self.updateTotalDisplay();
          clickTimer = null;
          lastTapAt = 0;
        }, threshold + 20);
      }
    });
    card.addEventListener("pointercancel", () => {
      if (pressTimer) clearTimeout(pressTimer);
      hasMoved = true;
      lastTapAt = 0;
    });
    card.addEventListener("pointerleave", () => {
      if (pressTimer) clearTimeout(pressTimer);
    });
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  refreshCard(card: HTMLElement, item: ScoreItem) {
    const scoreVal = this.scores[item.id] || 0;
    const isEarned = scoreVal > 0;
    const isNeg = scoreVal < 0 || (scoreVal === 0 && item.points < 0);
    const isDeductItem = item.category === "减分" || item.points < 0;
    const isDeductedActive = isDeductItem && scoreVal !== 0;
    card.classList.toggle("is-earned", isEarned);
    card.classList.toggle("is-negative", isNeg);
    card.classList.toggle("is-deducted-active", isDeductedActive);
    const pointsEl = card.querySelector(".card-points");
    if (pointsEl) {
      pointsEl.textContent =
        scoreVal !== 0
          ? (scoreVal >= 0 ? "+" : "") +
            scoreVal +
            " 分" +
            (scoreVal !== item.points ? " 📝" : "")
          : (item.points >= 0 ? "+" : "") + item.points + " 分";
    }
  }

  showCustomValuePopup(item: ScoreItem, callback: (val: number) => void, quickOnly = false) {
    const self = this;

    const openEdit = () => {
      new EditItemModal(self.app, self.plugin, item, async () => {
        await self.renderModal();
      }).open();
    };

    new ScoreItemModal(
      self.app,
      self.plugin,
      item,
      self.scores[item.id] || item.points,
      quickOnly,
      (val) => callback(val),
      () => openEdit()
    ).open();
  }

  showAddItemPopup(category: string) {
    const self = this;
    new AddItemModal(self.app, self.plugin, category, async () => {
      await self.renderModal();
    }).open();
  }

  renderCustomItems() {
    const self = this;
    const container = this.customItemsContainer;
    if (!container) return;
    container.empty();
    if (this.customItems.length === 0) {
      container.createDiv({ cls: "kid-score-custom-empty", text: "暂无临时事项" });
      return;
    }
    for (let i = 0; i < this.customItems.length; i++) {
      ((idx) => {
        const ci = self.customItems[idx];
        const wrap = container.createDiv({ cls: "kid-score-custom-wrap" });
        const row = wrap.createDiv({ cls: "kid-score-custom-row" });
        const main = row.createDiv({ cls: "kid-score-custom-main" });
        main.createSpan({ cls: "custom-emoji", text: ci.emoji });
        main.createSpan({ cls: "custom-name", text: ci.name });
        main.createSpan({
          cls: "custom-points " + (ci.points >= 0 ? "pos" : "neg"),
          text: (ci.points >= 0 ? "+" : "") + ci.points + " 分",
        });
        const quick = row.createEl("button", {
          cls: "custom-row-more-btn",
          text: "调分",
        });
        quick.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          self.showQuickCustomScorePopup(idx);
        };
        const edit = row.createEl("button", { cls: "custom-edit-btn", text: "✏️" });
        edit.onclick = (e) => {
          e.stopPropagation();
          self.showEditCustomItemPopup(idx);
        };
        const del = row.createEl("button", { cls: "custom-delete-btn", text: "🗑" });
        del.onclick = (e) => {
          e.stopPropagation();
          if (!confirm("确定删除临时事项「" + ci.name + "」吗？")) return;
          self.customItems.splice(idx, 1);
          self.renderCustomItems();
          self.updateTotalDisplay();
        };
        if (ci.note) {
          wrap.createDiv({ cls: "custom-item-note", text: ci.note });
        }

        let pressTimer: ReturnType<typeof setTimeout> | null = null;
        let isLongPress = false;
        let hasMoved = false;
        let startX = 0;
        let startY = 0;
        let lastTapAt = 0;
        const longPressMs = self.getLongPressDuration();
        const isTouchMode = self.isTouchOptimizedMode();

        row.addEventListener("pointerdown", (e) => {
          if (
            e.target === del ||
            del.contains(e.target as Node) ||
            e.target === quick ||
            quick.contains(e.target as Node) ||
            e.target === edit ||
            edit.contains(e.target as Node)
          )
            return;
          isLongPress = false;
          hasMoved = false;
          startX = e.clientX;
          startY = e.clientY;
          pressTimer = setTimeout(() => {
            if (!hasMoved) {
              isLongPress = true;
              self.triggerHaptic("longpress");
              self.showEditCustomItemPopup(idx);
            }
          }, longPressMs);
        });
        row.addEventListener("pointermove", (e) => {
          if (!hasMoved && (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8)) {
            hasMoved = true;
            if (pressTimer) clearTimeout(pressTimer);
          }
        });
        row.addEventListener("pointerup", (e) => {
          if (pressTimer) clearTimeout(pressTimer);
          if (
            e.target === del ||
            del.contains(e.target as Node) ||
            e.target === quick ||
            quick.contains(e.target as Node) ||
            e.target === edit ||
            edit.contains(e.target as Node)
          )
            return;
          if (isLongPress || hasMoved) return;
          if (isTouchMode) {
            self.showQuickCustomScorePopup(idx);
            return;
          }
          const now = Date.now();
          const threshold = self.plugin.getDoubleTapThreshold();
          if (lastTapAt && now - lastTapAt <= threshold) {
            lastTapAt = 0;
            self.showQuickCustomScorePopup(idx);
            return;
          }
          lastTapAt = now;
        });
        row.addEventListener("pointercancel", () => {
          if (pressTimer) clearTimeout(pressTimer);
          hasMoved = true;
          lastTapAt = 0;
        });
        row.addEventListener("contextmenu", (e) => {
          e.preventDefault();
        });
      })(i);
    }
  }

  showAddCustomItemForm() {
    const self = this;
    new AddCustomModal(self.app, self.plugin, (emoji, name, points, note) => {
      self.customItems.push({
        id: "custom_" + Date.now(),
        emoji,
        name,
        points,
        note,
      });
      self.renderCustomItems();
      self.updateTotalDisplay();
    }).open();
  }

  showEditCustomItemPopup(idx: number) {
    const self = this;
    const ci = self.customItems[idx];
    if (!ci) return;
    new EditCustomModal(self.app, self.plugin, ci, (emoji, name, points, note) => {
      self.customItems[idx].emoji = emoji;
      self.customItems[idx].name = name;
      self.customItems[idx].points = points;
      self.customItems[idx].note = note;
      self.renderCustomItems();
      self.updateTotalDisplay();
    }).open();
  }

  showQuickCustomScorePopup(idx: number) {
    const self = this;
    const ci = self.customItems[idx];
    if (!ci) return;
    new QuickCustomModal(self.app, self.plugin, ci, (points) => {
      self.customItems[idx].points = points;
      self.renderCustomItems();
      self.updateTotalDisplay();
    }).open();
  }

  async showCalendarPicker() {
    const self = this;
    const allScores = await this.plugin.getAllScores();
    const recordDates = new Set(allScores.map((s) => s.date));

    const overlay = document.createElement("div");
    overlay.className = "kid-score-value-overlay";
    const popup = document.createElement("div");
    popup.className = "kid-score-calendar-popup";

    let viewDate = new Date(self.dateStr + "T00:00:00");

    const header = popup.createDiv({ cls: "cal-header" });
    const prevMonthBtn = header.createEl("button", { cls: "cal-nav-btn", text: "◀" });
    const monthLabel = header.createEl("span", { cls: "cal-month-label" });
    const nextMonthBtn = header.createEl("button", { cls: "cal-nav-btn", text: "▶" });

    const grid = popup.createDiv({ cls: "cal-grid" });
    ["日", "一", "二", "三", "四", "五", "六"].forEach((d) => {
      grid.createEl("div", { cls: "cal-weekday", text: d });
    });

    const renderMonth = () => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      monthLabel.textContent = year + "年" + (month + 1) + "月";
      grid.querySelectorAll(".cal-day").forEach((el) => el.remove());

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startOffset = firstDay.getDay();
      const todayStr = formatDate(0);

      for (let i = 0; i < startOffset; i++) {
        grid.createEl("div", { cls: "cal-day is-empty" });
      }
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const ds =
          year +
          "-" +
          String(month + 1).padStart(2, "0") +
          "-" +
          String(d).padStart(2, "0");
        const cell = grid.createEl("button", { cls: "cal-day" });
        cell.textContent = String(d);
        if (ds === self.dateStr) cell.addClass("is-selected");
        if (ds === todayStr) cell.addClass("is-today");
        if (recordDates.has(ds)) cell.addClass("has-record");
        cell.onclick = () => {
          if (ds > todayStr) return;
          self.dateStr = ds;
          self.renderModal();
          removeOverlay();
        };
      }
    };

    prevMonthBtn.onclick = () => {
      viewDate.setMonth(viewDate.getMonth() - 1);
      renderMonth();
    };
    nextMonthBtn.onclick = () => {
      viewDate.setMonth(viewDate.getMonth() + 1);
      renderMonth();
    };

    renderMonth();

    const cancelBtn = popup.createEl("button", { cls: "value-popup-cancel", text: "取消" });
    cancelBtn.style.marginTop = "10px";
    cancelBtn.style.width = "100%";
    cancelBtn.onclick = () => {
      removeOverlay();
    };
    popup.appendChild(cancelBtn);
    overlay.appendChild(popup);

    const removeOverlay = () => {
      overlay.remove();
      window.removeEventListener("popstate", onPopstate);
      if ((history.state as any)?.kidScoreOverlay) {
        history.back();
      }
    };

    const onPopstate = (e: PopStateEvent) => {
      if ((e.state as any)?.kidScoreOverlay) {
        overlay.remove();
        window.removeEventListener("popstate", onPopstate);
      }
    };
    history.pushState({ kidScoreOverlay: true }, "");
    window.addEventListener("popstate", onPopstate);

    overlay.addEventListener("mousedown", (e) => {
      if (e.target === overlay) {
        e.preventDefault();
        removeOverlay();
      }
    });
    document.body.appendChild(overlay);
  }

  updateTotalDisplay() {
    if (!this.totalDisplay) return;
    let total = 0;
    let completed = 0;
    for (const item of this.plugin.currentUser.items) {
      const val = this.scores[item.id] || 0;
      total += val;
      const isDeduct = item.category === "减分" || item.points < 0;
      if (isDeduct ? val !== 0 : val > 0) {
        completed++;
      }
    }
    completed += this.customItems.length;
    const dailyGoal = this.plugin.currentUser.goals?.daily || 1;
    const pct = Math.min(100, Math.round((completed / dailyGoal) * 100));
    this.totalDisplay.empty();
    this.totalDisplay.createSpan({ text: "🏆 当前总分：" + (total >= 0 ? "+" : "") + total + " 分  " });
    const goalWrap = this.totalDisplay.createSpan({ cls: "daily-goal-wrap" });
    goalWrap.createSpan({ cls: "daily-goal-label", text: "今日目标 " + completed + "/" + dailyGoal });
    const barWrap = goalWrap.createSpan({ cls: "daily-goal-bar-wrap" });
    const bar = barWrap.createSpan({ cls: "daily-goal-bar" });
    bar.style.width = pct + "%";
    if (pct >= 100) bar.addClass("is-complete");
  }
}

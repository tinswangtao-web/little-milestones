import { App, Notice } from "obsidian";
import { BaseMobileModal } from "../../ui/base-mobile-modal";
import type KidScorePlugin from "../../main";
import { attachAutoResize, bindModalInputFocus } from "../../utils/dom";
import { showEmojiPicker } from "../../ui/emoji-picker";

export class AddItemModal extends BaseMobileModal {
  protected enableManualDragAdjustment = true;

  constructor(
    app: App,
    plugin: KidScorePlugin,
    private category: string,
    private onAdded: () => void | Promise<void>
  ) {
    super(app, plugin);
  }

  onOpen(): void {
    this.modalEl.addClass("kid-score-edit-modal");
    super.onOpen();
    this.titleEl.setText("➕ 新增打分项 · " + this.category);
    const c = this.contentEl;
    c.addClass("kid-score-custom-form");

    const mainRow = c.createDiv({ cls: "custom-form-row custom-form-main-row" });
    mainRow.createSpan({ cls: "custom-form-label", text: "名称" });
    const emojiInput = mainRow.createEl("input", { type: "text", cls: "custom-form-emoji-input" });
    emojiInput.value = "⭐";
    emojiInput.maxLength = 2;
    bindModalInputFocus(emojiInput);
    const emojiPickBtn = mainRow.createEl("button", { cls: "diary-tool-btn", text: "🔍" });
    emojiPickBtn.onclick = () => {
      showEmojiPicker((em) => {
        emojiInput.value = em;
      }, this.containerEl);
    };

    const nameInput = mainRow.createEl("input", { type: "text", cls: "custom-form-name-input" });
    nameInput.placeholder = "打分项名称...";
    nameInput.autocomplete = "off";
    bindModalInputFocus(nameInput);

    const pointsRow = c.createDiv({ cls: "custom-form-row" });
    pointsRow.createSpan({ cls: "custom-form-label", text: "分值" });
    const pc = pointsRow.createDiv({ cls: "value-popup-controls" });
    const pm = pc.createEl("button", { cls: "value-popup-adjust", text: "−" });
    const pi = pc.createEl("input", { type: "number", cls: "value-popup-input" });
    pi.value = "1";
    bindModalInputFocus(pi);
    const pp = pc.createEl("button", { cls: "value-popup-adjust", text: "+" });
    pm.onclick = () => { pi.value = String(parseInt(pi.value || "0") - 1); };
    pp.onclick = () => { pi.value = String(parseInt(pi.value || "0") + 1); };

    const noteRow = c.createDiv({ cls: "custom-form-row" });
    noteRow.createSpan({ cls: "custom-form-label", text: "备注" });
    const noteInput = noteRow.createEl("textarea", { cls: "custom-form-name-input" });
    noteInput.addClass("custom-form-note-input");
    noteInput.placeholder = "可选，长按时显示在卡片上，支持多行";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);

    attachAutoResize(noteInput);

    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "取消" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "添加" });
    ok.onclick = async () => {
      try {
        const n = nameInput.value.trim();
        if (!n) {
          nameInput.classList.add("is-error");
          return;
        }
        this.plugin.currentUser.items.push({
          id: "item_" + Date.now(),
          name: n,
          points: parseInt(pi.value) || 1,
          emoji: emojiInput.value.trim() || "⭐",
          category: this.category,
          note: noteInput.value.trim(),
        });
        const cats = this.plugin.currentUser.categories || [];
        this.plugin.currentUser.items.sort((a, b) => {
          let ai = cats.indexOf(a.category);
          if (ai === -1) ai = 9999;
          let bi = cats.indexOf(b.category);
          if (bi === -1) bi = 9999;
          return ai - bi;
        });
        await this.plugin.saveSettings();
        this.close();
        await this.onAdded();
      } catch (e) {
        new Notice("❌ 添加失败：" + (e instanceof Error ? e.message : String(e)));
      }
    };
  }
}

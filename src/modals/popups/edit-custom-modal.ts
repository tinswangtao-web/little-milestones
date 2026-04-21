import { App } from "obsidian";
import { BaseMobileModal } from "../../ui/base-mobile-modal";
import type KidScorePlugin from "../../main";
import type { CustomScoreItem } from "../../types";
import { bindModalInputFocus } from "../../utils/dom";
import { showEmojiPicker } from "../../ui/emoji-picker";

export class EditCustomModal extends BaseMobileModal {
  protected enableManualDragAdjustment = true;

  constructor(
    app: App,
    plugin: KidScorePlugin,
    private item: CustomScoreItem,
    private onSave: (emoji: string, name: string, points: number, note: string) => void
  ) {
    super(app, plugin);
  }

  onOpen(): void {
    super.onOpen();
    this.titleEl.setText("✏️ 编辑临时事项");
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    c.addClass("kid-score-custom-form");

    const emojiRow = c.createDiv({ cls: "custom-form-row" });
    emojiRow.createSpan({ cls: "custom-form-label", text: "图标" });
    const emojiInput = emojiRow.createEl("input", { type: "text", cls: "custom-form-emoji-input" });
    emojiInput.value = this.item.emoji;
    emojiInput.maxLength = 2;
    bindModalInputFocus(emojiInput);
    const emojiPickBtn = emojiRow.createEl("button", { cls: "diary-tool-btn", text: "🔍" });
    emojiPickBtn.style.marginLeft = "4px";
    emojiPickBtn.onclick = () => {
      showEmojiPicker((em) => {
        emojiInput.value = em;
      }, this.containerEl);
    };

    const nameRow = c.createDiv({ cls: "custom-form-row" });
    nameRow.createSpan({ cls: "custom-form-label", text: "事项" });
    const nameInput = nameRow.createEl("input", { type: "text", cls: "custom-form-name-input" });
    nameInput.value = this.item.name;
    nameInput.autocomplete = "off";
    bindModalInputFocus(nameInput);

    const pointsRow = c.createDiv({ cls: "custom-form-row" });
    pointsRow.createSpan({ cls: "custom-form-label", text: "分值" });
    const pc = pointsRow.createDiv({ cls: "value-popup-controls" });
    const pm = pc.createEl("button", { cls: "value-popup-adjust", text: "−" });
    const pi = pc.createEl("input", { type: "number", cls: "value-popup-input" });
    pi.value = String(this.item.points);
    bindModalInputFocus(pi);
    const pp = pc.createEl("button", { cls: "value-popup-adjust", text: "+" });
    pm.onclick = () => { pi.value = String(parseInt(pi.value || "0") - 1); };
    pp.onclick = () => { pi.value = String(parseInt(pi.value || "0") + 1); };

    const noteRow = c.createDiv({ cls: "custom-form-row" });
    noteRow.createSpan({ cls: "custom-form-label", text: "备注" });
    const noteInput = noteRow.createEl("textarea", { cls: "custom-form-name-input" });
    noteInput.addClass("custom-form-note-input");
    noteInput.value = this.item.note || "";
    noteInput.placeholder = "可选，将显示在文档页中，支持多行";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);

    const autoResize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    };
    requestAnimationFrame(() => autoResize(noteInput));
    setTimeout(() => autoResize(noteInput), 60);
    noteInput.addEventListener("input", () => autoResize(noteInput));
    noteInput.addEventListener("focus", () => autoResize(noteInput));

    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "取消" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "保存" });
    ok.onclick = () => {
      const n = nameInput.value.trim();
      if (!n) {
        nameInput.classList.add("is-error");
        return;
      }
      this.onSave(
        emojiInput.value.trim() || "⭐",
        n,
        parseInt(pi.value) || 0,
        noteInput.value.trim()
      );
      this.close();
    };
  }
}

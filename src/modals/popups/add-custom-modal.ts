import { BaseMobileModal } from "../../ui/base-mobile-modal";
import type KidScorePlugin from "../../main";
import type { App } from "obsidian";
import { bindModalInputFocus } from "../../utils/dom";
import { showEmojiPicker } from "../../ui/emoji-picker";

export class AddCustomModal extends BaseMobileModal {
  protected enableManualDragAdjustment = true;

  constructor(
    app: App,
    plugin: KidScorePlugin,
    private onAdded: (emoji: string, name: string, points: number, note: string) => void
  ) {
    super(app, plugin);
  }

  onOpen(): void {
    this.modalEl.addClass("kid-score-edit-modal");
    super.onOpen();
    this.titleEl.setText("📌 添加临时事项");
    const c = this.contentEl;
    c.addClass("kid-score-custom-form");
    c.createEl("div", { cls: "value-popup-hint", text: "可填写备注，记录本次加/扣分原因" });

    const emojiRow = c.createDiv({ cls: "custom-form-row" });
    emojiRow.createSpan({ cls: "custom-form-label", text: "图标" });
    const emojiInput = emojiRow.createEl("input", { type: "text", cls: "custom-form-emoji-input" });
    emojiInput.value = "⭐";
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
    nameInput.placeholder = "事项名称...";
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
    noteInput.placeholder = "可选，将显示在文档页中，支持多行";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);

    const autoResize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    };
    noteInput.addEventListener("input", () => autoResize(noteInput));
    noteInput.addEventListener("focus", () => autoResize(noteInput));

    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "取消" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "添加" });
    ok.onclick = () => {
      const n = nameInput.value.trim();
      if (!n) {
        nameInput.classList.add("is-error");
        return;
      }
      this.onAdded(
        emojiInput.value.trim() || "⭐",
        n,
        parseInt(pi.value) || 0,
        noteInput.value.trim()
      );
      this.close();
    };
  }
}

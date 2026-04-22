import { App } from "obsidian";
import { BaseMobileModal } from "../../ui/base-mobile-modal";
import type KidScorePlugin from "../../main";
import type { CustomScoreItem } from "../../types";
import { bindModalInputFocus } from "../../utils/dom";

export class QuickCustomModal extends BaseMobileModal {
  protected enableManualDragAdjustment = true;

  constructor(
    app: App,
    plugin: KidScorePlugin,
    private item: CustomScoreItem,
    private onConfirm: (points: number) => void
  ) {
    super(app, plugin);
  }

  onOpen(): void {
    this.modalEl.addClass("kid-score-edit-modal");
    super.onOpen();
    this.titleEl.setText(this.item.emoji + " " + this.item.name);
    const c = this.contentEl;
    if (this.item.note) {
      c.createEl("div", { cls: "value-popup-note", text: this.item.note });
    }
    c.createEl("div", { cls: "value-popup-hint", text: "快速修改分值" });

    const controls = c.createDiv({ cls: "value-popup-controls" });
    const minus = controls.createEl("button", { cls: "value-popup-adjust", text: "−" });
    const input = controls.createEl("input", { type: "number", cls: "value-popup-input" });
    input.value = String(this.item.points || 0);
    const plus = controls.createEl("button", { cls: "value-popup-adjust", text: "+" });
    bindModalInputFocus(input);

    minus.onclick = () => {
      input.value = String(parseInt(input.value || "0") - 1);
    };
    plus.onclick = () => {
      input.value = String(parseInt(input.value || "0") + 1);
    };

    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "取消" });
    cb.onclick = () => this.close();

    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "保存" });
    ok.onclick = () => {
      this.onConfirm(parseInt(input.value) || 0);
      this.close();
    };
  }
}

import { App } from "obsidian";
import { BaseMobileModal } from "../../ui/base-mobile-modal";
import type KidScorePlugin from "../../main";
import type { ScoreItem } from "../../types";
import { bindModalInputFocus } from "../../utils/dom";

export class ScoreItemModal extends BaseMobileModal {
  constructor(
    app: App,
    plugin: KidScorePlugin,
    private item: ScoreItem,
    private initialValue: number,
    private quickOnly: boolean,
    private onConfirm: (val: number) => void,
    private onEdit?: () => void
  ) {
    super(app, plugin);
  }

  onOpen(): void {
    super.onOpen();
    this.titleEl.setText(this.item.emoji + " " + this.item.name);
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    if (this.item.note) {
      c.createEl("div", { cls: "value-popup-note", text: this.item.note });
    }
    c.createEl("div", {
      cls: "value-popup-hint",
      text: "默认分值：" + (this.item.points >= 0 ? "+" : "") + this.item.points,
    });

    const controls = c.createDiv({ cls: "value-popup-controls" });
    const minus = controls.createEl("button", { cls: "value-popup-adjust", text: "−" });
    const input = controls.createEl("input", { type: "number", cls: "value-popup-input" });
    input.value = String(this.initialValue);
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

    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "确定" });
    ok.onclick = () => {
      this.onConfirm(parseInt(input.value) || 0);
      this.close();
    };

    if (!this.quickOnly) {
      const delRow = c.createDiv({ cls: "value-popup-del-row" });
      const editBtn = delRow.createEl("button", { cls: "value-popup-edit-btn", text: "✏️ 编辑此项目" });
      editBtn.onclick = () => {
        this.close();
        if (this.onEdit) this.onEdit();
      };
      const delBtn = delRow.createEl("button", { cls: "value-popup-del-btn", text: "🗑 删除此打分项" });
      delBtn.onclick = async () => {
        if (!confirm("确定删除打分项「" + this.item.name + "」吗？")) return;
        this.close();
        const idx = this.plugin.currentUser.items.findIndex((it) => it.id === this.item.id);
        if (idx !== -1) {
          this.plugin.currentUser.items.splice(idx, 1);
          await this.plugin.saveSettings();
        }
      };
    }
  }
}

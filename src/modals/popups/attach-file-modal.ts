import { App } from "obsidian";
import { BaseMobileModal } from "../../ui/base-mobile-modal";
import type KidScorePlugin from "../../main";
import { bindModalInputFocus } from "../../utils/dom";

export class AttachFileModal extends BaseMobileModal {
  constructor(
    app: App,
    plugin: KidScorePlugin,
    private label: string,
    private dateStr: string,
    private onConfirm: (fileName: string) => void
  ) {
    super(app, plugin);
  }

  onOpen(): void {
    super.onOpen();
    this.titleEl.setText("📎 插入" + this.label);
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    c.createEl("div", {
      cls: "value-popup-hint",
      text: "输入文件名（不含扩展名）",
    });
    const fileInput = c.createEl("input", { cls: "custom-form-name-input" });
    fileInput.type = "text";
    fileInput.placeholder = "例如: 今天的照片";
    fileInput.autocomplete = "off";
    bindModalInputFocus(fileInput);

    const quickName = c.createEl("div", { cls: "value-popup-hint" });
    quickName.style.cssText = "cursor:pointer;text-decoration:underline;margin-top:6px";
    quickName.textContent = "💡 默认: " + this.dateStr + "-" + this.label;
    quickName.onclick = () => {
      fileInput.value = this.dateStr + "-" + this.label;
    };

    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "取消" });
    cb.onclick = () => this.close();

    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "插入" });
    ok.onclick = () => {
      let f = fileInput.value.trim();
      if (!f) {
        fileInput.classList.add("is-error");
        return;
      }
      this.onConfirm(f);
      this.close();
    };
  }
}

import { App, Notice } from "obsidian";
import { BaseMobileModal } from "../../ui/base-mobile-modal";
import type KidScorePlugin from "../../main";
import type { ScoreItem } from "../../types";
import { attachAutoResize, bindModalInputFocus } from "../../utils/dom";
import { showEmojiPicker } from "../../ui/emoji-picker";

export class EditItemModal extends BaseMobileModal {
  protected enableManualDragAdjustment = true;

  constructor(
    app: App,
    plugin: KidScorePlugin,
    private item: ScoreItem,
    private onSave: () => void
  ) {
    super(app, plugin);
  }

  onOpen(): void {
    this.modalEl.addClass("little-milestones-edit-modal");
    super.onOpen();
    this.titleEl.setText("✏️ 编辑项目");
    const c = this.contentEl;
    c.addClass("little-milestones-custom-form");

    const mainRow = document.createElement("div");
    mainRow.className = "custom-form-row custom-form-main-row";
    mainRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "名称" }));
    const emojiInput = document.createElement("input");
    emojiInput.type = "text";
    emojiInput.className = "custom-form-emoji-input";
    emojiInput.value = this.item.emoji;
    emojiInput.maxLength = 2;
    bindModalInputFocus(emojiInput);
    const emojiPickBtn = document.createElement("button");
    emojiPickBtn.className = "diary-tool-btn";
    emojiPickBtn.textContent = "🔍";
    emojiPickBtn.onclick = () => {
      showEmojiPicker((em) => {
        emojiInput.value = em;
      }, this.contentEl);
    };
    mainRow.appendChild(emojiInput);
    mainRow.appendChild(emojiPickBtn);
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "custom-form-name-input";
    nameInput.value = this.item.name;
    nameInput.autocomplete = "off";
    bindModalInputFocus(nameInput);
    mainRow.appendChild(nameInput);
    c.appendChild(mainRow);

    const pointsRow = document.createElement("div");
    pointsRow.className = "custom-form-row";
    pointsRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "默认分值" }));
    const pc = document.createElement("div");
    pc.className = "value-popup-controls";
    const pm = document.createElement("button");
    pm.className = "value-popup-adjust";
    pm.textContent = "−";
    const pi = document.createElement("input");
    pi.type = "number";
    pi.className = "value-popup-input";
    pi.value = String(this.item.points);
    pi.setAttribute("inputmode", "numeric");
    bindModalInputFocus(pi);
    const pp = document.createElement("button");
    pp.className = "value-popup-adjust";
    pp.textContent = "+";
    pm.onclick = () => { pi.value = String(parseInt(pi.value || "0") - 1); };
    pp.onclick = () => { pi.value = String(parseInt(pi.value || "0") + 1); };
    pc.appendChild(pm);
    pc.appendChild(pi);
    pc.appendChild(pp);
    pointsRow.appendChild(pc);
    c.appendChild(pointsRow);

    const noteRow = document.createElement("div");
    noteRow.className = "custom-form-row";
    noteRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "备注" }));
    const noteInput = document.createElement("textarea");
    noteInput.className = "custom-form-name-input";
    noteInput.classList.add("custom-form-note-input");
    noteInput.value = this.item.note || "";
    noteInput.placeholder = "可选，长按时显示在卡片上，支持多行";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);
    noteRow.appendChild(noteInput);

    attachAutoResize(noteInput);
    c.appendChild(noteRow);

    const catRow = document.createElement("div");
    catRow.className = "custom-form-row custom-form-category-row";
    catRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "分类" }));
    const catSel = document.createElement("select");
    catSel.className = "custom-form-select";
    (this.plugin.currentUser.categories || []).forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      if (cat === this.item.category) opt.selected = true;
      catSel.appendChild(opt);
    });
    catRow.appendChild(catSel);
    c.appendChild(catRow);

    const acts = document.createElement("div");
    acts.className = "value-popup-actions";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "value-popup-cancel";
    cancelBtn.textContent = "取消";
    cancelBtn.onclick = () => this.close();
    const saveBtn = document.createElement("button");
    saveBtn.className = "value-popup-confirm mod-cta";
    saveBtn.textContent = "保存";
    saveBtn.onclick = async () => {
      try {
        const n = nameInput.value.trim();
        if (!n) {
          nameInput.classList.add("is-error");
          return;
        }
        this.item.name = n;
        this.item.emoji = emojiInput.value.trim() || "⭐";
        this.item.points = parseInt(pi.value) || 0;
        this.item.note = noteInput.value.trim();
        this.item.category = catSel.value;
        await this.plugin.saveSettings();
        this.close();
        this.onSave();
      } catch (e) {
        new Notice("❌ 保存失败：" + (e instanceof Error ? e.message : String(e)));
      }
    };
    acts.appendChild(cancelBtn);
    acts.appendChild(saveBtn);
    c.appendChild(acts);
  }
}

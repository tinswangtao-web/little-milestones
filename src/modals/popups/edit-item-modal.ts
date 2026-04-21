import { App, Notice } from "obsidian";
import { BaseMobileModal } from "../../ui/base-mobile-modal";
import type KidScorePlugin from "../../main";
import type { ScoreItem } from "../../types";
import { bindModalInputFocus } from "../../utils/dom";
import { showEmojiPicker } from "../../ui/emoji-picker";

export class EditItemModal extends BaseMobileModal {
  constructor(
    app: App,
    plugin: KidScorePlugin,
    private item: ScoreItem,
    private onSave: () => void
  ) {
    super(app, plugin);
  }

  onOpen(): void {
    this.modalEl.addClass("kid-score-edit-modal");
    super.onOpen();
    this.titleEl.setText("✏️ 编辑项目");
    const c = this.contentEl;
    c.addClass("kid-score-custom-form");

    const emojiRow = document.createElement("div");
    emojiRow.className = "custom-form-row";
    emojiRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "图标" }));
    const emojiInput = document.createElement("input");
    emojiInput.type = "text";
    emojiInput.className = "custom-form-emoji-input";
    emojiInput.value = this.item.emoji;
    emojiInput.maxLength = 2;
    bindModalInputFocus(emojiInput);
    const emojiPickBtn = document.createElement("button");
    emojiPickBtn.className = "diary-tool-btn";
    emojiPickBtn.textContent = "🔍";
    emojiPickBtn.style.marginLeft = "4px";
    emojiPickBtn.onclick = () => {
      showEmojiPicker((em) => {
        emojiInput.value = em;
      }, this.contentEl);
    };
    emojiRow.appendChild(emojiInput);
    emojiRow.appendChild(emojiPickBtn);
    c.appendChild(emojiRow);

    const nameRow = document.createElement("div");
    nameRow.className = "custom-form-row";
    nameRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "名称" }));
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "custom-form-name-input";
    nameInput.value = this.item.name;
    nameInput.autocomplete = "off";
    bindModalInputFocus(nameInput);
    nameRow.appendChild(nameInput);
    c.appendChild(nameRow);

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
    noteInput.value = this.item.note || "";
    noteInput.placeholder = "可选，长按时显示在卡片上，支持多行";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);
    noteRow.appendChild(noteInput);

    const autoResize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    };
    requestAnimationFrame(() => autoResize(noteInput));
    setTimeout(() => autoResize(noteInput), 60);
    noteInput.addEventListener("input", () => autoResize(noteInput));
    noteInput.addEventListener("focus", () => autoResize(noteInput));
    c.appendChild(noteRow);

    const catRow = document.createElement("div");
    catRow.className = "custom-form-row";
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

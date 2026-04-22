import { Notice } from "obsidian";
import { makeDefaultDiaryModules } from "../constants";
import type KidScorePlugin from "../main";
import { showEmojiPicker } from "../ui/emoji-picker";

interface RenderDiaryModuleSettingsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
}

export function renderDiaryModuleSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput,
}: RenderDiaryModuleSettingsOptions): void {
  const autoResize = (textarea: HTMLTextAreaElement, minHeight = 72) => {
    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = Math.max(minHeight, textarea.scrollHeight) + "px";
    };
    requestAnimationFrame(resize);
    setTimeout(resize, 60);
    textarea.addEventListener("input", resize);
    textarea.addEventListener("focus", resize);
  };

  const section = containerEl.createDiv({ cls: "kid-score-rules-section" });
  const header = section.createDiv({ cls: "kid-score-rules-header" });
  const toggle = header.createEl("span", { cls: "kid-score-rules-toggle", text: "▼" });
  header.createEl("span", { cls: "kid-score-rules-title", text: "🧩 日记模块" });
  header.createSpan({
    cls: "kid-score-rules-desc",
    text: "可以自定义显示在打分页的常用记录模块",
  });
  const body = section.createDiv({ cls: "kid-score-rules-body" });
  let isOpen = true;

  const ensureDiaryModules = () => {
    if (!Array.isArray(plugin.currentUser.diaryModules) || plugin.currentUser.diaryModules.length === 0) {
      plugin.currentUser.diaryModules = makeDefaultDiaryModules();
    }
  };

  const render = () => {
    ensureDiaryModules();
    body.empty();
    const hint = body.createEl("p", {
      cls: "kid-score-hint",
      text: "你可以修改模块名称和提示文案，也可以新增或删除模块。天气/心情会保留快捷 emoji 功能。",
    });
    hint.style.marginBottom = "10px";

    const list = body.createDiv({ cls: "diary-module-settings-list" });
    plugin.currentUser.diaryModules.forEach((moduleDef, idx) => {
      const row = list.createDiv({ cls: "diary-module-settings-row" });
      const main = row.createDiv({ cls: "diary-module-settings-main" });
      const meta = row.createDiv({ cls: "diary-module-settings-meta" });
      const actions = row.createDiv({ cls: "diary-module-settings-actions" });

      const emojiField = main.createDiv({ cls: "diary-module-settings-field is-emoji" });
      emojiField.createEl("label", {
        cls: "diary-module-settings-field-label",
        text: "模块图标",
      });
      const emojiBtn = emojiField.createEl("button", {
        cls: "settings-emoji-btn diary-module-settings-emoji-btn",
        text: moduleDef.emoji || "📝",
      });
      emojiBtn.type = "button";
      emojiBtn.onclick = () => {
        showEmojiPicker(async (emoji: string) => {
          plugin.currentUser.diaryModules[idx].emoji = emoji;
          await plugin.saveSettings();
          emojiBtn.textContent = emoji;
        }, containerEl);
      };

      const labelField = main.createDiv({ cls: "diary-module-settings-field" });
      labelField.createEl("label", {
        cls: "diary-module-settings-field-label",
        text: "模块名称",
      });
      const labelInput = labelField.createEl("input", {
        cls: "diary-module-settings-input",
        type: "text",
      });
      labelInput.value = moduleDef.label || "";
      labelInput.placeholder = "模块名称";
      bindSettingsInput(labelInput);
      labelInput.onchange = async () => {
        plugin.currentUser.diaryModules[idx].label =
          labelInput.value.trim() || moduleDef.label || "新模块";
        await plugin.saveSettings();
        render();
      };

      const placeholderField = main.createDiv({
        cls: "diary-module-settings-field is-wide",
      });
      placeholderField.createEl("label", {
        cls: "diary-module-settings-field-label",
        text: "提示文案",
      });
      const placeholderInput = placeholderField.createEl("textarea", {
        cls: "diary-module-settings-input is-wide diary-module-settings-textarea",
      });
      placeholderInput.value = moduleDef.placeholder || "";
      placeholderInput.placeholder = "提示文案";
      placeholderInput.rows = 2;
      autoResize(placeholderInput, 78);
      bindSettingsInput(placeholderInput);
      placeholderInput.onchange = async () => {
        plugin.currentUser.diaryModules[idx].placeholder = placeholderInput.value.trim();
        await plugin.saveSettings();
      };

      const kindField = meta.createDiv({ cls: "diary-module-settings-field" });
      kindField.createEl("label", {
        cls: "diary-module-settings-field-label",
        text: "记录形式",
      });
      const kindSelect = kindField.createEl("select", {
        cls: "diary-module-settings-select",
      });
      [
        { value: "quick", label: "单行快捷" },
        { value: "multi", label: "多行记录" },
      ].forEach((optionDef) => {
        const opt = kindSelect.createEl("option", {
          text: optionDef.label,
          value: optionDef.value,
        });
        if ((moduleDef.kind || "multi") === optionDef.value) opt.selected = true;
      });
      kindSelect.onchange = async () => {
        plugin.currentUser.diaryModules[idx].kind = kindSelect.value as "quick" | "multi";
        await plugin.saveSettings();
      };

      const delBtn = actions.createEl("button", {
        cls: "settings-delete-btn",
        text: "🗑",
      });
      delBtn.onclick = async () => {
        plugin.currentUser.diaryModules.splice(idx, 1);
        await plugin.saveSettings();
        render();
      };
    });

    const actions = body.createDiv({ cls: "kid-score-rules-actions" });
    const addBtn = actions.createEl("button", {
      cls: "mod-cta kid-score-rules-save-btn",
      text: "＋ 新增模块",
    });
      addBtn.onclick = async () => {
        plugin.currentUser.diaryModules.push({
          id: "module_" + Date.now(),
          emoji: "📝",
          label: "新模块",
          placeholder: "这里写一点今天的记录",
          kind: "multi",
      });
      await plugin.saveSettings();
      render();
    };

    const resetBtn = actions.createEl("button", {
      cls: "kid-score-rules-cancel-btn",
      text: "恢复默认模块",
    });
    resetBtn.onclick = async () => {
      plugin.currentUser.diaryModules = makeDefaultDiaryModules();
      await plugin.saveSettings();
      render();
      new Notice("✅ 已恢复默认日记模块");
    };
  };

  render();

  header.addEventListener("click", () => {
    isOpen = !isOpen;
    toggle.textContent = isOpen ? "▼" : "▶";
    body.toggleClass("is-hidden", !isOpen);
  });
}

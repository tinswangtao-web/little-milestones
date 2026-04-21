import { MarkdownRenderer, Notice } from "obsidian";
import type KidScorePlugin from "../main";

interface RenderRulesSettingsSectionOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
}

export function renderRulesSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput,
}: RenderRulesSettingsSectionOptions): void {
  const section = containerEl.createDiv({ cls: "kid-score-rules-section" });
  const header = section.createDiv({ cls: "kid-score-rules-header" });
  const toggle = header.createEl("span", {
    cls: "kid-score-rules-toggle",
    text: "▶",
  });
  header.createEl("span", { cls: "kid-score-rules-title", text: "📋 打分规则" });
  header.createSpan({
    cls: "kid-score-rules-desc",
    text: "修改后同步到打分页",
  });
  const editBtn = header.createEl("button", {
    cls: "kid-score-rules-edit-btn",
    text: "✏️",
  });
  const body = section.createDiv({ cls: "kid-score-rules-body" });
  const view = body.createDiv({ cls: "kid-score-rules-view" });
  const edit = body.createDiv({ cls: "kid-score-rules-edit is-hidden" });
  const textarea = edit.createEl("textarea", {
    cls: "kid-score-rules-textarea",
  });
  textarea.placeholder = "例如：\n- 完成作业 +2\n- 主动收拾玩具 +1\n- 乱发脾气 -2";
  bindSettingsInput(textarea);
  textarea.value = plugin.currentUser.scoringRules || "";
  const actions = edit.createDiv({ cls: "kid-score-rules-actions" });
  const saveBtn = actions.createEl("button", {
    cls: "mod-cta kid-score-rules-save-btn",
    text: "保存规则",
  });
  const cancelBtn = actions.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "取消",
  });

  const renderView = () => {
    view.empty();
    const text = plugin.currentUser.scoringRules || "";
    if (text.trim()) {
      MarkdownRenderer.render(plugin.app, text, view, "", plugin);
    } else {
      view.createEl("p", {
        cls: "kid-score-rules-empty",
        text: "暂无规则，点击 ✏️ 添加打分规则",
      });
    }
  };

  renderView();
  let open = !!(plugin.currentUser.scoringRules && plugin.currentUser.scoringRules.trim());
  if (!open) {
    body.addClass("is-hidden");
  } else {
    toggle.textContent = "▼";
  }

  header.addEventListener("click", (e) => {
    if (e.target === editBtn || editBtn.contains(e.target as Node)) return;
    open = !open;
    toggle.textContent = open ? "▼" : "▶";
    body.toggleClass("is-hidden", !open);
  });

  let isEditing = false;
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isEditing = !isEditing;
    if (isEditing) {
      open = true;
      toggle.textContent = "▼";
      body.removeClass("is-hidden");
      textarea.value = plugin.currentUser.scoringRules || "";
      view.addClass("is-hidden");
      edit.removeClass("is-hidden");
      textarea.focus();
    } else {
      view.removeClass("is-hidden");
      edit.addClass("is-hidden");
    }
  });

  saveBtn.addEventListener("click", async () => {
    plugin.currentUser.scoringRules = textarea.value;
    await plugin.saveSettings();
    renderView();
    isEditing = false;
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
    new Notice("✅ 规则已保存");
  });

  cancelBtn.addEventListener("click", () => {
    isEditing = false;
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
  });
}

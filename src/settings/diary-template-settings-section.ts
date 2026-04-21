import { MarkdownRenderer, Notice } from "obsidian";
import { DEFAULT_DIARY_TEMPLATE } from "../constants";
import type KidScorePlugin from "../main";

interface RenderDiaryTemplateSettingsSectionOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
}

export function renderDiaryTemplateSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput,
}: RenderDiaryTemplateSettingsSectionOptions): void {
  const section = containerEl.createDiv({ cls: "kid-score-rules-section" });
  const header = section.createDiv({ cls: "kid-score-rules-header" });
  const toggle = header.createEl("span", {
    cls: "kid-score-rules-toggle",
    text: "▼",
  });
  header.createEl("span", { cls: "kid-score-rules-title", text: "📝 日记模板" });
  header.createSpan({
    cls: "kid-score-rules-desc",
    text: "支持 Markdown，修改后同步到打分页",
  });
  const editBtn = header.createEl("button", {
    cls: "kid-score-rules-edit-btn",
    text: "✏️",
  });
  const body = section.createDiv({ cls: "kid-score-rules-body" });
  const view = body.createDiv({ cls: "kid-score-rules-view" });
  const edit = body.createDiv({ cls: "kid-score-rules-edit is-hidden" });
  const textarea = edit.createEl("textarea", { cls: "kid-score-rules-textarea" });
  bindSettingsInput(textarea);
  textarea.value = plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
  textarea.style.minHeight = "220px";
  const previewWrap = edit.createDiv({
    cls: "diary-preview-wrap diary-preview-settings",
  });
  previewWrap.style.display = "none";
  const actions = edit.createDiv({ cls: "kid-score-rules-actions" });
  const previewBtn = actions.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "MD预览",
  });
  const saveBtn = actions.createEl("button", {
    cls: "mod-cta kid-score-rules-save-btn",
    text: "保存模板",
  });
  const cancelBtn = actions.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "取消",
  });

  const renderView = () => {
    view.empty();
    const text = plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
    MarkdownRenderer.render(plugin.app, text, view, "", plugin);
  };

  renderView();
  let open = true;
  let isEditing = false;
  let isPreview = false;

  const refreshPreview = () => {
    previewWrap.empty();
    MarkdownRenderer.render(
      plugin.app,
      textarea.value || "_还没有内容_",
      previewWrap,
      "",
      plugin
    );
  };

  header.addEventListener("click", (e) => {
    if (e.target === editBtn || editBtn.contains(e.target as Node)) return;
    open = !open;
    toggle.textContent = open ? "▼" : "▶";
    body.toggleClass("is-hidden", !open);
  });

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isEditing = !isEditing;
    if (isEditing) {
      open = true;
      toggle.textContent = "▼";
      body.removeClass("is-hidden");
      textarea.value = plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
      view.addClass("is-hidden");
      edit.removeClass("is-hidden");
      isPreview = false;
      previewWrap.style.display = "none";
      previewBtn.textContent = "MD预览";
      textarea.focus();
    } else {
      view.removeClass("is-hidden");
      edit.addClass("is-hidden");
    }
  });

  previewBtn.addEventListener("click", () => {
    isPreview = !isPreview;
    if (isPreview) {
      refreshPreview();
      previewWrap.style.display = "";
      previewBtn.textContent = "关闭预览";
    } else {
      previewWrap.style.display = "none";
      previewBtn.textContent = "MD预览";
    }
  });

  textarea.addEventListener("input", () => {
    if (!isPreview) return;
    refreshPreview();
  });

  saveBtn.addEventListener("click", async () => {
    plugin.currentUser.diaryTemplate = textarea.value;
    await plugin.saveSettings();
    renderView();
    isEditing = false;
    isPreview = false;
    previewWrap.style.display = "none";
    previewBtn.textContent = "MD预览";
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
    new Notice("✅ 日记模板已保存");
  });

  cancelBtn.addEventListener("click", () => {
    isEditing = false;
    isPreview = false;
    previewWrap.style.display = "none";
    previewBtn.textContent = "MD预览";
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
  });
}

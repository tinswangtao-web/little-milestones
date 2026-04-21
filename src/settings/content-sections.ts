import { MarkdownRenderer, Notice } from "obsidian";
import type KidScorePlugin from "../main";
import { DEFAULT_DIARY_TEMPLATE } from "../constants";
import { renderDiaryModuleSettingsSection } from "./diary-module-settings";

interface RenderContentSettingsSectionsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
}

export function renderContentSettingsSections({
  plugin,
  containerEl,
  bindSettingsInput,
}: RenderContentSettingsSectionsOptions) {
  const settingsRulesSection = containerEl.createDiv({ cls: "kid-score-rules-section" });
  const settingsRulesHeader = settingsRulesSection.createDiv({ cls: "kid-score-rules-header" });
  const settingsRulesToggle = settingsRulesHeader.createEl("span", {
    cls: "kid-score-rules-toggle",
    text: "▶",
  });
  settingsRulesHeader.createEl("span", { cls: "kid-score-rules-title", text: "📋 打分规则" });
  settingsRulesHeader.createSpan({ cls: "kid-score-rules-desc", text: "修改后同步到打分页" });
  const settingsRulesEditBtn = settingsRulesHeader.createEl("button", {
    cls: "kid-score-rules-edit-btn",
    text: "✏️",
  });
  const settingsRulesBody = settingsRulesSection.createDiv({ cls: "kid-score-rules-body" });
  const settingsRulesView = settingsRulesBody.createDiv({ cls: "kid-score-rules-view" });
  const settingsRulesEdit = settingsRulesBody.createDiv({ cls: "kid-score-rules-edit is-hidden" });
  const settingsRulesTextarea = settingsRulesEdit.createEl("textarea", {
    cls: "kid-score-rules-textarea",
  });
  settingsRulesTextarea.placeholder = "例如：\n- 完成作业 +2\n- 主动收拾玩具 +1\n- 乱发脾气 -2";
  bindSettingsInput(settingsRulesTextarea);
  settingsRulesTextarea.value = plugin.currentUser.scoringRules || "";
  const settingsRulesActRow = settingsRulesEdit.createDiv({ cls: "kid-score-rules-actions" });
  const settingsRulesSaveBtn = settingsRulesActRow.createEl("button", {
    cls: "mod-cta kid-score-rules-save-btn",
    text: "保存规则",
  });
  const settingsRulesCancelBtn = settingsRulesActRow.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "取消",
  });

  const renderSettingsRules = () => {
    settingsRulesView.empty();
    const text = plugin.currentUser.scoringRules || "";
    if (text.trim()) {
      MarkdownRenderer.render(plugin.app, text, settingsRulesView, "", plugin);
    } else {
      settingsRulesView.createEl("p", {
        cls: "kid-score-rules-empty",
        text: "暂无规则，点击 ✏️ 添加打分规则",
      });
    }
  };
  renderSettingsRules();

  let settingsRulesOpen = !!(plugin.currentUser.scoringRules && plugin.currentUser.scoringRules.trim());
  if (!settingsRulesOpen) {
    settingsRulesBody.addClass("is-hidden");
  } else {
    settingsRulesToggle.textContent = "▼";
  }
  settingsRulesHeader.addEventListener("click", (e) => {
    if (e.target === settingsRulesEditBtn || settingsRulesEditBtn.contains(e.target as Node)) return;
    settingsRulesOpen = !settingsRulesOpen;
    settingsRulesToggle.textContent = settingsRulesOpen ? "▼" : "▶";
    settingsRulesBody.toggleClass("is-hidden", !settingsRulesOpen);
  });
  let settingsRulesIsEditing = false;
  settingsRulesEditBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsRulesIsEditing = !settingsRulesIsEditing;
    if (settingsRulesIsEditing) {
      settingsRulesOpen = true;
      settingsRulesToggle.textContent = "▼";
      settingsRulesBody.removeClass("is-hidden");
      settingsRulesTextarea.value = plugin.currentUser.scoringRules || "";
      settingsRulesView.addClass("is-hidden");
      settingsRulesEdit.removeClass("is-hidden");
      settingsRulesTextarea.focus();
    } else {
      settingsRulesView.removeClass("is-hidden");
      settingsRulesEdit.addClass("is-hidden");
    }
  });
  settingsRulesSaveBtn.addEventListener("click", async () => {
    plugin.currentUser.scoringRules = settingsRulesTextarea.value;
    await plugin.saveSettings();
    renderSettingsRules();
    settingsRulesIsEditing = false;
    settingsRulesView.removeClass("is-hidden");
    settingsRulesEdit.addClass("is-hidden");
    new Notice("✅ 规则已保存");
  });
  settingsRulesCancelBtn.addEventListener("click", () => {
    settingsRulesIsEditing = false;
    settingsRulesView.removeClass("is-hidden");
    settingsRulesEdit.addClass("is-hidden");
  });

  const tmplSection = containerEl.createDiv({ cls: "kid-score-rules-section" });
  const tmplHeader = tmplSection.createDiv({ cls: "kid-score-rules-header" });
  const tmplToggle = tmplHeader.createEl("span", { cls: "kid-score-rules-toggle", text: "▶" });
  tmplHeader.createEl("span", { cls: "kid-score-rules-title", text: "📝 日记模板" });
  tmplHeader.createSpan({ cls: "kid-score-rules-desc", text: "支持 Markdown，修改后同步到打分页" });
  const tmplEditBtn = tmplHeader.createEl("button", { cls: "kid-score-rules-edit-btn", text: "✏️" });
  const tmplBody = tmplSection.createDiv({ cls: "kid-score-rules-body" });
  const tmplView = tmplBody.createDiv({ cls: "kid-score-rules-view" });
  const tmplEdit = tmplBody.createDiv({ cls: "kid-score-rules-edit is-hidden" });
  const tmplTextarea = tmplEdit.createEl("textarea", { cls: "kid-score-rules-textarea" });
  bindSettingsInput(tmplTextarea);
  tmplTextarea.value = plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
  tmplTextarea.style.minHeight = "220px";
  const tmplPreviewWrap = tmplEdit.createDiv({ cls: "diary-preview-wrap diary-preview-settings" });
  tmplPreviewWrap.style.display = "none";
  const tmplActRow = tmplEdit.createDiv({ cls: "kid-score-rules-actions" });
  const tmplPreviewBtn = tmplActRow.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "MD预览",
  });
  const tmplSaveBtn = tmplActRow.createEl("button", {
    cls: "mod-cta kid-score-rules-save-btn",
    text: "保存模板",
  });
  const tmplCancelBtn = tmplActRow.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "取消",
  });

  const renderTemplateView = () => {
    tmplView.empty();
    const text = plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
    MarkdownRenderer.render(plugin.app, text, tmplView, "", plugin);
  };
  renderTemplateView();
  let tmplOpen = true;
  tmplToggle.textContent = "▼";
  let tmplIsEditing = false;
  let tmplIsPreview = false;
  const refreshTemplatePreview = () => {
    tmplPreviewWrap.empty();
    MarkdownRenderer.render(
      plugin.app,
      tmplTextarea.value || "_还没有内容_",
      tmplPreviewWrap,
      "",
      plugin
    );
  };
  tmplHeader.addEventListener("click", (e) => {
    if (e.target === tmplEditBtn || tmplEditBtn.contains(e.target as Node)) return;
    tmplOpen = !tmplOpen;
    tmplToggle.textContent = tmplOpen ? "▼" : "▶";
    tmplBody.toggleClass("is-hidden", !tmplOpen);
  });
  tmplEditBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    tmplIsEditing = !tmplIsEditing;
    if (tmplIsEditing) {
      tmplOpen = true;
      tmplToggle.textContent = "▼";
      tmplBody.removeClass("is-hidden");
      tmplTextarea.value = plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
      tmplView.addClass("is-hidden");
      tmplEdit.removeClass("is-hidden");
      tmplIsPreview = false;
      tmplPreviewWrap.style.display = "none";
      tmplPreviewBtn.textContent = "MD预览";
      tmplTextarea.focus();
    } else {
      tmplView.removeClass("is-hidden");
      tmplEdit.addClass("is-hidden");
    }
  });
  tmplPreviewBtn.addEventListener("click", () => {
    tmplIsPreview = !tmplIsPreview;
    if (tmplIsPreview) {
      refreshTemplatePreview();
      tmplPreviewWrap.style.display = "";
      tmplPreviewBtn.textContent = "关闭预览";
    } else {
      tmplPreviewWrap.style.display = "none";
      tmplPreviewBtn.textContent = "MD预览";
    }
  });
  tmplTextarea.addEventListener("input", () => {
    if (!tmplIsPreview) return;
    refreshTemplatePreview();
  });
  tmplSaveBtn.addEventListener("click", async () => {
    plugin.currentUser.diaryTemplate = tmplTextarea.value;
    await plugin.saveSettings();
    renderTemplateView();
    tmplIsEditing = false;
    tmplIsPreview = false;
    tmplPreviewWrap.style.display = "none";
    tmplPreviewBtn.textContent = "MD预览";
    tmplView.removeClass("is-hidden");
    tmplEdit.addClass("is-hidden");
    new Notice("✅ 日记模板已保存");
  });
  tmplCancelBtn.addEventListener("click", () => {
    tmplIsEditing = false;
    tmplIsPreview = false;
    tmplPreviewWrap.style.display = "none";
    tmplPreviewBtn.textContent = "MD预览";
    tmplView.removeClass("is-hidden");
    tmplEdit.addClass("is-hidden");
  });

  renderDiaryModuleSettingsSection({
    plugin,
    containerEl,
    bindSettingsInput,
  });
}

import { MarkdownRenderer, Notice, type App, type Component } from "obsidian";
import { bindModalInputFocus } from "../../utils/dom";
import type KidScorePlugin from "../../main";
import { renderDesktopRulesSectionLayout } from "./desktop-rules-section";
import { renderMobileRulesSectionLayout } from "./mobile-rules-section";

interface RenderRulesSectionOptions {
  app: App;
  component: Component;
  plugin: KidScorePlugin;
  container: HTMLElement;
  onAfterRulesSaved: () => void;
  isTouchLayout: boolean;
}

export function renderRulesSection({
  app,
  component,
  plugin,
  container,
  onAfterRulesSaved,
  isTouchLayout,
}: RenderRulesSectionOptions): HTMLElement {
  const layout = isTouchLayout
    ? renderMobileRulesSectionLayout(container)
    : renderDesktopRulesSectionLayout(container);
  const { section, header, titleHost, actionHost, body, view, edit } = layout;
  const toggle = titleHost.createEl("span", {
    cls: "little-milestones-rules-toggle",
    text: "▶",
  });
  titleHost.createEl("span", { cls: "little-milestones-rules-title", text: "📋 打分规则" });
  const editBtn = actionHost.createEl("button", {
    cls: "little-milestones-rules-edit-btn",
    text: "✏️",
  });
  const textarea = edit.createEl("textarea", { cls: "little-milestones-rules-textarea" });
  bindModalInputFocus(textarea);
  textarea.value = plugin.currentUser.scoringRules || "";
  const actions = edit.createDiv({ cls: "little-milestones-rules-actions" });
  const saveBtn = actions.createEl("button", {
    cls: "mod-cta little-milestones-rules-save-btn",
    text: "保存规则",
  });
  const cancelBtn = actions.createEl("button", {
    cls: "little-milestones-rules-cancel-btn",
    text: "取消",
  });

  const renderView = () => {
    view.empty();
    const text = plugin.currentUser.scoringRules || "";
    if (text.trim()) {
      MarkdownRenderer.render(app, text, view, "", component);
    } else {
      view.createEl("p", {
        cls: "little-milestones-rules-empty",
        text: "暂无规则，点击 ✏️ 添加打分规则",
      });
    }
  };

  renderView();
  let open = !!(
    plugin.currentUser.scoringRules && plugin.currentUser.scoringRules.trim()
  );
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
    isEditing = false;
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
    renderView();
    onAfterRulesSaved();
    new Notice("✅ 打分规则已保存！");
  });

  cancelBtn.addEventListener("click", () => {
    isEditing = false;
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
  });

  return section;
}

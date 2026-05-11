import { MarkdownRenderer } from "obsidian";
import type { App, Component } from "obsidian";
import { makeDefaultDiaryModules } from "../../constants";
import { attachAutoResize, bindModalInputFocus } from "../../utils/dom";
import type KidScorePlugin from "../../main";
import type { DiaryModuleValues } from "../../types";
import { countDiaryCharacters } from "../../diary/modules";
import {
  createDiaryModuleField,
  createDiaryQuickGroup,
  ensureDefaultDiaryTemplate,
} from "./diary-panel-fields";
import { renderDesktopDiaryPanelLayout } from "./desktop-diary-panel";
import { renderMobileDiaryPanelLayout } from "./mobile-diary-panel";

export interface DiaryPanelControls {
  togglePreview(): void;
  bindActionButtons(buttons: {
    saveBtn: HTMLButtonElement;
    statsBtn: HTMLButtonElement | null;
    actions: HTMLElement;
  }): void;
}

interface DiaryPanelBuilderOptions {
  app: App;
  plugin: KidScorePlugin;
  component: Component;
  panel: HTMLElement;
  diaryContent: string;
  diaryModules: DiaryModuleValues;
  allowDefaultDiaryTemplate: boolean;
  setDiaryTextarea: (textarea: HTMLTextAreaElement | null) => void;
  updateDiaryContent: (content: string) => void;
  updateDiaryModules: (values: DiaryModuleValues) => void;
  quickCustomDrafts?: Record<string, string>;
  updateQuickCustomDraft?: (moduleId: string, value: string) => void;
  composeDiaryContent: () => string;
  insertAttachment: (label: string, ext: string) => void;
  insertDiaryText: (text: string) => void;
  wrapDiarySelection: (prefix: string, suffix?: string, placeholder?: string) => void;
  onModulesChanged: () => Promise<void>;
  requestScrollToModule?: (id: string) => void;
  isTouchLayout: boolean;
}

export function buildDiaryPanel(options: DiaryPanelBuilderOptions): DiaryPanelControls {
  const {
    app,
    plugin,
    component,
    panel,
    diaryContent,
    allowDefaultDiaryTemplate,
    setDiaryTextarea,
    updateDiaryContent,
    updateDiaryModules,
    quickCustomDrafts,
    updateQuickCustomDraft,
    composeDiaryContent,
    insertAttachment,
    insertDiaryText,
    wrapDiarySelection,
    onModulesChanged,
    requestScrollToModule,
    isTouchLayout,
  } = options;

  const diaryModules = options.diaryModules;
  let currentDiaryContent = diaryContent;
  const moduleFields: Array<{ key: string; input: HTMLInputElement | HTMLTextAreaElement }> = [];
  if (!plugin.currentUser.diaryModules || plugin.currentUser.diaryModules.length === 0) {
    plugin.currentUser.diaryModules = makeDefaultDiaryModules();
  }
  const moduleConfig = plugin.currentUser.diaryModules;
  const defaultCommentModule = makeDefaultDiaryModules().find((moduleDef) => moduleDef.id === "comment") || {
    id: "comment",
    emoji: "💬",
    label: "评语",
    placeholder: "可以写今天的评语或反馈",
    kind: "multi" as const,
  };
  if (defaultCommentModule && !moduleConfig.some((moduleDef) => moduleDef.id === "comment")) {
    const insertAfterIndex = moduleConfig.findIndex((moduleDef) => moduleDef.id === "wantToSay");
    moduleConfig.splice(insertAfterIndex >= 0 ? insertAfterIndex + 1 : moduleConfig.length, 0, {
      ...defaultCommentModule,
    });
    void plugin.saveSettings();
  }
  const removeModule = (id: string) => {
    const moduleList = plugin.currentUser.diaryModules;
    const idx = moduleList.findIndex((m) => m.id === id);
    const nextScrollId = moduleList[idx + 1]?.id || moduleList[idx - 1]?.id || null;
    plugin.currentUser.diaryModules = moduleList.filter((m) => m.id !== id);
    if (nextScrollId && requestScrollToModule) {
      requestScrollToModule(nextScrollId);
    }
  };

  let isPreview = false;
  let previewButtonBinder = (_active: boolean) => {};
  let diaryTextarea: HTMLTextAreaElement | null = null;



  const updateCharCount = () => {
    if (!charCount) return;
    const count = countDiaryCharacters(diaryModules, moduleConfig);
    charCount.textContent = "日记字数：" + count + " 字（不含评语）";
    charCount.title = "按字符数统计，仅统计有效用户输入，不含评语模块";
  };

  const syncAndRefresh = () => {
    currentDiaryContent = composeDiaryContent();
    updateDiaryContent(currentDiaryContent);
    updateCharCount();
    if (!isPreview || !previewWrap) return;
    previewWrap.empty();
    MarkdownRenderer.render(app, currentDiaryContent || "_还没有内容_", previewWrap, "", component);
  };

  const scrollDiaryTargetIntoView = (target: HTMLElement | null) => {
    if (!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    });
  };

  const createToolButton = (text: string, onClick: () => void, extraCls = "") => {
    if (!toolbar) return null;
    const btn = toolbar.createEl("button", {
      cls: "diary-tool-btn" + (extraCls ? " " + extraCls : ""),
      text,
    });
    btn.onclick = onClick;
    return btn;
  };

  const togglePreview = () => {
    isPreview = !isPreview;
    if (isPreview) {
      currentDiaryContent = composeDiaryContent();
      updateDiaryContent(currentDiaryContent);
      if (diaryTextarea) diaryTextarea.rows = 5;
      if (previewWrap) {
        previewWrap.style.display = "";
        previewWrap.empty();
        MarkdownRenderer.render(app, currentDiaryContent || "_还没有内容_", previewWrap, "", component);
      }
      scrollDiaryTargetIntoView(previewWrap);
    } else {
      if (diaryTextarea) {
        diaryTextarea.rows = 12;
        diaryTextarea.focus();
      }
      if (previewWrap) previewWrap.style.display = "none";
      scrollDiaryTargetIntoView(textareaWrap);
    }
    previewButtonBinder(isPreview);
  };

  const layout = isTouchLayout
    ? renderMobileDiaryPanelLayout(panel)
    : renderDesktopDiaryPanelLayout(panel);
  const {
    moduleSection,
    moduleGrid,
    quickRow,
    textareaWrap,
    toolbar,
    previewWrap,
    charCount,
    inlinePreviewBtn,
  } = layout;
  const weatherModule = moduleConfig.find((moduleDef) => moduleDef.id === "weather");
  const moodModule = moduleConfig.find((moduleDef) => moduleDef.id === "mood");
  const commentModule = moduleConfig.find((moduleDef) => moduleDef.id === "comment");
  moduleConfig
    .filter(
      (moduleDef) =>
        moduleDef.id !== "weather" && moduleDef.id !== "mood" && moduleDef.id !== "comment"
    )
    .forEach((moduleDef) =>
      createDiaryModuleField({
        app,
        moduleGrid,
        moduleDef,
        diaryModules,
        moduleFields,
        updateDiaryModules,
        syncAndRefresh,
        onModulesChanged,
        panel,
        removeModule,
      })
    );

  createDiaryQuickGroup({
    app,
    quickRow,
    moduleDef: weatherModule,
    defaults: plugin.currentUser.weatherPresets,
    diaryModules,
    moduleFields,
    updateDiaryModules,
    syncAndRefresh,
    panel,
    onModulesChanged,
    removeModule,
    quickCustomDrafts,
    updateQuickCustomDraft,
  });
  createDiaryQuickGroup({
    app,
    quickRow,
    moduleDef: moodModule,
    defaults: plugin.currentUser.moodPresets,
    diaryModules,
    moduleFields,
    updateDiaryModules,
    syncAndRefresh,
    panel,
    onModulesChanged,
    removeModule,
    quickCustomDrafts,
    updateQuickCustomDraft,
  });

  const moduleActions = moduleSection.createDiv({ cls: "diary-module-manage-actions" });
  const addModuleBtn = moduleActions.createEl("button", {
    cls: "diary-tool-btn diary-module-add-btn",
    text: "＋ 新增模块",
  });
  addModuleBtn.onclick = async () => {
    const newId = "module_" + Date.now();
    plugin.currentUser.diaryModules.push({
      id: newId,
      emoji: "📝",
      label: "新模块",
      placeholder: "这里写一点今天的记录",
      kind: "multi",
    });
    if (requestScrollToModule) {
      requestScrollToModule(newId);
    }
    await onModulesChanged();
  };

  inlinePreviewBtn.onclick = () => togglePreview();
  [
    { t: "🖼️ 图片", e: "png" },
    { t: "🎬 视频", e: "mp4" },
    { t: "🎵 音频", e: "mp3" },
  ].forEach((asset) => {
    createToolButton(asset.t, () => insertAttachment(asset.t.split(" ")[1], asset.e), "is-media");
  });
  diaryTextarea = textareaWrap.createEl("textarea", {
    cls: "diary-textarea",
    placeholder: "例如：今天放学后，我和妈妈一起去了公园...",
  });
  bindModalInputFocus(diaryTextarea);
  diaryTextarea.value = diaryModules.freeWrite || "";
  diaryTextarea.rows = 12;
  attachAutoResize(diaryTextarea, { minHeight: 220 });
  diaryTextarea.oninput = () => {
    diaryModules.freeWrite = diaryTextarea!.value;
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  };
  diaryTextarea.addEventListener("focus", () => {
    requestAnimationFrame(() => {
      diaryTextarea!.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  });
  setDiaryTextarea(diaryTextarea);

  if (commentModule) {
    const commentSection = panel.createDiv({
      cls: "diary-module-section diary-comment-section",
    });
    commentSection.createEl("h4", { cls: "diary-module-title", text: "💬 评语" });
    commentSection.createEl("p", {
      cls: "diary-module-hint",
      text: "写在自由记录后面，便于保存前最后补充。",
    });
    const commentGrid = commentSection.createDiv({
      cls: "diary-module-grid diary-comment-grid",
    });
    createDiaryModuleField({
      app,
      moduleGrid: commentGrid,
      moduleDef: commentModule,
      diaryModules,
      moduleFields,
      updateDiaryModules,
      syncAndRefresh,
      onModulesChanged,
      panel,
      removeModule,
    });
  }

  ensureDefaultDiaryTemplate({
    allowDefaultDiaryTemplate,
    diaryModules,
    moduleFields,
    diaryTextarea,
    setDiaryTextarea,
    updateDiaryModules,
    syncAndRefresh,
  });

  updateDiaryContent(currentDiaryContent);
  updateCharCount();

  return {
    togglePreview,
    bindActionButtons: ({ saveBtn, statsBtn, actions }) => {
      previewButtonBinder = (active) => {
        if (inlinePreviewBtn) {
          inlinePreviewBtn.textContent = active ? "返回编辑" : "查看预览";
          inlinePreviewBtn.classList.toggle("is-active", active);
        }
        saveBtn.textContent = active ? "💾 确认保存" : "💾 保存记录";
        saveBtn.classList.toggle("is-preview-ready", active);
        if (statsBtn) statsBtn.classList.toggle("is-muted-during-preview", active);
        actions.classList.toggle("is-preview-mode", active);
      };
      previewButtonBinder(isPreview);
    },
  };
}

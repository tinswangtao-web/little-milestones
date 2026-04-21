import { MarkdownRenderer } from "obsidian";
import type { App, Component } from "obsidian";
import { makeDefaultDiaryModules } from "../../constants";
import { bindModalInputFocus } from "../../utils/dom";
import type KidScorePlugin from "../../main";
import type { DiaryModuleValues } from "../../types";
import {
  createDiaryModuleField,
  createDiaryQuickGroup,
  fillDefaultDiaryTemplate,
} from "./diary-panel-fields";

export interface DiaryPanelControls {
  togglePreview(): void;
  bindActionButtons(buttons: {
    previewBtn: HTMLButtonElement;
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
  setDiaryTextarea: (textarea: HTMLTextAreaElement | null) => void;
  updateDiaryContent: (content: string) => void;
  updateDiaryModules: (values: DiaryModuleValues) => void;
  composeDiaryContent: () => string;
  insertAttachment: (label: string, ext: string) => void;
}

export function buildDiaryPanel(options: DiaryPanelBuilderOptions): DiaryPanelControls {
  const {
    app,
    plugin,
    component,
    panel,
    diaryContent,
    setDiaryTextarea,
    updateDiaryContent,
    updateDiaryModules,
    composeDiaryContent,
    insertAttachment,
  } = options;

  const diaryModules = options.diaryModules;
  let currentDiaryContent = diaryContent;
  const moduleFields: Array<{ key: string; input: HTMLInputElement | HTMLTextAreaElement }> = [];
  const moduleConfig =
    plugin.currentUser.diaryModules && plugin.currentUser.diaryModules.length
      ? plugin.currentUser.diaryModules
      : makeDefaultDiaryModules();

  let isPreview = false;
  let previewWrap: HTMLElement | null = null;
  let previewButtonBinder = (_active: boolean) => {};
  let diaryTextarea: HTMLTextAreaElement | null = null;
  let textareaWrap: HTMLElement | null = null;
  let charCount: HTMLElement | null = null;

  const updateCharCount = () => {
    if (charCount) charCount.textContent = (currentDiaryContent || "").length + " 字";
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

  const toolbar = panel.createDiv({ cls: "diary-toolbar" });
  const templateBtn = toolbar.createEl("button", {
    cls: "diary-tool-btn",
    text: "📋 填入默认模板",
  });
  templateBtn.onclick = () => {
    fillDefaultDiaryTemplate({
      diaryModules,
      moduleFields,
      diaryTextarea,
      setDiaryTextarea,
      updateDiaryModules,
      syncAndRefresh,
    });
    if (moduleFields[0]) moduleFields[0].input.focus();
  };

  [
    { t: "🖼️ 图片", e: "png" },
    { t: "🎬 视频", e: "mp4" },
    { t: "🎵 音频", e: "mp3" },
  ].forEach((asset) => {
    const btn = toolbar.createEl("button", { cls: "diary-tool-btn", text: asset.t });
    btn.onclick = () => insertAttachment(asset.t.split(" ")[1], asset.e);
  });

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

  const moduleSection = panel.createDiv({ cls: "diary-module-section" });
  moduleSection.createEl("h4", { cls: "diary-module-title", text: "🧩 每天小记录" });
  moduleSection.createEl("p", {
    cls: "diary-module-hint",
    text: "先选天气和心情，再用短短的句子记一记今天。",
  });

  const moduleGrid = moduleSection.createDiv({ cls: "diary-module-grid" });
  const weatherModule = moduleConfig.find((moduleDef) => moduleDef.id === "weather");
  const moodModule = moduleConfig.find((moduleDef) => moduleDef.id === "mood");
  moduleConfig
    .filter((moduleDef) => moduleDef.id !== "weather" && moduleDef.id !== "mood")
    .forEach((moduleDef) =>
      createDiaryModuleField({
        moduleGrid,
        moduleDef,
        diaryModules,
        moduleFields,
        updateDiaryModules,
        syncAndRefresh,
      })
    );

  const quickRow = panel.createDiv({ cls: "diary-quick-row" });
  const weatherEmojis = [
    { e: "☀️", l: "晴" },
    { e: "⛅", l: "多云" },
    { e: "🌧️", l: "雨" },
    { e: "🌨️", l: "雪" },
    { e: "🌬️", l: "风" },
    { e: "🌤️", l: "晴转多云" },
  ];
  const moodEmojis = [
    { e: "😊", l: "开心" },
    { e: "😎", l: "很棒" },
    { e: "🤔", l: "思考" },
    { e: "😢", l: "难过" },
    { e: "😠", l: "生气" },
    { e: "😴", l: "困" },
  ];

  createDiaryQuickGroup({
    quickRow,
    moduleDef: weatherModule,
    defaults: weatherEmojis,
    diaryModules,
    moduleFields,
    updateDiaryModules,
    syncAndRefresh,
    panel,
  });
  createDiaryQuickGroup({
    quickRow,
    moduleDef: moodModule,
    defaults: moodEmojis,
    diaryModules,
    moduleFields,
    updateDiaryModules,
    syncAndRefresh,
    panel,
  });

  textareaWrap = panel.createDiv({ cls: "diary-textarea-wrap" });
  textareaWrap.createEl("h4", { cls: "diary-module-title", text: "✍️ 自由记录" });
  textareaWrap.createEl("p", {
    cls: "diary-module-hint",
    text: "这里可以写长一点，想到什么就写什么。",
  });
  diaryTextarea = textareaWrap.createEl("textarea", {
    cls: "diary-textarea",
    placeholder: "例如：今天放学后，我和妈妈一起去了公园...",
  });
  bindModalInputFocus(diaryTextarea);
  diaryTextarea.value = diaryModules.freeWrite || "";
  diaryTextarea.rows = 12;
  diaryTextarea.oninput = () => {
    diaryModules.freeWrite = diaryTextarea!.value;
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  };
  setDiaryTextarea(diaryTextarea);

  previewWrap = panel.createDiv({ cls: "diary-preview-wrap" });
  previewWrap.style.display = "none";
  charCount = panel.createDiv({ cls: "diary-char-count" });
  updateDiaryContent(currentDiaryContent);
  updateCharCount();

  return {
    togglePreview,
    bindActionButtons: ({ previewBtn, saveBtn, statsBtn, actions }) => {
      previewButtonBinder = (active) => {
        previewBtn.textContent = active ? "返回编辑" : "查看预览";
        previewBtn.classList.toggle("is-active", active);
        saveBtn.textContent = active ? "💾 确认保存" : "💾 保存记录";
        saveBtn.classList.toggle("is-preview-ready", active);
        if (statsBtn) statsBtn.classList.toggle("is-muted-during-preview", active);
        actions.classList.toggle("is-preview-mode", active);
      };
      previewButtonBinder(isPreview);
    },
  };
}

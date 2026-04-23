import type { DiaryPanelLayoutRefs } from "./diary-panel-layout";

export function renderMobileDiaryPanelLayout(panel: HTMLElement): DiaryPanelLayoutRefs {
  panel.addClass("mobile-diary-panel");

  const quickSection = panel.createDiv({
    cls: "diary-module-section diary-quick-section diary-quick-section-mobile",
  });
  quickSection.createEl("h4", { cls: "diary-module-title", text: "🌤️ 今天天气和心情" });
  quickSection.createEl("p", {
    cls: "diary-module-hint",
    text: "先点一个最接近的，再补一句更具体的话。",
  });
  const quickRow = quickSection.createDiv({ cls: "diary-quick-row diary-quick-row-mobile" });

  const moduleSection = panel.createDiv({
    cls: "diary-module-section diary-module-section-mobile",
  });
  moduleSection.createEl("h4", { cls: "diary-module-title", text: "🧩 每天小记录" });
  moduleSection.createEl("p", {
    cls: "diary-module-hint",
    text: "先选天气和心情，再用短短的句子记一记今天。",
  });
  const moduleGrid = moduleSection.createDiv({ cls: "diary-module-grid diary-module-grid-mobile" });

  const textareaWrap = panel.createDiv({ cls: "diary-textarea-wrap diary-textarea-wrap-mobile" });
  const freewriteHeader = textareaWrap.createDiv({ cls: "diary-freewrite-header" });
  freewriteHeader.createEl("h4", { cls: "diary-module-title", text: "✍️ 自由记录" });
  const inlinePreviewBtn = freewriteHeader.createEl("button", {
    cls: "diary-tool-btn diary-inline-preview-btn",
    text: "查看预览",
  });
  textareaWrap.createEl("p", {
    cls: "diary-module-hint",
    text: "这里可以写长一点，想到什么就写什么。",
  });
  const toolbar = textareaWrap.createDiv({
    cls: "diary-toolbar diary-freewrite-toolbar diary-freewrite-toolbar-mobile",
  });
  const previewWrap = panel.createDiv({ cls: "diary-preview-wrap" });
  previewWrap.style.display = "none";
  const charCount = panel.createDiv({ cls: "diary-char-count" });

  return {
    moduleSection,
    moduleGrid,
    quickRow,
    textareaWrap,
    toolbar,
    previewWrap,
    charCount,
    inlinePreviewBtn,
  };
}

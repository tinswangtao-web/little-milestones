import type { App } from "obsidian";
import { showEmojiPicker } from "../../ui/emoji-picker";
import {
  createModuleEmojiField,
  createModuleLabelField,
  createModulePlaceholderField,
  createModuleDeleteButton,
} from "../../ui/diary-module-editor";
import { attachAutoResize, bindModalInputFocus } from "../../utils/dom";
import type { DiaryModuleDefinition, DiaryModuleValues } from "../../types";

interface CreateDiaryModuleFieldOptions {
  app: App;
  moduleGrid: HTMLElement;
  moduleDef: DiaryModuleDefinition;
  diaryModules: DiaryModuleValues;
  moduleFields: Array<{ key: string; input: HTMLInputElement | HTMLTextAreaElement }>;
  updateDiaryModules: (values: DiaryModuleValues) => void;
  syncAndRefresh: () => void;
  onModulesChanged: () => Promise<void>;
  panel: HTMLElement;
  removeModule: (id: string) => void;
}

interface CreateDiaryQuickGroupOptions {
  app: App;
  quickRow: HTMLElement;
  moduleDef: DiaryModuleDefinition | undefined;
  defaults: Array<{ e: string; l: string }>;
  diaryModules: DiaryModuleValues;
  moduleFields: Array<{ key: string; input: HTMLInputElement | HTMLTextAreaElement }>;
  updateDiaryModules: (values: DiaryModuleValues) => void;
  syncAndRefresh: () => void;
  panel: HTMLElement;
  onModulesChanged: () => Promise<void>;
  removeModule: (id: string) => void;
}

interface EnsureDefaultDiaryTemplateOptions {
  diaryModules: DiaryModuleValues;
  moduleFields: Array<{ key: string; input: HTMLInputElement | HTMLTextAreaElement }>;
  diaryTextarea: HTMLTextAreaElement | null;
  setDiaryTextarea: (textarea: HTMLTextAreaElement | null) => void;
  updateDiaryModules: (values: DiaryModuleValues) => void;
  syncAndRefresh: () => void;
}

function createModuleManager({
  app,
  host,
  moduleDef,
  diaryModules,
  panel,
  onModulesChanged,
  removeModule,
}: {
  app: App;
  host: HTMLElement;
  moduleDef: DiaryModuleDefinition;
  diaryModules: DiaryModuleValues;
  panel: HTMLElement;
  onModulesChanged: () => Promise<void>;
  removeModule: (id: string) => void;
}): void {
  const manager = host.createDiv({ cls: "diary-module-manager" });
  createModuleEmojiField({
    app,
    host: manager,
    emoji: moduleDef.emoji || "📝",
    onChange: async (emoji) => {
      moduleDef.emoji = emoji;
      await onModulesChanged();
    },
    containerEl: panel,
    btnClass: "diary-module-emoji-btn",
  });
  createModuleLabelField({
    host: manager,
    label: moduleDef.label || "",
    onChange: async (label) => {
      moduleDef.label = label || moduleDef.label || "新模块";
      await onModulesChanged();
    },
  });
  createModuleDeleteButton({
    app,
    host: manager,
    moduleLabel: moduleDef.label || "未命名",
    onDelete: async () => {
      delete diaryModules[moduleDef.id];
      removeModule(moduleDef.id);
      await onModulesChanged();
    },
    btnClass: "diary-module-delete-btn",
  });
  createModulePlaceholderField({
    host,
    placeholder: moduleDef.placeholder || "",
    onChange: async (placeholder) => {
      moduleDef.placeholder = placeholder;
      await onModulesChanged();
    },
    minHeight: 44,
  });
}

export function createDiaryModuleField({
  app,
  moduleGrid,
  moduleDef,
  diaryModules,
  moduleFields,
  updateDiaryModules,
  syncAndRefresh,
}: CreateDiaryModuleFieldOptions): void {
  const card = moduleGrid.createDiv({ cls: "diary-module-card" });
  card.dataset.moduleId = moduleDef.id;
  // Read-only header: just emoji + label, no editable name/placeholder/delete.
  const header = card.createDiv({ cls: "diary-module-readonly-header" });
  header.createSpan({ cls: "diary-module-readonly-emoji", text: moduleDef.emoji || "📝" });
  header.createSpan({ cls: "diary-module-readonly-label", text: moduleDef.label || "" });

  const isMultiline = moduleDef.kind !== "quick";
  const input = isMultiline
    ? card.createEl("textarea", { cls: "diary-module-input is-multiline" })
    : card.createEl("input", { cls: "diary-module-input", type: "text" });
  input.placeholder = moduleDef.placeholder || "";
  input.value = diaryModules[moduleDef.id] || "";
  bindModalInputFocus(input);
  input.addEventListener("input", () => {
    diaryModules[moduleDef.id] = input.value.trim();
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  });
  if (input instanceof HTMLTextAreaElement) {
    attachAutoResize(input, { minHeight: 104 });
  }
  moduleFields.push({ key: moduleDef.id, input });
}

export function createDiaryQuickGroup({
  app,
  quickRow,
  moduleDef,
  defaults,
  diaryModules,
  moduleFields,
  updateDiaryModules,
  syncAndRefresh,
  panel,
  onModulesChanged,
  removeModule,
}: CreateDiaryQuickGroupOptions): void {
  if (!moduleDef) return;
  let customEmoji = defaults[0].e;
  const group = quickRow.createDiv({ cls: "diary-quick-group" });
  group.dataset.moduleId = moduleDef.id;
  // Built-in quick modules (weather/mood) only need a simple read-only header,
  // not the full editable manager (label input, placeholder textarea, delete button).
  if (moduleDef.kind === "quick") {
    const header = group.createDiv({ cls: "diary-quick-built-in-header" });
    header.createSpan({ cls: "diary-quick-built-in-emoji", text: moduleDef.emoji || "📝" });
    header.createSpan({ cls: "diary-quick-built-in-label", text: moduleDef.label || "" });
  } else {
    createModuleManager({
      app,
      host: group,
      moduleDef,
      diaryModules,
      panel,
      onModulesChanged,
      removeModule,
    });
  }
  const valueInput = group.createEl("textarea", {
    cls: "diary-quick-value-input",
  });
  valueInput.placeholder = moduleDef.placeholder || "";
  valueInput.value = diaryModules[moduleDef.id] || "";
  valueInput.rows = 1;
  bindModalInputFocus(valueInput);
  valueInput.addEventListener("input", () => {
    diaryModules[moduleDef.id] = valueInput.value.trim();
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  });
  attachAutoResize(valueInput, { minHeight: 54 });
  moduleFields.push({ key: moduleDef.id, input: valueInput });

  const emojiRow = group.createDiv({ cls: "diary-quick-emoji-row" });
  defaults.forEach((entry) => {
    const btn = emojiRow.createEl("button", {
      cls: "diary-quick-btn",
      text: entry.e,
    });
    btn.title = entry.l;
    btn.onclick = () => {
      valueInput.value = entry.e + " " + entry.l;
      diaryModules[moduleDef.id] = valueInput.value.trim();
      updateDiaryModules(diaryModules);
      syncAndRefresh();
    };
  });

  const customRow = group.createDiv({ cls: "diary-quick-custom-row" });
  const emojiBtn = customRow.createEl("button", {
    cls: "diary-tool-btn diary-quick-picker-btn",
    text: customEmoji,
  });
  emojiBtn.title = "选择其他 emoji";
  emojiBtn.onclick = () => {
    showEmojiPicker((emoji) => {
      customEmoji = emoji;
      emojiBtn.textContent = emoji;
    }, panel);
  };

  const textInput = customRow.createEl("textarea", {
    cls: "diary-quick-text-input",
  });
  textInput.placeholder =
    moduleDef.id === "weather"
      ? "也可以自己写天气，比如 阴天有风"
      : moduleDef.id === "mood"
        ? "也可以自己写心情，比如 有点紧张"
        : "也可以自己补充一句";
  textInput.rows = 2;
  bindModalInputFocus(textInput);
  attachAutoResize(textInput, { minHeight: 72 });
  const addBtn = customRow.createEl("button", {
    cls: "diary-tool-btn diary-quick-add-btn",
    text: "添加",
  });

  const insertCustom = () => {
    const text = textInput.value.trim();
    if (!customEmoji && !text) return;
    const body = [customEmoji, text].filter(Boolean).join(" ").trim();
    const existing = valueInput.value.trim();
    const nextValue =
      !existing ? body : existing.includes(body) ? existing : existing + " / " + body;
    valueInput.value = nextValue;
    diaryModules[moduleDef.id] = nextValue;
    updateDiaryModules(diaryModules);
    syncAndRefresh();
    textInput.value = "";
  };

  addBtn.onclick = insertCustom;
  textInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    insertCustom();
  });
}

export function ensureDefaultDiaryTemplate({
  diaryModules,
  moduleFields,
  diaryTextarea,
  setDiaryTextarea,
  updateDiaryModules,
  syncAndRefresh,
}: EnsureDefaultDiaryTemplateOptions): void {
  const hasAnyContent =
    Object.values(diaryModules).some((value) => String(value || "").trim().length > 0) ||
    moduleFields.some(({ input }) => input.value.trim().length > 0) ||
    !!diaryTextarea?.value.trim();
  if (hasAnyContent) return;
  if (!diaryModules.weather) diaryModules.weather = "☀️ 晴";
  if (!diaryModules.mood) diaryModules.mood = "😊 开心";
  if (!diaryModules.todayThing) diaryModules.todayThing = "今天我做了____。";
  if (!diaryModules.learnedThing) diaryModules.learnedThing = "今天我学会了____。";
  if (!diaryModules.happyThing) diaryModules.happyThing = "今天最开心的是____。";
  if (!diaryModules.wantToSay) diaryModules.wantToSay = "我还想说____。";
  moduleFields.forEach(({ key, input }) => {
    if (input.value.trim()) return;
    input.value = diaryModules[key] || "";
  });
  if (diaryTextarea && !diaryTextarea.value.trim()) {
    diaryTextarea.value = "今天还有一件我想记下来的事：\n";
    diaryModules.freeWrite = diaryTextarea.value;
    setDiaryTextarea(diaryTextarea);
  }
  updateDiaryModules(diaryModules);
  syncAndRefresh();
}

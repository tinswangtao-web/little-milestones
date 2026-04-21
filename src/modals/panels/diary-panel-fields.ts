import { showEmojiPicker } from "../../ui/emoji-picker";
import { bindModalInputFocus } from "../../utils/dom";
import type { DiaryModuleDefinition, DiaryModuleValues } from "../../types";

interface CreateDiaryModuleFieldOptions {
  moduleGrid: HTMLElement;
  moduleDef: DiaryModuleDefinition;
  diaryModules: DiaryModuleValues;
  moduleFields: Array<{ key: string; input: HTMLInputElement | HTMLTextAreaElement }>;
  updateDiaryModules: (values: DiaryModuleValues) => void;
  syncAndRefresh: () => void;
}

interface CreateDiaryQuickGroupOptions {
  quickRow: HTMLElement;
  moduleDef: DiaryModuleDefinition | undefined;
  defaults: Array<{ e: string; l: string }>;
  diaryModules: DiaryModuleValues;
  moduleFields: Array<{ key: string; input: HTMLInputElement | HTMLTextAreaElement }>;
  updateDiaryModules: (values: DiaryModuleValues) => void;
  syncAndRefresh: () => void;
  panel: HTMLElement;
}

interface EnsureDefaultDiaryTemplateOptions {
  diaryModules: DiaryModuleValues;
  moduleFields: Array<{ key: string; input: HTMLInputElement | HTMLTextAreaElement }>;
  diaryTextarea: HTMLTextAreaElement | null;
  setDiaryTextarea: (textarea: HTMLTextAreaElement | null) => void;
  updateDiaryModules: (values: DiaryModuleValues) => void;
  syncAndRefresh: () => void;
}

export function createDiaryModuleField({
  moduleGrid,
  moduleDef,
  diaryModules,
  moduleFields,
  updateDiaryModules,
  syncAndRefresh,
}: CreateDiaryModuleFieldOptions): void {
  const card = moduleGrid.createDiv({ cls: "diary-module-card" });
  card.createSpan({ cls: "diary-module-label", text: moduleDef.label });
  const isMultiline = moduleDef.kind !== "quick";
  const input = isMultiline
    ? card.createEl("textarea", { cls: "diary-module-input is-multiline" })
    : card.createEl("input", { cls: "diary-module-input", type: "text" });
  input.placeholder = moduleDef.placeholder || "";
  input.value = diaryModules[moduleDef.id] || "";
  bindModalInputFocus(input, { scrollOnIOSFocus: false });
  input.addEventListener("input", () => {
    diaryModules[moduleDef.id] = input.value.trim();
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  });
  moduleFields.push({ key: moduleDef.id, input });
}

export function createDiaryQuickGroup({
  quickRow,
  moduleDef,
  defaults,
  diaryModules,
  moduleFields,
  updateDiaryModules,
  syncAndRefresh,
  panel,
}: CreateDiaryQuickGroupOptions): void {
  if (!moduleDef) return;
  let customEmoji = defaults[0].e;
  const group = quickRow.createDiv({ cls: "diary-quick-group" });
  const header = group.createDiv({ cls: "diary-quick-header" });
  header.createSpan({ cls: "diary-quick-label", text: moduleDef.label });
  const valueInput = group.createEl("input", {
    cls: "diary-quick-value-input",
    type: "text",
  });
  valueInput.placeholder = moduleDef.placeholder || "";
  valueInput.value = diaryModules[moduleDef.id] || "";
  bindModalInputFocus(valueInput, { scrollOnIOSFocus: false });
  valueInput.addEventListener("input", () => {
    diaryModules[moduleDef.id] = valueInput.value.trim();
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  });
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

  const textInput = customRow.createEl("input", {
    cls: "diary-quick-text-input",
    type: "text",
  });
  textInput.placeholder =
    moduleDef.id === "weather"
      ? "也可以自己写天气，比如 阴天有风"
      : moduleDef.id === "mood"
        ? "也可以自己写心情，比如 有点紧张"
        : "也可以自己补充一句";
  bindModalInputFocus(textInput, { scrollOnIOSFocus: false });
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

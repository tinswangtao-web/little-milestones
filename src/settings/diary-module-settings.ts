import { Notice } from "obsidian";
import {
  makeDefaultDiaryModules,
  makeDefaultMoodPresets,
  makeDefaultWeatherPresets,
} from "../constants";
import type KidScorePlugin from "../main";
import { showConfirmModal } from "../ui/confirm-modal";
import {
  createModuleEmojiField,
  createModuleLabelField,
  createModulePlaceholderField,
} from "../ui/diary-module-editor";
import { showEmojiPicker } from "../ui/emoji-picker";
import { getMobilePlatform } from "../utils/platform";
import type { DiaryModuleDefinition, DiaryQuickPreset } from "../types";

interface RenderDiaryModuleSettingsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
}

const FIXED_DIARY_MODULE_IDS = new Set(["weather", "mood", "comment"]);

function cloneModule(moduleDef: DiaryModuleDefinition): DiaryModuleDefinition {
  return { ...moduleDef };
}

function ensureDiaryModules(plugin: KidScorePlugin): void {
  const defaults = makeDefaultDiaryModules();
  const current = Array.isArray(plugin.currentUser.diaryModules)
    ? plugin.currentUser.diaryModules
    : [];
  const byId = new Map(current.map((moduleDef) => [moduleDef.id, moduleDef]));

  for (const fallback of defaults) {
    if (!byId.has(fallback.id)) {
      byId.set(fallback.id, cloneModule(fallback));
    }
  }

  const weather = byId.get("weather")!;
  const mood = byId.get("mood")!;
  const comment = byId.get("comment")!;
  const smallRecords = current.filter((moduleDef) => !FIXED_DIARY_MODULE_IDS.has(moduleDef.id));
  plugin.currentUser.diaryModules = [weather, mood, ...smallRecords, comment];
}

function getSmallRecordModules(plugin: KidScorePlugin): DiaryModuleDefinition[] {
  return plugin.currentUser.diaryModules.filter(
    (moduleDef) => !FIXED_DIARY_MODULE_IDS.has(moduleDef.id)
  );
}

function setSmallRecordOrder(plugin: KidScorePlugin, orderedIds: string[]): void {
  const byId = new Map(plugin.currentUser.diaryModules.map((moduleDef) => [moduleDef.id, moduleDef]));
  const weather = byId.get("weather");
  const mood = byId.get("mood");
  const comment = byId.get("comment");
  const orderedSmallRecords = orderedIds
    .map((id) => byId.get(id))
    .filter((moduleDef): moduleDef is DiaryModuleDefinition => !!moduleDef);
  plugin.currentUser.diaryModules = [
    ...(weather ? [weather] : []),
    ...(mood ? [mood] : []),
    ...orderedSmallRecords,
    ...(comment ? [comment] : []),
  ];
}

function ensurePresets(plugin: KidScorePlugin): void {
  if (!Array.isArray(plugin.currentUser.weatherPresets) || plugin.currentUser.weatherPresets.length === 0) {
    plugin.currentUser.weatherPresets = makeDefaultWeatherPresets();
  }
  if (!Array.isArray(plugin.currentUser.moodPresets) || plugin.currentUser.moodPresets.length === 0) {
    plugin.currentUser.moodPresets = makeDefaultMoodPresets();
  }
}

export function renderDiaryModuleSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput,
}: RenderDiaryModuleSettingsOptions): void {
  const section = containerEl.createDiv({ cls: "kid-score-rules-section diary-settings-section" });
  const header = section.createDiv({ cls: "kid-score-rules-header" });
  const toggle = header.createEl("span", { cls: "kid-score-rules-toggle", text: "▼" });
  header.createEl("span", { cls: "kid-score-rules-title", text: "🧩 日记模块" });
  header.createSpan({
    cls: "kid-score-rules-desc",
    text: "天气和心情 / 各项小记录 / 自由记录 / 评语",
  });
  const body = section.createDiv({ cls: "kid-score-rules-body diary-settings-body" });
  let isOpen = true;

  const render = () => {
    ensureDiaryModules(plugin);
    ensurePresets(plugin);
    body.empty();

    renderPresetBlock({
      plugin,
      body,
      bindSettingsInput,
      render,
    });

    renderSmallRecordsBlock({
      plugin,
      body,
      bindSettingsInput,
      render,
      isTouchLayout: getMobilePlatform() !== "desktop",
    });

    renderFreeWriteBlock(body);

    renderCommentBlock({
      plugin,
      body,
      bindSettingsInput,
      render,
    });
  };

  render();

  header.addEventListener("click", () => {
    isOpen = !isOpen;
    toggle.textContent = isOpen ? "▼" : "▶";
    body.toggleClass("is-hidden", !isOpen);
  });
}

function createDiarySettingsBlock(
  body: HTMLElement,
  title: string,
  desc: string
): HTMLElement {
  const block = body.createDiv({ cls: "diary-settings-block" });
  const header = block.createDiv({ cls: "diary-settings-block-header" });
  header.createEl("h4", { cls: "diary-settings-block-title", text: title });
  header.createEl("p", { cls: "diary-settings-block-desc", text: desc });
  return block;
}

function renderPresetBlock({
  plugin,
  body,
  bindSettingsInput,
  render,
}: {
  plugin: KidScorePlugin;
  body: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  render: () => void;
}): void {
  const block = createDiarySettingsBlock(
    body,
    "🌤️ 天气和心情",
    "编辑打分页里的快捷预设；不会改写历史日记中已经保存的天气或心情。"
  );
  const grid = block.createDiv({ cls: "diary-preset-settings-grid" });
  renderPresetGroup({
    plugin,
    host: grid,
    title: "天气预设",
    presets: plugin.currentUser.weatherPresets,
    defaults: makeDefaultWeatherPresets(),
    bindSettingsInput,
    onReset: async () => {
      plugin.currentUser.weatherPresets = makeDefaultWeatherPresets();
      await plugin.saveSettings();
      render();
      new Notice("✅ 已恢复默认天气预设");
    },
  });
  renderPresetGroup({
    plugin,
    host: grid,
    title: "心情预设",
    presets: plugin.currentUser.moodPresets,
    defaults: makeDefaultMoodPresets(),
    bindSettingsInput,
    onReset: async () => {
      plugin.currentUser.moodPresets = makeDefaultMoodPresets();
      await plugin.saveSettings();
      render();
      new Notice("✅ 已恢复默认心情预设");
    },
  });
}

function renderPresetGroup({
  plugin,
  host,
  title,
  presets,
  defaults,
  bindSettingsInput,
  onReset,
}: {
  plugin: KidScorePlugin;
  host: HTMLElement;
  title: string;
  presets: DiaryQuickPreset[];
  defaults: DiaryQuickPreset[];
  bindSettingsInput: (input: HTMLElement | null) => void;
  onReset: () => Promise<void>;
}): void {
  const group = host.createDiv({ cls: "diary-preset-group" });
  const top = group.createDiv({ cls: "diary-preset-group-header" });
  top.createEl("h5", { cls: "diary-preset-title", text: title });
  const resetBtn = top.createEl("button", {
    cls: "kid-score-rules-cancel-btn diary-preset-reset-btn",
    text: "恢复默认",
  });
  resetBtn.type = "button";
  resetBtn.onclick = () => {
    showConfirmModal(plugin.app, {
      title: "恢复默认" + title,
      message: "恢复默认只会重置快捷预设，不会修改历史日记内容。确定继续吗？",
      isDestructive: false,
      onConfirm: onReset,
    });
  };

  const list = group.createDiv({ cls: "diary-preset-list" });
  defaults.forEach((fallback, index) => {
    const preset = presets[index] || fallback;
    const row = list.createDiv({ cls: "diary-preset-row" });
    const emojiBtn = row.createEl("button", {
      cls: "settings-emoji-btn diary-preset-emoji-btn",
      text: preset.emoji || fallback.emoji,
    });
    emojiBtn.type = "button";
    emojiBtn.title = "修改预设图标";
    emojiBtn.onclick = () => {
      showEmojiPicker(async (emoji) => {
        presets[index] = {
          emoji,
          label: presets[index]?.label || fallback.label,
        };
        await plugin.saveSettings();
        emojiBtn.textContent = emoji;
      }, host);
    };

    const labelInput = row.createEl("input", {
      cls: "diary-preset-label-input",
      type: "text",
    });
    labelInput.value = preset.label || fallback.label;
    labelInput.placeholder = fallback.label;
    bindSettingsInput(labelInput);
    row.addEventListener("click", (event) => {
      if (event.target === labelInput || event.target === emojiBtn) return;
      labelInput.focus();
    });
    labelInput.onchange = async () => {
      presets[index] = {
        emoji: presets[index]?.emoji || fallback.emoji,
        label: labelInput.value.trim() || fallback.label,
      };
      await plugin.saveSettings();
    };
  });
}

function renderSmallRecordsBlock({
  plugin,
  body,
  bindSettingsInput,
  render,
  isTouchLayout,
}: {
  plugin: KidScorePlugin;
  body: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  render: () => void;
  isTouchLayout: boolean;
}): void {
  const block = createDiarySettingsBlock(
    body,
    "🧩 各项小记录",
    "这些小模块可拖动排序；排序只影响本区块，打分页会按这里的顺序展示。"
  );
  const list = block.createDiv({ cls: "diary-module-settings-list diary-small-records-list" });
  const smallRecords = getSmallRecordModules(plugin);

  if (smallRecords.length === 0) {
    list.createEl("p", { cls: "kid-score-hint", text: "还没有小记录模块。" });
  }

  const dragState = {
    dragging: false,
    dragId: "",
    placeholder: null as HTMLElement | null,
    ghost: null as HTMLElement | null,
    rows: [] as HTMLElement[],
  };

  const getTargetIndex = (clientY: number) => {
    for (let index = 0; index < dragState.rows.length; index++) {
      const rect = dragState.rows[index].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return index;
    }
    return dragState.rows.length;
  };

  const cleanupDrag = () => {
    document.removeEventListener("pointermove", pointerMoveHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
    document.removeEventListener("pointercancel", pointerCancelHandler);
    if (dragState.ghost) dragState.ghost.remove();
    if (dragState.placeholder) dragState.placeholder.remove();
    dragState.ghost = null;
    dragState.placeholder = null;
    dragState.dragging = false;
    document.body.style.userSelect = "";
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = "";
  };

  const pointerMoveHandler = (e: PointerEvent) => {
    if (!dragState.dragging) return;
    if (dragState.ghost) dragState.ghost.style.top = e.clientY - 20 + "px";
    const parent = dragState.rows[0]?.parentElement;
    if (!parent || !dragState.placeholder) return;
    const targetIdx = getTargetIndex(e.clientY);
    if (targetIdx >= dragState.rows.length) {
      parent.appendChild(dragState.placeholder);
    } else {
      parent.insertBefore(dragState.placeholder, dragState.rows[targetIdx]);
    }
  };

  const pointerUpHandler = async (e: PointerEvent) => {
    if (!dragState.dragging) return;
    const fromIdx = smallRecords.findIndex((moduleDef) => moduleDef.id === dragState.dragId);
    const targetIdx = getTargetIndex(e.clientY);
    let insertIdx = targetIdx;
    if (targetIdx > fromIdx) insertIdx--;
    cleanupDrag();
    if (fromIdx >= 0 && insertIdx >= 0 && fromIdx !== insertIdx) {
      const ids = smallRecords.map((moduleDef) => moduleDef.id);
      const [moved] = ids.splice(fromIdx, 1);
      ids.splice(insertIdx, 0, moved);
      setSmallRecordOrder(plugin, ids);
      await plugin.saveSettings();
    }
    render();
  };

  const pointerCancelHandler = () => {
    cleanupDrag();
    render();
  };

  const startDrag = (moduleDef: DiaryModuleDefinition, row: HTMLElement, clientY: number) => {
    dragState.dragging = true;
    dragState.dragId = moduleDef.id;
    dragState.rows = Array.from(list.querySelectorAll(".diary-module-settings-row")) as HTMLElement[];
    const rect = row.getBoundingClientRect();
    const ghost = row.cloneNode(true) as HTMLElement;
    ghost.className = "diary-module-settings-row diary-module-settings-drag-ghost";
    ghost.style.cssText =
      "position:fixed;left:" +
      rect.left +
      "px;top:" +
      (clientY - 20) +
      "px;width:" +
      rect.width +
      "px;z-index:10000;opacity:0.88;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.22);background:var(--background-primary);border-radius:12px;";
    document.body.appendChild(ghost);
    dragState.ghost = ghost;
    const placeholder = document.createElement("div");
    placeholder.className = "diary-module-settings-drag-placeholder";
    placeholder.style.height = rect.height + "px";
    if (row.parentElement) row.parentElement.insertBefore(placeholder, row);
    dragState.placeholder = placeholder;
    row.style.display = "none";
    document.body.style.userSelect = "none";
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = "none";
    document.addEventListener("pointermove", pointerMoveHandler);
    document.addEventListener("pointerup", pointerUpHandler);
    document.addEventListener("pointercancel", pointerCancelHandler);
  };

  smallRecords.forEach((moduleDef) => {
    const row = list.createDiv({
      cls:
        "diary-module-settings-row diary-small-record-row" +
        (isTouchLayout ? " diary-small-record-row-mobile" : " diary-small-record-row-desktop"),
    });
    row.dataset.moduleId = moduleDef.id;
    const compact = row.createDiv({ cls: "diary-small-record-compact" });
    const handle = compact.createEl("span", {
      cls: "settings-drag-handle diary-module-drag-handle",
      text: "☰",
    });
    handle.title = "拖动排序";
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      startDrag(moduleDef, row, e.clientY);
    });

    createModuleEmojiField({
      app: plugin.app,
      host: compact,
      emoji: moduleDef.emoji || "📝",
      onChange: async (emoji) => {
        moduleDef.emoji = emoji;
        await plugin.saveSettings();
      },
      containerEl: body,
      btnClass: "diary-small-record-emoji-btn",
    });

    const labelInput = createModuleLabelField({
      host: compact,
      label: moduleDef.label || "",
      inputClass: "diary-module-settings-input diary-small-record-name-input",
      skipBindInputFocus: true,
      onChange: async (label) => {
        moduleDef.label = label || moduleDef.label || "新模块";
        await plugin.saveSettings();
        render();
      },
    });
    bindSettingsInput(labelInput);

    const del = compact.createEl("button", {
      cls: "diary-tool-btn diary-module-delete-btn settings-delete-btn diary-small-record-delete-btn",
      text: "🗑",
    });
    del.type = "button";
    del.title = "删除模块";
    del.onclick = () => {
      showConfirmModal(plugin.app, {
        title: "删除日记模块",
        message: "确定删除日记模块「" + (moduleDef.label || "未命名") + "」吗？",
        isDestructive: true,
        onConfirm: async () => {
          plugin.currentUser.diaryModules = plugin.currentUser.diaryModules.filter(
            (item) => item.id !== moduleDef.id
          );
          await plugin.saveSettings();
          render();
        },
      });
    };

    const details = row.createDiv({ cls: "diary-small-record-details" });
    const placeholderField = details.createDiv({ cls: "diary-module-settings-field is-wide" });
    placeholderField.createEl("label", {
      cls: "diary-module-settings-field-label",
      text: "提示文案",
    });
    const placeholderInput = createModulePlaceholderField({
      host: placeholderField,
      placeholder: moduleDef.placeholder || "",
      inputClass: "diary-module-settings-input is-wide diary-module-settings-textarea",
      minHeight: 58,
      skipBindInputFocus: true,
      onChange: async (placeholder) => {
        moduleDef.placeholder = placeholder;
        await plugin.saveSettings();
      },
    });
    bindSettingsInput(placeholderInput);
  });

  const actions = block.createDiv({ cls: "kid-score-rules-actions" });
  const addBtn = actions.createEl("button", {
    cls: "mod-cta kid-score-rules-save-btn",
    text: "＋ 新增小记录",
  });
  addBtn.onclick = async () => {
    const newModule: DiaryModuleDefinition = {
      id: "module_" + Date.now(),
      emoji: "📝",
      label: "新模块",
      placeholder: "这里写一点今天的记录",
      kind: "multi",
    };
    const commentIndex = plugin.currentUser.diaryModules.findIndex((moduleDef) => moduleDef.id === "comment");
    plugin.currentUser.diaryModules.splice(
      commentIndex >= 0 ? commentIndex : plugin.currentUser.diaryModules.length,
      0,
      newModule
    );
    await plugin.saveSettings();
    render();
  };

  const resetBtn = actions.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "恢复默认模块",
  });
  resetBtn.onclick = () => {
    showConfirmModal(plugin.app, {
      title: "恢复默认模块",
      message: "恢复默认模块会替换当前小记录、天气/心情模块和评语设置，但不会修改历史日记内容。确定继续吗？",
      isDestructive: true,
      onConfirm: async () => {
        plugin.currentUser.diaryModules = makeDefaultDiaryModules();
        await plugin.saveSettings();
        render();
        new Notice("✅ 已恢复默认日记模块");
      },
    });
  };
}

function renderFreeWriteBlock(body: HTMLElement): void {
  createDiarySettingsBlock(
    body,
    "✍️ 自由记录",
    "自由记录固定显示在各项小记录之后，用于长文本、图片、视频和音频补充。"
  );
}

function renderCommentBlock({
  plugin,
  body,
  bindSettingsInput,
  render,
}: {
  plugin: KidScorePlugin;
  body: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  render: () => void;
}): void {
  const block = createDiarySettingsBlock(
    body,
    "💬 评语",
    "评语固定显示在自由记录之后，作为保存前的最后补充模块。"
  );
  const commentModule = plugin.currentUser.diaryModules.find((moduleDef) => moduleDef.id === "comment");
  if (!commentModule) return;

  const row = block.createDiv({ cls: "diary-module-settings-row diary-comment-settings-row" });
  const compact = row.createDiv({ cls: "diary-small-record-compact diary-comment-settings-compact" });
  createModuleEmojiField({
    app: plugin.app,
    host: compact,
    emoji: commentModule.emoji || "💬",
    onChange: async (emoji) => {
      commentModule.emoji = emoji;
      await plugin.saveSettings();
    },
    containerEl: body,
    btnClass: "diary-small-record-emoji-btn",
  });
  const labelInput = createModuleLabelField({
    host: compact,
    label: commentModule.label || "评语",
    inputClass: "diary-module-settings-input diary-small-record-name-input",
    skipBindInputFocus: true,
    onChange: async (label) => {
      commentModule.label = label || "评语";
      await plugin.saveSettings();
      render();
    },
  });
  bindSettingsInput(labelInput);

  const details = row.createDiv({ cls: "diary-small-record-details" });
  const placeholderField = details.createDiv({ cls: "diary-module-settings-field is-wide" });
  placeholderField.createEl("label", {
    cls: "diary-module-settings-field-label",
    text: "提示文案",
  });
  const placeholderInput = createModulePlaceholderField({
    host: placeholderField,
    placeholder: commentModule.placeholder || "",
    inputClass: "diary-module-settings-input is-wide diary-module-settings-textarea",
    minHeight: 58,
    skipBindInputFocus: true,
    onChange: async (placeholder) => {
      commentModule.placeholder = placeholder;
      await plugin.saveSettings();
    },
  });
  bindSettingsInput(placeholderInput);
}

import type { App } from "obsidian";
import { showEmojiPicker } from "./emoji-picker";
import { showConfirmModal } from "./confirm-modal";
import { attachAutoResize, bindModalInputFocus } from "../utils/dom";

export interface CreateModuleEmojiFieldOptions {
  app: App;
  host: HTMLElement;
  emoji: string;
  onChange: (emoji: string) => void | Promise<void>;
  containerEl?: HTMLElement;
  btnClass?: string;
}

export function createModuleEmojiField(
  options: CreateModuleEmojiFieldOptions
): HTMLButtonElement {
  const { app, host, emoji, onChange, containerEl, btnClass } = options;
  const cls =
    "settings-emoji-btn diary-module-settings-emoji-btn" +
    (btnClass ? " " + btnClass : "");
  const btn = host.createEl("button", { cls, text: emoji || "📝" });
  btn.type = "button";
  btn.title = "修改模块图标";
  btn.onclick = () => {
    showEmojiPicker(async (em: string) => {
      await onChange(em);
      btn.textContent = em;
    }, containerEl || host);
  };
  return btn;
}

export interface CreateModuleLabelFieldOptions {
  host: HTMLElement;
  label: string;
  placeholder?: string;
  onChange: (label: string) => void | Promise<void>;
  inputClass?: string;
  skipBindInputFocus?: boolean;
}

export function createModuleLabelField(
  options: CreateModuleLabelFieldOptions
): HTMLInputElement {
  const { host, label, placeholder = "模块名称", onChange, inputClass } = options;
  const cls = "diary-module-title-input" + (inputClass ? " " + inputClass : "");
  const input = host.createEl("input", { cls, type: "text" });
  input.value = label || "";
  input.placeholder = placeholder;
  if (!options.skipBindInputFocus) {
    bindModalInputFocus(input);
  }
  input.onchange = async () => {
    await onChange(input.value.trim());
  };
  return input;
}

export interface CreateModulePlaceholderFieldOptions {
  host: HTMLElement;
  placeholder: string;
  onChange: (placeholder: string) => void | Promise<void>;
  inputClass?: string;
  minHeight?: number;
  skipBindInputFocus?: boolean;
}

export function createModulePlaceholderField(
  options: CreateModulePlaceholderFieldOptions
): HTMLTextAreaElement {
  const { host, placeholder, onChange, inputClass, minHeight = 44 } = options;
  const cls =
    "diary-module-placeholder-editor" +
    (inputClass ? " " + inputClass : "");
  const input = host.createEl("textarea", { cls });
  input.value = placeholder || "";
  input.placeholder = "提示文案";
  input.rows = 1;
  if (!options.skipBindInputFocus) {
    bindModalInputFocus(input);
  }
  attachAutoResize(input, { minHeight });
  input.onchange = async () => {
    await onChange(input.value.trim());
  };
  return input;
}

export interface CreateModuleDeleteButtonOptions {
  app: App;
  host: HTMLElement;
  moduleLabel: string;
  onDelete: () => void | Promise<void>;
  btnClass?: string;
}

export function createModuleDeleteButton(
  options: CreateModuleDeleteButtonOptions
): HTMLButtonElement {
  const { app, host, moduleLabel, onDelete, btnClass } = options;
  const cls =
    "diary-tool-btn diary-module-delete-btn" +
    (btnClass ? " " + btnClass : "");
  const btn = host.createEl("button", { cls, text: "🗑" });
  btn.title = "删除模块";
  btn.onclick = () => {
    showConfirmModal(app, {
      title: "删除日记模块",
      message:
        "确定删除日记模块「" + (moduleLabel || "未命名") + "」吗？",
      isDestructive: true,
      onConfirm: async () => {
        await onDelete();
      },
    });
  };
  return btn;
}

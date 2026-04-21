import type { App } from "obsidian";
import type KidScorePlugin from "../../main";
import type { CustomScoreItem, ScoreItem } from "../../types";
import { AddCustomModal } from "../popups/add-custom-modal";
import { AddItemModal } from "../popups/add-item-modal";
import { AttachFileModal } from "../popups/attach-file-modal";
import { EditCustomModal } from "../popups/edit-custom-modal";
import { EditItemModal } from "../popups/edit-item-modal";
import { QuickCustomModal } from "../popups/quick-custom-modal";
import { ScoreItemModal } from "../popups/score-item-modal";

export function openScoreItemValueModal(options: {
  app: App;
  plugin: KidScorePlugin;
  item: ScoreItem;
  currentValue: number;
  quickOnly?: boolean;
  onValue: (value: number) => void;
  onRefresh: () => Promise<void>;
}) {
  const { app, plugin, item, currentValue, quickOnly = false, onValue, onRefresh } = options;
  const openEdit = () => {
    new EditItemModal(app, plugin, item, async () => {
      await onRefresh();
    }).open();
  };
  new ScoreItemModal(app, plugin, item, currentValue, quickOnly, onValue, openEdit).open();
}

export function openAddItemModal(
  app: App,
  plugin: KidScorePlugin,
  category: string,
  onRefresh: () => Promise<void>
) {
  new AddItemModal(app, plugin, category, async () => {
    await onRefresh();
  }).open();
}

export function openAttachmentInsertModal(options: {
  app: App;
  plugin: KidScorePlugin;
  label: string;
  ext: string;
  dateStr: string;
  onInsert: (text: string) => void;
}) {
  const { app, plugin, label, ext, dateStr, onInsert } = options;
  new AttachFileModal(app, plugin, label, dateStr, (fileName) => {
    let filename = fileName;
    if (!filename.includes(".")) filename += "." + ext;
    onInsert("\n![[" + filename + "]]\n");
  }).open();
}

export function openAddCustomItemModal(options: {
  app: App;
  plugin: KidScorePlugin;
  onSubmit: (emoji: string, name: string, points: number, note: string) => void;
}) {
  new AddCustomModal(options.app, options.plugin, options.onSubmit).open();
}

export function openEditCustomItemModal(options: {
  app: App;
  plugin: KidScorePlugin;
  customItem?: CustomScoreItem;
  onSubmit: (emoji: string, name: string, points: number, note: string) => void;
}) {
  const { app, plugin, customItem, onSubmit } = options;
  if (!customItem) return;
  new EditCustomModal(app, plugin, customItem, onSubmit).open();
}

export function openQuickCustomAdjustModal(options: {
  app: App;
  plugin: KidScorePlugin;
  customItem?: CustomScoreItem;
  onSubmit: (points: number) => void;
}) {
  const { app, plugin, customItem, onSubmit } = options;
  if (!customItem) return;
  new QuickCustomModal(app, plugin, customItem, onSubmit).open();
}

import { Notice, Setting } from "obsidian";
import type KidScorePlugin from "../main";
import { sortItemsByCategories } from "./item-sorting";
import { renderItemSettingsList } from "./item-settings-list";

interface RenderItemSettingsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
}

export function renderItemSettings({
  plugin,
  containerEl,
  bindSettingsInput,
}: RenderItemSettingsOptions) {
  let pendingScrollItemId: string | null = null;

  containerEl.createEl("h3", { text: "📝 打分项目管理" });
  containerEl.createEl("p", {
    cls: "kid-score-hint",
    text: "点击表情按钮打开emoji选择器。按住 ☰ 拖动排序。",
  });

  const itemsWrap = containerEl.createDiv({ cls: "kid-score-settings-items" });
  const renderItems = () =>
    renderItemSettingsList({
      plugin,
      itemsWrap,
      bindSettingsInput,
      pendingScrollItemId,
      setPendingScrollItemId: (itemId) => {
        pendingScrollItemId = itemId;
      },
    });

  renderItems();

  new Setting(containerEl)
    .setName("添加新项目")
    .addButton((btn) =>
      btn
        .setButtonText("＋ 添加项目")
        .setCta()
        .onClick(async () => {
          const defaultCat = plugin.currentUser.categories[0] || "加分项";
          const newItemId = "item_" + Date.now();
          plugin.currentUser.items.push({
            id: newItemId,
            name: "新项目",
            points: 1,
            emoji: "⭐",
            category: defaultCat,
            note: "",
          });
          sortItemsByCategories(plugin.currentUser.items, plugin.currentUser.categories || []);
          await plugin.saveSettings();
          pendingScrollItemId = newItemId;
          renderItems();
        })
    )
    .addButton((btn) =>
      btn.setButtonText("📂 按分类排序").onClick(async () => {
        sortItemsByCategories(plugin.currentUser.items, plugin.currentUser.categories || []);
        await plugin.saveSettings();
        renderItems();
        new Notice("✅ 已按分类排序");
      })
    );
}

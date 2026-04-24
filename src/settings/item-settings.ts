import { Notice, Setting } from "obsidian";
import type KidScorePlugin from "../main";
import { sortItemsByCategories } from "./item-sorting";
import { renderItemSettingsList } from "./item-settings-list";
import { renderDesktopSettingsSectionShell } from "./desktop-settings-shells";
import { renderMobileSettingsSectionShell } from "./mobile-settings-shells";

interface RenderItemSettingsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  isTouchLayout: boolean;
}

export function renderItemSettings({
  plugin,
  containerEl,
  bindSettingsInput,
  isTouchLayout,
}: RenderItemSettingsOptions) {
  let pendingScrollItemId: string | null = null;

  const shell = isTouchLayout
    ? renderMobileSettingsSectionShell(
        containerEl,
        "kid-score-item-management-section",
        "📝 打分项目管理",
        "点击表情按钮打开 emoji 选择器。按住 ☰ 拖动排序。"
      )
    : renderDesktopSettingsSectionShell(
        containerEl,
        "kid-score-item-management-section",
        "📝 打分项目管理",
        "点击表情按钮打开 emoji 选择器。按住 ☰ 拖动排序。"
      );

  const itemsWrap = shell.body.createDiv({ cls: "kid-score-settings-items" });
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

  const actionsHost = shell.body.createDiv({
    cls:
      "kid-score-settings-actions " +
      (isTouchLayout
        ? "kid-score-settings-actions-mobile"
        : "kid-score-settings-actions-desktop"),
  });

  new Setting(actionsHost)
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

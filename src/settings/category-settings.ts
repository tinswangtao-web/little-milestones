import { Notice, Setting } from "obsidian";
import type KidScorePlugin from "../main";
import { renderCategorySettingsList } from "./category-settings-list";

interface RenderCategorySettingsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  refreshItems: () => void;
}

export function renderCategorySettings({
  plugin,
  containerEl,
  bindSettingsInput,
  refreshItems,
}: RenderCategorySettingsOptions) {
  const catHeaderWrap = containerEl.createDiv({ cls: "kid-score-section-header" });
  catHeaderWrap.createEl("h3", { text: "📁 分类管理" });
  catHeaderWrap.createSpan({ cls: "kid-score-section-desc", text: "可拖拽排序，项目会按分类分组显示" });

  const catWrap = containerEl.createDiv({ cls: "kid-score-cat-list" });
  const renderCategories = () =>
    renderCategorySettingsList({
      plugin,
      catWrap,
      bindSettingsInput,
      refreshItems,
    });

  renderCategories();

  new Setting(containerEl)
    .setName("添加分类")
    .addButton((btn) =>
      btn
        .setButtonText("＋ 新分类")
        .setCta()
        .onClick(async () => {
          plugin.currentUser.categories.push("新分类");
          await plugin.saveSettings();
          renderCategories();
          refreshItems();
        })
    );

  new Setting(containerEl)
    .setName("保存并刷新")
    .setDesc("保存分类修改，刷新下方打分项目的分类下拉菜单")
    .addButton((btn) =>
      btn.setButtonText("🔄 保存并刷新").onClick(async () => {
        await plugin.saveSettings();
        renderCategories();
        refreshItems();
        new Notice("✅ 分类已保存，打分项目已刷新");
      })
    );
}

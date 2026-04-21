import { Notice, Setting } from "obsidian";
import type KidScorePlugin from "../main";

interface RenderImportExportSettingsOptions {
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  refresh: () => void;
}

export function renderImportExportSettings({
  plugin,
  containerEl,
  refresh,
}: RenderImportExportSettingsOptions) {
  containerEl.createEl("h3", { text: "📦 导出 / 导入配置" });

  new Setting(containerEl)
    .setName("导出打分项配置")
    .setDesc("将所有分类和打分项导出为 JSON 文件")
    .addButton((btn) => {
      btn.setButtonText("📤 导出").onClick(() => {
        const data = { categories: plugin.currentUser.categories, items: plugin.currentUser.items };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "little-milestones-config.json";
        a.click();
        URL.revokeObjectURL(url);
      });
    });

  new Setting(containerEl)
    .setName("导入打分项配置")
    .setDesc("从 JSON 文件导入分类和打分项（将覆盖现有配置）")
    .addButton((btn) => {
      btn.setButtonText("📥 导入").onClick(() => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.onchange = async () => {
          const file = fileInput.files && fileInput.files[0];
          if (!file) return;
          try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (Array.isArray(data.items)) plugin.currentUser.items = data.items;
            if (Array.isArray(data.categories)) plugin.currentUser.categories = data.categories;
            await plugin.saveSettings();
            refresh();
            new Notice("✅ 配置导入成功");
          } catch (e) {
            new Notice("❌ JSON 格式有误，导入失败");
          }
        };
        fileInput.click();
      });
    });
}

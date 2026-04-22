import { Notice, Setting } from "obsidian";
import type KidScorePlugin from "../main";
import type { ScoreItem } from "../types";

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
        const data = {
          schemaVersion: 1,
          categories: plugin.currentUser.categories,
          items: plugin.currentUser.items,
        };
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
            const parsed = parseImportedConfig(data);
            plugin.currentUser.items = parsed.items;
            plugin.currentUser.categories = parsed.categories;
            await plugin.saveSettings();
            refresh();
            new Notice("✅ 配置导入成功");
          } catch (e) {
            new Notice(
              "❌ " + (e instanceof Error ? e.message : "JSON 格式有误，导入失败")
            );
          }
        };
        fileInput.click();
      });
    });
}

function parseImportedConfig(data: unknown): {
  categories: string[];
  items: ScoreItem[];
} {
  if (!data || typeof data !== "object") {
    throw new Error("导入文件内容不是有效对象");
  }

  const raw = data as Record<string, unknown>;
  const schemaVersion = Number(raw.schemaVersion);
  if (
    raw.schemaVersion !== undefined &&
    (!Number.isFinite(schemaVersion) || schemaVersion < 1)
  ) {
    throw new Error("导入文件 schemaVersion 无效");
  }
  if (!Array.isArray(raw.categories) || !raw.categories.every((v) => typeof v === "string")) {
    throw new Error("categories 必须是字符串数组");
  }
  if (!Array.isArray(raw.items)) {
    throw new Error("items 必须是数组");
  }

  const items = raw.items.map((item, index) => parseImportedItem(item, index));
  const categories = raw.categories.map((category) => category.trim()).filter(Boolean);

  const seenIds = new Set<string>();
  for (const item of items) {
    if (seenIds.has(item.id)) {
      throw new Error('导入失败：存在重复的打分项 id "' + item.id + '"');
    }
    seenIds.add(item.id);

    if (!Number.isInteger(item.points)) {
      throw new Error(
        '导入失败：「' +
          item.name +
          "」的分值必须是整数（当前为 " +
          item.points +
          "）"
      );
    }

    if (item.category && !categories.includes(item.category)) {
      throw new Error(
        '导入失败：「' +
          item.name +
          '」的分类 "' +
          item.category +
          '" 不在现有分类列表中'
      );
    }
  }

  return {
    categories,
    items,
  };
}

function parseImportedItem(item: unknown, index: number): ScoreItem {
  if (!item || typeof item !== "object") {
    throw new Error("第 " + (index + 1) + " 个打分项不是有效对象");
  }

  const raw = item as Record<string, unknown>;
  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : null;
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : null;
  const emoji = typeof raw.emoji === "string" ? raw.emoji : "";
  const category = typeof raw.category === "string" ? raw.category : "";
  const points = Number(raw.points);

  if (!id) throw new Error("第 " + (index + 1) + " 个打分项缺少 id");
  if (!name) throw new Error("第 " + (index + 1) + " 个打分项缺少名称");
  if (!Number.isFinite(points)) {
    throw new Error("第 " + (index + 1) + " 个打分项 points 非法");
  }

  return {
    id,
    name,
    emoji,
    points,
    category,
    ...(typeof raw.note === "string" && raw.note.trim()
      ? { note: raw.note.trim() }
      : {}),
  };
}

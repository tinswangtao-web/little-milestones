# Little Milestones 🌱

> A daily record plugin for kids — behavior scoring, diary, diet & activity tracking, with structured data for AI analysis.

> 专为孩子设计的每日记录插件 —— 行为打分、日记、饮食与运动记录，结构化数据便于 AI 分析。

---

## Features / 功能

- ⭐ **Daily Scoring** — Tap cards to score behaviors. Long-press to enter a custom value.
- 📝 **Daily Diary** — Built-in diary with Markdown support, weather/mood quick-insert, and live preview.
- 📊 **Statistics** — View score trends, streaks, and cumulative totals over time.
- 🗂️ **Category Management** — Organize scoring items into custom categories with drag-and-drop reordering.
- 📅 **Date Navigation** — Browse and edit records for any past date.
- 💾 **Structured Output** — Each day's record is saved as a Markdown file with YAML front matter, ready for AI analysis or Dataview queries.

---

- ⭐ **每日打分** — 点击卡片打分，长按输入自定义分值。
- 📝 **日记** — 内置日记，支持 Markdown，天气/心情快捷插入，实时预览。
- 📊 **统计** — 查看分数趋势、连续完成天数及累计总分。
- 🗂️ **分类管理** — 自定义分类，支持拖拽排序。
- 📅 **日期导航** — 浏览和编辑任意历史日期的记录。
- 💾 **结构化输出** — 每日记录保存为带 YAML front matter 的 Markdown 文件，适合 AI 分析或 Dataview 查询。

---

## Installation / 安装

### From Obsidian Community Plugins / 通过社区插件安装

1. Open **Settings → Community plugins → Browse**
2. Search for `Little Milestones`
3. Click **Install**, then **Enable**

---

1. 打开 **设置 → 第三方插件 → 浏览**
2. 搜索 `Little Milestones`
3. 点击 **安装**，然后 **启用**

### Manual / 手动安装

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](../../releases/latest).
2. Place them in your vault under `.obsidian/plugins/kid-score/`.
3. Reload Obsidian and enable the plugin.

---

## Quick Start / 快速上手

1. Go to **Settings → Little Milestones 🌱**
2. Enter the child's name and set the save path.
3. Add scoring categories and items.
4. Click the 🌱 icon in the ribbon to open the daily record.

---

1. 打开 **设置 → Little Milestones 🌱**
2. 输入孩子的名字，设置保存路径。
3. 添加打分分类和项目。
4. 点击侧边栏的 🌱 图标打开每日记录。

---

## Scoring Items / 打分项目

Each item has:
- **Emoji** — visual icon (tap to open emoji picker)
- **Name** — item label
- **Category** — group (drag to reorder within categories)
- **Points** — default score value
- **Note** — optional description shown on the card

Deduction items (negative-point category) display a **white circle** indicator when a value is recorded.

---

## Output Format / 输出格式

Records are saved to your configured path (default: `Little Milestones/Daily Records/`) as `YYYY-MM-DD.md` files with:

- YAML front matter with scores, totals, diet, and tags
- Markdown tables grouped by category
- Daily summary stats
- Diary section

This format is compatible with [Dataview](https://github.com/blacksmithgu/obsidian-dataview) and AI tools.

---

## License / 许可

MIT

import { Notice, TFile, normalizePath } from "obsidian";
import type { CustomScoreItem, DayData } from "../types";
import type KidScorePlugin from "../main";
import { DIARY_MARKER } from "../constants";
import { DayDataComposer } from "../composers/day-data-composer";
import { MarkdownReportBuilder } from "../renderers/report-builder";

export class DayDataStore {
  constructor(private plugin: KidScorePlugin) {}

  async readDayData(dateStr: string): Promise<DayData | null> {
    const file = this.plugin.app.vault.getAbstractFileByPath(
      this.plugin.filePath(dateStr)
    );
    if (!(file instanceof TFile)) return null;

    const content = await this.plugin.app.vault.read(file);
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return null;
    const fm = fmMatch[1];

    const totalMatch = fm.match(/total:\s*(-?\d+)/);
    const total = totalMatch ? parseInt(totalMatch[1], 10) : 0;

    const scores: Record<string, number> = {};
    const scoreBlock = fm.match(/scores:\s*\n([\s\S]*?)(?=\n\w|$)/);
    if (scoreBlock) {
      for (const line of scoreBlock[1].split("\n")) {
        const kvNum = line.match(/\s+(item_\d+):\s*(-?\d+)/);
        if (kvNum) {
          scores[kvNum[1]] = parseInt(kvNum[2], 10);
          continue;
        }
        const kvBool = line.match(/\s+(item_\d+):\s*(true|false)/);
        if (kvBool) {
          const itemDef = this.plugin.currentUser.items.find(
            (item) => item.id === kvBool[1]
          );
          scores[kvBool[1]] =
            kvBool[2] === "true" ? (itemDef ? itemDef.points : 1) : 0;
        }
      }
    }

    const customItems: CustomScoreItem[] = [];
    const customBlock = fm.match(/customItems:\s*\n((?:\s+-\s*"[^"]*"\n?)*)/);
    if (customBlock) {
      const lines = customBlock[1].split("\n");
      for (const line of lines) {
        const match = line.match(/-\s*"(.+?)\|(.+?)\|(-?\d+)"/);
        if (match) {
          customItems.push({
            id:
              "custom_" +
              Date.now() +
              "_" +
              Math.random().toString(36).slice(2, 6),
            emoji: match[1],
            name: match[2],
            points: parseInt(match[3], 10),
          });
        }
      }
    }

    let diaryContent = "";
    const diaryHeadingIdx = content.indexOf("## 📝 今日日记");
    if (diaryHeadingIdx !== -1) {
      diaryContent = content
        .slice(diaryHeadingIdx)
        .replace(/^##\s*📝\s*今日日记\s*\n?/, "")
        .trim();
    } else {
      const diaryIdx = content.indexOf(DIARY_MARKER);
      if (diaryIdx !== -1) {
        diaryContent = content
          .slice(diaryIdx + DIARY_MARKER.length)
          .trim()
          .replace(/^##\s*📝\s*今日日记\s*\n?/, "")
          .trim();
      }
    }

    return {
      date: dateStr,
      child: this.plugin.currentUser.name,
      scores,
      customItems,
      total,
      diaryContent,
    };
  }

  async saveDayData(
    dateStr: string,
    scores: Record<string, number>,
    customItems: CustomScoreItem[],
    diaryContent: string
  ): Promise<void> {
    try {
      const composer = new DayDataComposer(this.plugin);
      const builder = new MarkdownReportBuilder();
      const report = await composer.compose(
        dateStr,
        scores,
        customItems,
        diaryContent
      );
      const fileContent = builder.build(report);

      const dirPath = normalizePath(this.plugin.currentUser.savePath);
      if (!this.plugin.app.vault.getAbstractFileByPath(dirPath)) {
        await this.plugin.app.vault.createFolder(dirPath);
      }

      const filePath = this.plugin.filePath(dateStr);
      const existing = this.plugin.app.vault.getAbstractFileByPath(filePath);
      if (existing instanceof TFile) {
        await this.plugin.app.vault.modify(existing, fileContent);
      } else {
        await this.plugin.app.vault.create(filePath, fileContent);
      }

      const totalSign = report.total >= 0 ? "+" : "";
      const grandSign = report.grandTotal >= 0 ? "+" : "";
      new Notice(
        "✅ " +
          dateStr +
          " 记录已保存！总分：" +
          totalSign +
          report.total +
          " | 累计：" +
          grandSign +
          report.grandTotal
      );
    } catch (error) {
      console.error("[Little Milestones] saveDayData failed", error);
      new Notice(
        "❌ 保存失败：" +
          (error instanceof Error ? error.message : String(error))
      );
      throw error;
    }
  }

  async renameUserInFiles(oldName: string, newName: string): Promise<void> {
    const dirPath = normalizePath(this.plugin.currentUser.savePath);
    const files = this.plugin.app.vault
      .getFiles()
      .filter(
        (file) => file.path.startsWith(dirPath + "/") && file.extension === "md"
      );
    let errorCount = 0;

    for (const file of files) {
      try {
        const content = await this.plugin.app.vault.read(file);
        const escapedOldName = oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const childRe = new RegExp("^child:\\s*" + escapedOldName + "$", "gm");
        const titleRe = new RegExp(
          "(# 📋 \\d{4}-\\d{2}-\\d{2} )" + escapedOldName + "(的每日记录)",
          "g"
        );
        const newContent = content
          .replace(childRe, "child: " + newName)
          .replace(titleRe, "$1" + newName + "$2");
        if (newContent !== content) {
          await this.plugin.app.vault.modify(file, newContent);
        }
      } catch (error) {
        errorCount++;
        console.error(
          "[Little Milestones] renameUserInFiles failed for",
          file.path,
          error
        );
      }
    }

    if (errorCount > 0) {
      throw new Error(
        "用户名同步失败 " + errorCount + " 个文件，请查看控制台日志"
      );
    }
  }

  async migrateSavePath(oldPath: string, newPath: string): Promise<void> {
    const oldDir = normalizePath(oldPath);
    const newDir = normalizePath(newPath);
    if (oldDir === newDir) return;

    const files = this.plugin.app.vault
      .getFiles()
      .filter(
        (file) => file.path.startsWith(oldDir + "/") && file.extension === "md"
      );
    if (files.length === 0) return;

    if (!this.plugin.app.vault.getAbstractFileByPath(newDir)) {
      await this.plugin.app.vault.createFolder(newDir);
    }

    let errorCount = 0;
    for (const file of files) {
      try {
        const newFilePath = normalizePath(newDir + "/" + file.name);
        const existing = this.plugin.app.vault.getAbstractFileByPath(newFilePath);
        if (existing instanceof TFile) {
          const oldContent = await this.plugin.app.vault.read(file);
          await this.plugin.app.vault.modify(existing, oldContent);
          await this.plugin.app.vault.delete(file, true);
        } else {
          await this.plugin.app.vault.rename(file, newFilePath);
        }
      } catch (error) {
        errorCount++;
        console.error(
          "[Little Milestones] migrateSavePath failed for",
          file.path,
          error
        );
      }
    }

    if (errorCount > 0) {
      throw new Error(
        "路径迁移失败 " + errorCount + " 个文件，建议手动检查并迁移"
      );
    }
  }

  async getAllScores(): Promise<DayData[]> {
    const dirPath = normalizePath(this.plugin.currentUser.savePath);
    const files = this.plugin.app.vault
      .getFiles()
      .filter(
        (file) => file.path.startsWith(dirPath + "/") && file.extension === "md"
      );
    const results: DayData[] = [];

    for (const file of files) {
      const dateStr = file.basename;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const score = await this.readDayData(dateStr);
        if (score) results.push(score);
      }
    }

    return results.sort((a, b) => a.date.localeCompare(b.date));
  }
}

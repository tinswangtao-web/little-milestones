import {
  Plugin,
  PluginSettingTab,
  TFile,
  Notice,
  normalizePath,
} from "obsidian";
import type { App } from "obsidian";
import type { PluginSettings, DayData, CustomScoreItem } from "./types";
import {
  DEFAULT_SETTINGS,
  DEFAULT_DIARY_TEMPLATE,
  DIARY_MARKER,
  makeDefaultUser,
} from "./constants";
import { DayDataComposer } from "./composers/day-data-composer";
import { MarkdownReportBuilder } from "./renderers/report-builder";

import { DailyScoringModal } from "./modals/daily-scoring-modal";
import { StatsModal } from "./modals/stats-modal";
import { KidScoreSettingTab } from "./settings/settings-tab";

export default class KidScorePlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    let changed = false;
    for (const u of this.settings.users) {
      if (!u.categories || u.categories.length === 0) {
        u.categories = ["加分项", "减分项"];
        changed = true;
      }
      for (const it of u.items) {
        if (!it.category) {
          it.category =
            it.points >= 0
              ? u.categories[0]
              : u.categories[1] || u.categories[0];
          changed = true;
        }
      }
    }
    if (changed) await this.saveSettings();

    this.addRibbonIcon("star", "Little Milestones 🌱", () => {
      new DailyScoringModal(this.app, this).open();
    });

    this.addCommand({
      id: "open-daily-score",
      name: "打开今日打分",
      callback: () => new DailyScoringModal(this.app, this).open(),
    });

    this.addCommand({
      id: "view-stats",
      name: "查看打分统计",
      callback: () => new StatsModal(this.app, this).open(),
    });

    this.addSettingTab(new KidScoreSettingTab(this.app, this));
  }

  async loadSettings() {
    const loaded = (await this.loadData()) || {};

    if (loaded.childName !== undefined && !loaded.users) {
      // Migrate from old single-child settings
      const mu = makeDefaultUser();
      mu.name = loaded.childName || "小朋友";
      mu.savePath = loaded.savePath || "Little Milestones/Daily Records";
      mu.items = loaded.items || [];
      mu.categories =
        loaded.categories && loaded.categories.length
          ? loaded.categories
          : ["加分项", "减分项"];
      mu.scoringRules = loaded.scoringRules || "";
      mu.diaryTemplate = loaded.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
      this.settings = {
        users: [mu],
        currentUserId: mu.id,
        doubleTapThresholds: {
          ...DEFAULT_SETTINGS.doubleTapThresholds,
        },
      };
    } else {
      this.settings = { ...DEFAULT_SETTINGS, ...loaded };
      const dt = {
        ...DEFAULT_SETTINGS.doubleTapThresholds,
        ...(this.settings.doubleTapThresholds || {}),
      };
      dt.windows = this.sanitizeDoubleTapThreshold(
        dt.windows,
        DEFAULT_SETTINGS.doubleTapThresholds.windows
      );
      dt.mac = this.sanitizeDoubleTapThreshold(
        dt.mac,
        DEFAULT_SETTINGS.doubleTapThresholds.mac
      );
      dt.android = this.sanitizeDoubleTapThreshold(
        dt.android,
        DEFAULT_SETTINGS.doubleTapThresholds.android
      );
      dt.ios = this.sanitizeDoubleTapThreshold(
        dt.ios,
        DEFAULT_SETTINGS.doubleTapThresholds.ios
      );
      dt.fallback = this.sanitizeDoubleTapThreshold(
        dt.fallback,
        DEFAULT_SETTINGS.doubleTapThresholds.fallback
      );
      this.settings.doubleTapThresholds = dt;

      if (!this.settings.users || !this.settings.users.length) {
        const du = makeDefaultUser();
        this.settings.users = [du];
        this.settings.currentUserId = du.id;
      } else {
        for (const su of this.settings.users) {
          if (!su.id)
            su.id =
              "user_" +
              Date.now() +
              "_" +
              Math.random().toString(36).slice(2, 6);
          if (!su.name) su.name = "小朋友";
          if (!su.savePath || !String(su.savePath).trim())
            su.savePath = "Little Milestones/Daily Records";
          if (!Array.isArray(su.items)) su.items = [];
          if (!Array.isArray(su.categories) || !su.categories.length)
            su.categories = ["加分项", "减分项"];
          if (typeof su.scoringRules !== "string") su.scoringRules = "";
          if (!su.diaryTemplate) su.diaryTemplate = DEFAULT_DIARY_TEMPLATE;
          if (!su.goals) su.goals = { daily: 10, weekly: 70, monthly: 300 };
        }
        const cuid = this.settings.currentUserId;
        if (!cuid || !this.settings.users.find((u) => u.id === cuid)) {
          this.settings.currentUserId = this.settings.users[0].id;
        }
      }
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  sanitizeDoubleTapThreshold(value: unknown, fallback: number): number {
    const n = parseInt(String(value), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(120, Math.min(600, n));
  }

  detectPlatformKey(): string {
    const ua = (navigator.userAgent || "").toLowerCase();
    if (/android/.test(ua)) return "android";
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/macintosh|mac os x/.test(ua)) return "mac";
    if (/windows/.test(ua)) return "windows";
    return "fallback";
  }

  getDoubleTapThreshold(): number {
    const defaults = DEFAULT_SETTINGS.doubleTapThresholds;
    const cfg = this.settings.doubleTapThresholds || defaults;
    const key = this.detectPlatformKey();
    const fb = this.sanitizeDoubleTapThreshold(cfg.fallback, defaults.fallback);
    return this.sanitizeDoubleTapThreshold(
      (cfg as unknown as Record<string, number>)[key],
      fb
    );
  }

  get currentUser() {
    const cuid = this.settings.currentUserId;
    return (
      this.settings.users.find((u) => u.id === cuid) || this.settings.users[0]
    );
  }

  filePath(dateStr: string): string {
    return normalizePath(this.currentUser.savePath + "/" + dateStr + ".md");
  }

  async readDayData(dateStr: string): Promise<DayData | null> {
    const file = this.app.vault.getAbstractFileByPath(this.filePath(dateStr));
    if (!(file instanceof TFile)) return null;

    const content = await this.app.vault.read(file);
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return null;
    const fm = fmMatch[1];

    const totalMatch = fm.match(/total:\s*(-?\d+)/);
    const total = totalMatch ? parseInt(totalMatch[1]) : 0;

    const scores: Record<string, number> = {};
    const scoreBlock = fm.match(/scores:\s*\n([\s\S]*?)(?=\n\w|$)/);
    if (scoreBlock) {
      for (const line of scoreBlock[1].split("\n")) {
        const kvNum = line.match(/\s+(item_\d+):\s*(-?\d+)/);
        if (kvNum) {
          scores[kvNum[1]] = parseInt(kvNum[2]);
          continue;
        }
        const kvBool = line.match(/\s+(item_\d+):\s*(true|false)/);
        if (kvBool) {
          const itemDef = this.currentUser.items.find(
            (it) => it.id === kvBool[1]
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
      for (const cl of lines) {
        const cm = cl.match(/-\s*"(.+?)\|(.+?)\|(-?\d+)"/);
        if (cm) {
          customItems.push({
            id:
              "custom_" +
              Date.now() +
              "_" +
              Math.random().toString(36).slice(2, 6),
            emoji: cm[1],
            name: cm[2],
            points: parseInt(cm[3]),
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
          .trim();
        diaryContent = diaryContent
          .replace(/^##\s*📝\s*今日日记\s*\n?/, "")
          .trim();
      }
    }

    return {
      date: dateStr,
      child: this.currentUser.name,
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
  ) {
    try {
      const composer = new DayDataComposer(this);
      const builder = new MarkdownReportBuilder();
      const report = await composer.compose(dateStr, scores, customItems, diaryContent);
      const fileContent = builder.build(report);

      const dirPath = normalizePath(this.currentUser.savePath);
      if (!this.app.vault.getAbstractFileByPath(dirPath)) {
        await this.app.vault.createFolder(dirPath);
      }

      const fp = this.filePath(dateStr);
      const existing = this.app.vault.getAbstractFileByPath(fp);
      if (existing instanceof TFile) {
        await this.app.vault.modify(existing, fileContent);
      } else {
        await this.app.vault.create(fp, fileContent);
      }

      const totalSign = report.total >= 0 ? '+' : '';
      const grandSign = report.grandTotal >= 0 ? '+' : '';
      new Notice('✅ ' + dateStr + ' 记录已保存！总分：' + totalSign + report.total + ' | 累计：' + grandSign + report.grandTotal);
    } catch (e) {
      console.error('[Little Milestones] saveDayData failed', e);
      new Notice('❌ 保存失败：' + (e instanceof Error ? e.message : String(e)));
      throw e;
    }
  }
  async renameUserInFiles(oldName: string, newName: string): Promise<void> {
    const dirPath = normalizePath(this.currentUser.savePath);
    const files = this.app.vault
      .getFiles()
      .filter((f) => f.path.startsWith(dirPath + "/") && f.extension === "md");
    let errorCount = 0;
    for (const file of files) {
      try {
        const content = await this.app.vault.read(file);
        const childRe = new RegExp("^child:\\s*" + oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "gm");
        const titleRe = new RegExp("(# 📋 \\d{4}-\\d{2}-\\d{2} )" + oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(的每日记录)", "g");
        const newContent = content.replace(childRe, "child: " + newName).replace(titleRe, "$1" + newName + "$2");
        if (newContent !== content) {
          await this.app.vault.modify(file, newContent);
        }
      } catch (e) {
        errorCount++;
        console.error("[Little Milestones] renameUserInFiles failed for", file.path, e);
      }
    }
    if (errorCount > 0) {
      throw new Error("用户名同步失败 " + errorCount + " 个文件，请查看控制台日志");
    }
  }

  async migrateSavePath(oldPath: string, newPath: string): Promise<void> {
    const oldDir = normalizePath(oldPath);
    const newDir = normalizePath(newPath);
    if (oldDir === newDir) return;
    const files = this.app.vault
      .getFiles()
      .filter((f) => f.path.startsWith(oldDir + "/") && f.extension === "md");
    if (files.length === 0) return;
    if (!this.app.vault.getAbstractFileByPath(newDir)) {
      await this.app.vault.createFolder(newDir);
    }
    let errorCount = 0;
    for (const file of files) {
      try {
        const newFilePath = normalizePath(newDir + "/" + file.name);
        const existing = this.app.vault.getAbstractFileByPath(newFilePath);
        if (existing instanceof TFile) {
          const oldContent = await this.app.vault.read(file);
          await this.app.vault.modify(existing, oldContent);
          await this.app.vault.delete(file, true);
        } else {
          await this.app.vault.rename(file, newFilePath);
        }
      } catch (e) {
        errorCount++;
        console.error("[Little Milestones] migrateSavePath failed for", file.path, e);
      }
    }
    if (errorCount > 0) {
      throw new Error("路径迁移失败 " + errorCount + " 个文件，建议手动检查并迁移");
    }
  }

  async getAllScores(): Promise<DayData[]> {
    const dirPath = normalizePath(this.currentUser.savePath);
    const files = this.app.vault
      .getFiles()
      .filter((f) => f.path.startsWith(dirPath + "/") && f.extension === "md");
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

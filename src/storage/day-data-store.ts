import { Notice, TFile, normalizePath, parseYaml } from "obsidian";
import type { CustomScoreItem, DayData, DiaryModuleValues } from "../types";
import type KidScorePlugin from "../main";
import { DIARY_MARKER } from "../constants";
import { DayDataComposer } from "../composers/day-data-composer";
import { MarkdownReportBuilder } from "../renderers/report-builder";
import { compareDateStrings, isValidDateString } from "../utils/date";

type FrontmatterData = Record<string, unknown>;

const FRESH_READ_WINDOW_MS = 2000;

export interface DayDataReadOptions {
  preferFreshRead?: boolean;
}

export class DayDataStore {
  private _allScoresCache: {
    data: DayData[];
    path: string;
    timestamp: number;
  } | null = null;
  private _freshReadUntil = 0;

  constructor(private plugin: KidScorePlugin) {}

  private invalidateCache(): void {
    this._allScoresCache = null;
  }

  private markFreshReadWindow(): void {
    this._freshReadUntil = Date.now() + FRESH_READ_WINDOW_MS;
  }

  private shouldPreferFreshRead(options: DayDataReadOptions): boolean {
    return options.preferFreshRead === true || Date.now() < this._freshReadUntil;
  }

  async readDayData(
    dateStr: string,
    options: DayDataReadOptions = { preferFreshRead: true }
  ): Promise<DayData | null> {
    const file = this.plugin.app.vault.getAbstractFileByPath(
      this.plugin.filePath(dateStr)
    );
    if (!(file instanceof TFile)) return null;

    const content = await this.plugin.app.vault.read(file);
    const contentFrontmatter = this.readFrontmatterFromContent(content);
    const frontmatter = options.preferFreshRead
      ? contentFrontmatter || this.readFrontmatterFromCache(file)
      : this.readFrontmatterFromCache(file) || contentFrontmatter;
    if (!frontmatter) return null;
    return this.buildDayDataFromFrontmatter(frontmatter, dateStr, content);
  }

  async readDaySummary(
    dateStr: string,
    options: DayDataReadOptions = {}
  ): Promise<DayData | null> {
    const file = this.plugin.app.vault.getAbstractFileByPath(
      this.plugin.filePath(dateStr)
    );
    if (!(file instanceof TFile)) return null;

    const preferFreshRead = this.shouldPreferFreshRead(options);

    if (!preferFreshRead) {
      const cachedFrontmatter = this.readFrontmatterFromCache(file);
      if (cachedFrontmatter) {
        return this.buildDayDataFromFrontmatter(cachedFrontmatter, dateStr);
      }
    }

    const content = await this.plugin.app.vault.read(file);
    const frontmatter = this.readFrontmatterFromContent(content);
    return frontmatter
      ? this.buildDayDataFromFrontmatter(frontmatter, dateStr)
      : null;
  }

  async saveDayData(
    dateStr: string,
    scores: Record<string, number>,
    customItems: CustomScoreItem[],
    diaryContent: string,
    diaryModules?: DiaryModuleValues
  ): Promise<void> {
    try {
      const composer = new DayDataComposer(this.plugin);
      const builder = new MarkdownReportBuilder();
      const report = await composer.compose(
        dateStr,
        scores,
        customItems,
        diaryContent,
        diaryModules
      );
      const fileContent = builder.build(report);

      await this.ensureFolder(this.plugin.currentUser.savePath);

      const filePath = this.plugin.filePath(dateStr);
      const existing = this.plugin.app.vault.getAbstractFileByPath(filePath);
      if (existing instanceof TFile) {
        await this.plugin.app.vault.modify(existing, fileContent);
      } else {
        await this.plugin.app.vault.create(filePath, fileContent);
      }

      this.invalidateCache();
      this.markFreshReadWindow();

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
        const escapedOldName = oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const bodyTitleRe = new RegExp(
          "^(# 📋 \\d{4}-\\d{2}-\\d{2} )" + escapedOldName + "(的每日记录)$",
          "m"
        );
        await this.plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
          if (frontmatter?.child === oldName) {
            frontmatter.child = newName;
          }
        });

        const content = await this.plugin.app.vault.read(file);
        const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
        const updatedBody = body.replace(bodyTitleRe, "$1" + newName + "$2");
        if (updatedBody !== body) {
          const frontmatterMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
          const prefix = frontmatterMatch ? frontmatterMatch[0] : "";
          await this.plugin.app.vault.modify(file, prefix + updatedBody);
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

    this.invalidateCache();
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

    const conflicts = files
      .map((file) => normalizePath(newDir + "/" + file.name))
      .filter((targetPath) => {
        const existing = this.plugin.app.vault.getAbstractFileByPath(targetPath);
        return existing instanceof TFile;
      });
    if (conflicts.length > 0) {
      throw new Error(
        "新路径中已存在同名文件，已停止自动迁移：\n" + conflicts.join("\n")
      );
    }

    await this.ensureFolder(newDir);

    let errorCount = 0;
    for (const file of files) {
      try {
        const newFilePath = normalizePath(newDir + "/" + file.name);
        await this.plugin.app.vault.rename(file, newFilePath);
      } catch (error) {
        errorCount++;
        console.error(
          "[Little Milestones] migrateSavePath failed for",
          file.path,
          error
        );
      }
    }

    this.invalidateCache();

    if (errorCount > 0) {
      throw new Error(
        "路径迁移失败 " + errorCount + " 个文件，建议手动检查并迁移"
      );
    }
  }

  async getAllScores(options: DayDataReadOptions = {}): Promise<DayData[]> {
    const dirPath = normalizePath(this.plugin.currentUser.savePath);
    const preferFreshRead = this.shouldPreferFreshRead(options);

    const cached = this._allScoresCache;
    if (
      !preferFreshRead &&
      cached &&
      cached.path === dirPath &&
      Date.now() - cached.timestamp < 5000
    ) {
      return cached.data;
    }

    const files = this.plugin.app.vault
      .getFiles()
      .filter(
        (file) => file.path.startsWith(dirPath + "/") && file.extension === "md"
      );
    const results: DayData[] = [];

    for (const file of files) {
      const dateStr = file.basename;
      if (isValidDateString(dateStr)) {
        const score = await this.readDaySummary(dateStr, { preferFreshRead });
        if (score) results.push(score);
      }
    }

    const sorted = results.sort((a, b) => compareDateStrings(a.date, b.date));
    this._allScoresCache = { data: sorted, path: dirPath, timestamp: Date.now() };
    return sorted;
  }

  private buildDayDataFromFrontmatter(
    frontmatter: FrontmatterData,
    dateStr: string,
    content?: string
  ): DayData {
    const scores = this.normalizeScores(frontmatter.scores);
    const customItems = this.normalizeCustomItems(frontmatter.customItems, dateStr);
    const total = this.readTotal(frontmatter.total, scores, customItems);

    return {
      schemaVersion: this.readSchemaVersion(frontmatter.schemaVersion),
      date: dateStr,
      child: this.readChildName(frontmatter.child),
      scores,
      customItems,
      total,
      diaryModules: this.normalizeDiaryModules(frontmatter.diaryModules),
      ...(content !== undefined ? { diaryContent: this.extractDiaryContent(content) } : {}),
    };
  }

  private readFrontmatterFromCache(file: TFile): FrontmatterData | null {
    const cached = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    if (!cached || typeof cached !== "object") return null;
    const { position, ...rest } = cached as FrontmatterData & {
      position?: unknown;
    };
    return rest;
  }

  private readFrontmatterFromContent(content: string): FrontmatterData | null {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!match) return null;
    try {
      const parsed = parseYaml(match[1]);
      return parsed && typeof parsed === "object"
        ? (parsed as FrontmatterData)
        : null;
    } catch (error) {
      console.error("[Little Milestones] parse frontmatter failed", error);
      return null;
    }
  }

  private normalizeScores(rawScores: unknown): Record<string, number> {
    const scores: Record<string, number> = {};
    if (!rawScores || typeof rawScores !== "object") return scores;

    for (const [itemId, rawValue] of Object.entries(rawScores as FrontmatterData)) {
      if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
        scores[itemId] = rawValue;
        continue;
      }
      if (typeof rawValue === "boolean") {
        const itemDef = this.plugin.currentUser.items.find((item) => item.id === itemId);
        scores[itemId] = rawValue ? (itemDef ? itemDef.points : 1) : 0;
      }
    }

    return scores;
  }

  private normalizeCustomItems(rawCustomItems: unknown, dateStr: string): CustomScoreItem[] {
    if (!Array.isArray(rawCustomItems)) return [];

    return rawCustomItems
      .map((entry, index) => this.normalizeCustomItem(entry, dateStr, index))
      .filter((entry): entry is CustomScoreItem => !!entry);
  }

  private normalizeDiaryModules(rawDiaryModules: unknown): DiaryModuleValues | undefined {
    if (!rawDiaryModules || typeof rawDiaryModules !== "object") return undefined;
    const result: DiaryModuleValues = {};
    for (const [key, value] of Object.entries(rawDiaryModules as FrontmatterData)) {
      if (typeof value !== "string") continue;
      if (!value.trim()) continue;
      result[key] = value;
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  private normalizeCustomItem(
    rawItem: unknown,
    dateStr: string,
    index: number
  ): CustomScoreItem | null {
    if (typeof rawItem === "string") {
      const parts = rawItem.split("|");
      if (parts.length < 3) return null;
      const emoji = parts[0].trim();
      const points = Number(parts[parts.length - 1]);
      const name = parts.slice(1, -1).join("|").trim();
      if (!name || !Number.isFinite(points)) return null;
      return {
        id: "custom_" + dateStr.replace(/-/g, "") + "_" + index,
        emoji,
        name,
        points,
      };
    }

    if (!rawItem || typeof rawItem !== "object") return null;
    const item = rawItem as FrontmatterData;
    const name = this.readNonEmptyString(item.name);
    const emoji = this.readNonEmptyString(item.emoji) || "";
    const points = Number(item.points);
    if (!name || !Number.isFinite(points)) return null;

    return {
      id:
        this.readNonEmptyString(item.id) ||
        "custom_" + dateStr.replace(/-/g, "") + "_" + index,
      name,
      emoji,
      points,
      ...(this.readNonEmptyString(item.note) ? { note: String(item.note).trim() } : {}),
    };
  }

  private readTotal(
    rawTotal: unknown,
    scores: Record<string, number>,
    customItems: CustomScoreItem[]
  ): number {
    if (typeof rawTotal === "number" && Number.isFinite(rawTotal)) return rawTotal;
    const scoreTotal = Object.values(scores).reduce((sum, value) => sum + value, 0);
    const customTotal = customItems.reduce((sum, item) => sum + item.points, 0);
    return scoreTotal + customTotal;
  }

  private extractDiaryContent(content: string): string {
    const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
    const diaryHeadingMatch = /^##\s*📝\s*今日日记\s*$/m.exec(body);
    if (diaryHeadingMatch?.index !== undefined) {
      const afterDiaryHeading = body.slice(diaryHeadingMatch.index + diaryHeadingMatch[0].length);
      return this.stripDiaryCommentSection(afterDiaryHeading).trim();
    }

    const diaryIdx = body.indexOf(DIARY_MARKER);
    if (diaryIdx !== -1) {
      const diaryBody = body
        .slice(diaryIdx + DIARY_MARKER.length)
        .replace(/^##\s*📝\s*今日日记\s*\r?\n?/, "");
      return this.stripDiaryCommentSection(diaryBody).trim();
    }

    return "";
  }

  private stripDiaryCommentSection(diaryBody: string): string {
    const commentHeadingMatch = /^##\s*💬\s*评语\s*$/m.exec(diaryBody);
    if (commentHeadingMatch?.index === undefined) return diaryBody;
    return diaryBody.slice(0, commentHeadingMatch.index);
  }

  private readSchemaVersion(rawSchemaVersion: unknown): number | undefined {
    const version = Number(rawSchemaVersion);
    return Number.isFinite(version) ? version : undefined;
  }

  private readChildName(rawChild: unknown): string {
    return this.readNonEmptyString(rawChild) || this.plugin.currentUser.name;
  }

  private readNonEmptyString(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  private async ensureFolder(dirPath: string): Promise<void> {
    const normalized = normalizePath(dirPath);
    if (!normalized || normalized === "/") return;
    if (this.plugin.app.vault.getAbstractFileByPath(normalized)) return;

    const segments = normalized.split("/").filter(Boolean);
    let currentPath = "";
    for (const segment of segments) {
      currentPath = currentPath ? currentPath + "/" + segment : segment;
      if (!this.plugin.app.vault.getAbstractFileByPath(currentPath)) {
        await this.plugin.app.vault.createFolder(currentPath);
      }
    }
  }
}

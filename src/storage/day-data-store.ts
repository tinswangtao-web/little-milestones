import { MarkdownView, Notice, TFile, TFolder, TAbstractFile, normalizePath, parseYaml } from "obsidian";
import type { CustomScoreItem, DayData, DiaryModuleValues } from "../types";
import type KidScorePlugin from "../main";
import { DIARY_MARKER, makeDefaultDiaryModules, USER_CONTENT_BOUNDARY_MARKERS } from "../constants";
import { DayDataComposer } from "../composers/day-data-composer";
import { parseDiaryModules } from "../diary/modules";
import { MarkdownReportBuilder } from "../renderers/report-builder";
import {
  compareDateStrings,
  isValidDateString,
  getNextMonday,
  getNextMonthLastDay,
} from "../utils/date";

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

  /** Prefer current marker line; still recognize legacy %% block and HTML comment. */
  private findUserContentBoundary(content: string): { index: number; length: number } | null {
    let best: { index: number; length: number } | null = null;
    for (const needle of USER_CONTENT_BOUNDARY_MARKERS) {
      const idx = content.indexOf(needle);
      if (idx === -1) continue;
      if (!best || idx < best.index) best = { index: idx, length: needle.length };
    }
    return best;
  }

  private stripBoundaryForPrefixCompare(content: string): string {
    const boundary = this.findUserContentBoundary(content);
    return boundary ? content.slice(0, boundary.index).trimEnd() : content.trimEnd();
  }

  getDayFile(dateStr: string): TFile | null {
    for (const candidatePath of this.plugin.getReportPathCandidates(dateStr)) {
      const file = this.plugin.app.vault.getAbstractFileByPath(candidatePath);
      if (file instanceof TFile) return file;
    }
    return null;
  }

  /**
   * When the report is open in a Markdown tab, prefer the in-memory editor buffer so
   * diary/评语 match what the user sees (avoids IME-vs-disk races on autosave).
   */
  private readOpenMarkdownEditorContent(file: TFile): string | null {
    for (const leaf of this.plugin.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (view instanceof MarkdownView && view.file?.path === file.path) {
        return view.editor.getValue();
      }
    }
    return null;
  }

  private async readDayReportMarkdown(file: TFile): Promise<string> {
    const live = this.readOpenMarkdownEditorContent(file);
    if (live !== null) return live;
    return this.plugin.app.vault.read(file);
  }

  async readDayData(
    dateStr: string,
    options: DayDataReadOptions = { preferFreshRead: true }
  ): Promise<DayData | null> {
    const file = this.getDayFile(dateStr);
    if (!(file instanceof TFile)) return null;

    const content = await this.readDayReportMarkdown(file);
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
    const file = this.getDayFile(dateStr);
    if (!(file instanceof TFile)) return null;

    const preferFreshRead = this.shouldPreferFreshRead(options);

    if (!preferFreshRead) {
      const cachedFrontmatter = this.readFrontmatterFromCache(file);
      if (cachedFrontmatter) {
        return this.buildDayDataFromFrontmatter(cachedFrontmatter, dateStr);
      }
    }

    const content = await this.readDayReportMarkdown(file);
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
      await this.writeReport(
        dateStr,
        scores,
        customItems,
        diaryContent,
        diaryModules,
        true
      );
      await this.rebuildBoundaryReports(dateStr);
    } catch (error) {
      console.error("[Little Milestones] saveDayData failed", error);
      new Notice(
        "❌ 保存失败：" +
          (error instanceof Error ? error.message : String(error))
      );
      throw error;
    }
  }

  private async writeReport(
    dateStr: string,
    scores: Record<string, number>,
    customItems: CustomScoreItem[],
    diaryContent: string,
    diaryModules: DiaryModuleValues | undefined,
    showNotice: boolean
  ): Promise<void> {
    const composer = new DayDataComposer(this.plugin);
    const builder = new MarkdownReportBuilder();
    const report = await composer.compose(
      dateStr,
      scores,
      customItems,
      diaryContent,
      diaryModules
    );
    let fileContent = builder.build(report);

    const existing = this.getDayFile(dateStr);
    const targetFilePath = existing?.path || this.plugin.filePath(dateStr);
    await this.ensureFolder(this.getParentDirPath(targetFilePath));

    if (existing instanceof TFile) {
      const existingContent = await this.plugin.app.vault.read(existing);
      const { appendix } = await this.extractReportUserAppendix(existingContent, dateStr);
      const trimmedAppendix = appendix.trimStart();
      if (trimmedAppendix) {
        fileContent += "\n" + trimmedAppendix;
      }
      await this.plugin.app.vault.modify(existing, fileContent);
    } else {
      await this.plugin.app.vault.create(targetFilePath, fileContent);
    }

    this.invalidateCache();
    this.markFreshReadWindow();

    if (showNotice) {
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
    }
  }

  private async rebuildBoundaryReports(changedDateStr: string): Promise<void> {
    try {
      const nextMonday = getNextMonday(changedDateStr);
      if (nextMonday !== changedDateStr) {
        await this.rebuildReportIfExists(nextMonday);
      }
      const nextMonthLastDay = getNextMonthLastDay(changedDateStr);
      if (nextMonthLastDay !== changedDateStr) {
        await this.rebuildReportIfExists(nextMonthLastDay);
      }
    } catch (error) {
      console.error(
        "[Little Milestones] rebuildBoundaryReports failed",
        error
      );
    }
  }

  private async rebuildReportIfExists(dateStr: string): Promise<void> {
    const file = this.getDayFile(dateStr);
    if (!(file instanceof TFile)) return;

    const existingContent = await this.plugin.app.vault.read(file);
    const { appendix, appendixUnsafe } = await this.extractReportUserAppendix(
      existingContent,
      dateStr
    );
    if (appendixUnsafe) {
      console.log(
        `[Little Milestones] 跳过回写 ${dateStr}：无法安全识别用户内容`
      );
      return;
    }

    const dayData = await this.readDayData(dateStr, { preferFreshRead: true });
    if (!dayData) return;

    const composer = new DayDataComposer(this.plugin);
    const builder = new MarkdownReportBuilder();
    const report = await composer.compose(
      dateStr,
      dayData.scores,
      dayData.customItems,
      dayData.diaryContent || "",
      dayData.diaryModules
    );

    let newContent = builder.build(report);
    const trimmedAppendix = appendix.trimStart();
    if (trimmedAppendix) {
      newContent += "\n" + trimmedAppendix;
    }

    await this.plugin.app.vault.modify(file, newContent);
  }

  /**
   * User-owned content after the managed boundary marker, or a legacy tail
   * identified by extractUserAppendix. When `appendixUnsafe` is true, callers
   * that must not clobber unknown user edits should skip the operation.
   */
  private async extractReportUserAppendix(
    existingContent: string,
    dateStr: string
  ): Promise<{ appendix: string; appendixUnsafe: boolean }> {
    const boundary = this.findUserContentBoundary(existingContent);
    if (boundary) {
      return {
        appendix: existingContent.slice(boundary.index + boundary.length),
        appendixUnsafe: false,
      };
    }
    const extracted = await this.extractUserAppendix(existingContent, dateStr);
    if (extracted === null) {
      return { appendix: "", appendixUnsafe: true };
    }
    return { appendix: extracted, appendixUnsafe: false };
  }

  private async extractUserAppendix(
    existingContent: string,
    dateStr: string
  ): Promise<string | null> {
    const dayData = await this.readDayData(dateStr, { preferFreshRead: true });
    if (!dayData) return null;

    const composer = new DayDataComposer(this.plugin);
    const builder = new MarkdownReportBuilder();
    const report = await composer.compose(
      dateStr,
      dayData.scores,
      dayData.customItems,
      dayData.diaryContent || "",
      dayData.diaryModules
    );

    const expectedContent = builder.build(report);
    const expectedWithoutMarker = this.stripBoundaryForPrefixCompare(expectedContent);
    const normalizedExisting = existingContent.trimEnd();

    if (normalizedExisting === expectedWithoutMarker) {
      return "";
    }

    if (normalizedExisting.startsWith(expectedWithoutMarker)) {
      return normalizedExisting.slice(expectedWithoutMarker.length);
    }

    return null;
  }

  async renameUserInFiles(oldName: string, newName: string): Promise<void> {
    const dirPath = normalizePath(this.plugin.currentUser.savePath);
    const files = this.getMarkdownFilesUnderFolder(dirPath);
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

    const files = this.getMarkdownFilesUnderFolder(oldDir);
    if (files.length === 0) return;

    const conflicts = files
      .map((file) => this.getMigratedFilePath(file.path, oldDir, newDir))
      .filter((targetPath) => {
        const existing = this.plugin.app.vault.getAbstractFileByPath(targetPath);
        return existing instanceof TFile;
      });
    if (conflicts.length > 0) {
      throw new Error(
        "新路径中已存在同名文件，已停止自动迁移：\n" + conflicts.join("\n")
      );
    }

    let errorCount = 0;
    for (const file of files) {
      try {
        const newFilePath = this.getMigratedFilePath(file.path, oldDir, newDir);
        await this.ensureFolder(this.getParentDirPath(newFilePath));
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

    const files = this.getMarkdownFilesUnderFolder(dirPath);
    const results: DayData[] = [];
    const seenDates = new Set<string>();

    for (const file of files) {
      const dateStr = file.basename;
      if (!isValidDateString(dateStr) || seenDates.has(dateStr)) continue;
      seenDates.add(dateStr);
      const score = await this.readDaySummary(dateStr, { preferFreshRead });
      if (score) results.push(score);
    }

    const sorted = results.sort((a, b) => compareDateStrings(a.date, b.date));
    this._allScoresCache = { data: sorted, path: dirPath, timestamp: Date.now() };
    return sorted;
  }

  private getMarkdownFilesUnderFolder(dirPath: string): TFile[] {
    const folder = this.plugin.app.vault.getAbstractFileByPath(dirPath);
    if (!folder || !(folder instanceof TFolder)) {
      return [];
    }
    const files: TFile[] = [];
    const traverse = (item: TAbstractFile) => {
      if (item instanceof TFile) {
        if (item.extension === "md") {
          files.push(item);
        }
      } else if (item instanceof TFolder) {
        for (const child of item.children) {
          traverse(child);
        }
      }
    };
    traverse(folder);
    return files;
  }

  private buildDayDataFromFrontmatter(
    frontmatter: FrontmatterData,
    dateStr: string,
    content?: string
  ): DayData {
    const scores = this.normalizeScores(frontmatter.scores);
    const customItems = this.normalizeCustomItems(frontmatter.customItems, dateStr);
    const total = this.readTotal(frontmatter.total, scores, customItems);
    const bodyDiaryContent =
      content !== undefined ? this.extractDiaryContent(content) : null;
    const bodyDiaryComment =
      content !== undefined ? this.extractDiaryComment(content) : null;
    const frontmatterDiaryModules = this.normalizeDiaryModules(frontmatter.diaryModules);

    return {
      schemaVersion: this.readSchemaVersion(frontmatter.schemaVersion),
      date: dateStr,
      child: this.readChildName(frontmatter.child),
      scores,
      customItems,
      total,
      diaryModules: this.mergeDiaryModulesForRead(
        frontmatterDiaryModules,
        bodyDiaryContent,
        bodyDiaryComment
      ),
      ...(content !== undefined ? { diaryContent: bodyDiaryContent || "" } : {}),
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

  private mergeDiaryModulesForRead(
    frontmatterDiaryModules: DiaryModuleValues | undefined,
    bodyDiaryContent: string | null,
    bodyDiaryComment: string | null
  ): DiaryModuleValues | undefined {
    const moduleConfig =
      this.plugin.currentUser.diaryModules && this.plugin.currentUser.diaryModules.length
        ? this.plugin.currentUser.diaryModules
        : makeDefaultDiaryModules();
    const knownModuleIds = new Set(moduleConfig.map((moduleDef) => moduleDef.id));
    const result: DiaryModuleValues = {};

    if (frontmatterDiaryModules) {
      for (const [key, value] of Object.entries(frontmatterDiaryModules)) {
        if (!knownModuleIds.has(key) && key !== "freeWrite" && key !== "comment") {
          result[key] = value;
        }
      }
    }

    if (bodyDiaryContent !== null) {
      const parsedDiaryModules = parseDiaryModules(bodyDiaryContent, moduleConfig);
      for (const moduleDef of moduleConfig) {
        result[moduleDef.id] = parsedDiaryModules[moduleDef.id] || "";
      }
      result.freeWrite = parsedDiaryModules.freeWrite || "";
    } else if (frontmatterDiaryModules) {
      for (const moduleDef of moduleConfig) {
        if (frontmatterDiaryModules[moduleDef.id] !== undefined) {
          result[moduleDef.id] = frontmatterDiaryModules[moduleDef.id];
        }
      }
      if (frontmatterDiaryModules.freeWrite !== undefined) {
        result.freeWrite = frontmatterDiaryModules.freeWrite;
      }
    }

    if (bodyDiaryComment !== null) {
      result.comment = bodyDiaryComment;
    } else if (frontmatterDiaryModules?.comment !== undefined) {
      result.comment = frontmatterDiaryModules.comment;
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

  private extractDiaryContent(content: string): string | null {
    const body = this.stripFrontmatter(content);
    const diaryHeadingMatch = /^##\s*📝\s*今日日记\s*$/m.exec(body);
    if (diaryHeadingMatch?.index !== undefined) {
      const afterDiaryHeading = body.slice(diaryHeadingMatch.index + diaryHeadingMatch[0].length);
      return this.stripManagedSection(this.stripDiaryCommentSection(afterDiaryHeading)).trim();
    }

    const diaryIdx = body.indexOf(DIARY_MARKER);
    if (diaryIdx !== -1) {
      const diaryBody = body
        .slice(diaryIdx + DIARY_MARKER.length)
        .replace(/^##\s*📝\s*今日日记\s*\r?\n?/, "");
      return this.stripManagedSection(this.stripDiaryCommentSection(diaryBody)).trim();
    }

    return null;
  }

  private extractDiaryComment(content: string): string | null {
    const body = this.stripFrontmatter(content);
    const commentHeadingMatch = /^##\s*💬\s*评语\s*$/m.exec(body);
    if (commentHeadingMatch?.index === undefined) return null;
    let rest = body.slice(commentHeadingMatch.index + commentHeadingMatch[0].length);
    rest = this.truncateCommentBodyAtNextHeading(rest);
    return this.stripManagedSection(rest).trim();
  }

  /** Stop before the next markdown H2 section so user-authored `## ...` after 评语 is not absorbed. */
  private truncateCommentBodyAtNextHeading(rest: string): string {
    const match = /\r?\n##\s/.exec(rest);
    if (match?.index !== undefined) {
      return rest.slice(0, match.index);
    }
    return rest;
  }

  private stripDiaryCommentSection(diaryBody: string): string {
    const commentHeadingMatch = /^##\s*💬\s*评语\s*$/m.exec(diaryBody);
    if (commentHeadingMatch?.index === undefined) return diaryBody;
    return diaryBody.slice(0, commentHeadingMatch.index);
  }

  private stripFrontmatter(content: string): string {
    return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  }

  private stripManagedSection(content: string): string {
    const boundary = this.findUserContentBoundary(content);
    return boundary ? content.slice(0, boundary.index) : content;
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

  private getParentDirPath(filePath: string): string {
    const normalized = normalizePath(filePath);
    const lastSlashIndex = normalized.lastIndexOf("/");
    if (lastSlashIndex <= 0) return "";
    return normalized.slice(0, lastSlashIndex);
  }

  private getMigratedFilePath(filePath: string, oldDir: string, newDir: string): string {
    const relativePath = filePath.slice(oldDir.length + 1);
    return normalizePath(newDir + "/" + relativePath);
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

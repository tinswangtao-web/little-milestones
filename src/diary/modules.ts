import type { DiaryModuleDefinition, DiaryModuleValues } from "../types";

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function readDiaryLine(content: string, label: string): string {
  const match = content.match(new RegExp(escapeRegex(label) + "：\\s*(.+)"));
  return match ? match[1].trim() : "";
}

function readDiarySection(content: string, heading: string): string {
  const match = content.match(
    new RegExp("###\\s*" + escapeRegex(heading) + "\\s*([\\s\\S]*?)(?=\\n###\\s*|$)")
  );
  return match ? match[1].trim() : "";
}

function normalizeDiarySentence(value: string): string {
  return value.trim().replace(/[。！？.!?]\s*$/, "").trim();
}

function normalizeBuiltInSampleValue(moduleId: string, value: string | undefined): string {
  const normalized = normalizeDiarySentence(String(value || ""));
  const sampleValues: Record<string, string> = {
    todayThing: "今天我做了____",
    learnedThing: "今天我学会了____",
    happyThing: "今天最开心的是____",
    wantToSay: "我还想说____",
    comment: "评语____",
  };
  const emptyValues: Record<string, string> = {
    todayThing: "今天我做了无",
    learnedThing: "今天我学会了无",
    happyThing: "今天最开心的是无",
    wantToSay: "我还想说无",
    comment: "评语无",
  };
  if (emptyValues[moduleId] === normalized) return "";
  return sampleValues[moduleId] === normalized ? "" : value || "";
}

const DIARY_COUNT_EXCLUDED_MODULE_IDS = new Set(["comment"]);

const DIARY_COUNT_NARRATIVE_PREFIXES: Record<string, string> = {
  todayThing: "今天我做了",
  learnedThing: "今天我学会了",
  happyThing: "今天最开心的是",
  wantToSay: "我还想说",
};

function normalizeModuleValue(moduleId: string, value: string | undefined): string {
  return normalizeBuiltInSampleValue(
    moduleId,
    String(value || "")
      .replace(/\s*\n+\s*/g, " / ")
      .trim()
  );
}

function normalizeCountableDiaryValue(moduleId: string, value: string | undefined): string {
  let normalized = normalizeModuleValue(moduleId, value);
  const prefix = DIARY_COUNT_NARRATIVE_PREFIXES[moduleId];
  if (prefix && normalized.startsWith(prefix)) {
    normalized = normalizeDiarySentence(normalized.slice(prefix.length));
  }
  return normalized;
}

function readPrefixedSentence(lines: string[], prefix: string): string {
  const line = lines.find((item) => item.startsWith(prefix));
  return line ? normalizeDiarySentence(line.slice(prefix.length)) : "";
}

function isLabelLine(line: string, moduleConfig: DiaryModuleDefinition[]): boolean {
  return moduleConfig.some((moduleDef) =>
    new RegExp("^" + escapeRegex(moduleDef.label) + "：").test(line)
  );
}

function fillNarrativeDiaryModules(
  result: DiaryModuleValues,
  content: string,
  moduleConfig: DiaryModuleDefinition[]
): void {
  const storySection = readDiarySection(content, "今天的小日记");
  if (!storySection) return;

  const lines = storySection
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const consumed = new Set<number>();

  const takeLine = (predicate: (line: string) => boolean): string => {
    const index = lines.findIndex((line, lineIndex) => !consumed.has(lineIndex) && predicate(line));
    if (index < 0) return "";
    consumed.add(index);
    return normalizeDiarySentence(lines[index]);
  };

  const weather = readPrefixedSentence(lines, "今天的天气是");
  if (!result.weather && weather) {
    result.weather = weather;
    const index = lines.findIndex((line) => line.startsWith("今天的天气是"));
    if (index >= 0) consumed.add(index);
  }

  const mood = readPrefixedSentence(lines, "我今天的心情是");
  if (!result.mood && mood) {
    result.mood = mood;
    const index = lines.findIndex((line) => line.startsWith("我今天的心情是"));
    if (index >= 0) consumed.add(index);
  }

  const exactPrefixes: Record<string, string> = {
    todayThing: "今天我做了",
    learnedThing: "今天我学会了",
    happyThing: "今天最开心的是",
    wantToSay: "我还想说",
    comment: "评语",
  };

  Object.entries(exactPrefixes).forEach(([id, prefix]) => {
    if (result[id]) return;
    const value = takeLine((line) => line.startsWith(prefix));
    if (value) result[id] = value;
  });

  const narrativeIds = new Set(Object.keys(exactPrefixes));
  const remainingLines = lines
    .filter((line, lineIndex) => !consumed.has(lineIndex) && !isLabelLine(line, moduleConfig))
    .map(normalizeDiarySentence)
    .filter(Boolean);

  moduleConfig.forEach((moduleDef) => {
    if (!narrativeIds.has(moduleDef.id) || result[moduleDef.id]) return;
    const nextLine = remainingLines.shift();
    if (nextLine) result[moduleDef.id] = nextLine;
  });
}

function fillPlainDiaryModules(
  result: DiaryModuleValues,
  content: string,
  moduleConfig: DiaryModuleDefinition[]
): void {
  if (!content.trim()) return;
  const hasStructuredValues =
    moduleConfig.some((moduleDef) => String(result[moduleDef.id] || "").trim().length > 0) ||
    String(result.freeWrite || "").trim().length > 0;
  if (hasStructuredValues) return;

  const sections = content
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);
  if (!sections.length) return;

  const moduleLines = sections[0]
    .split("\n")
    .map((line) => normalizeDiarySentence(line.trim()))
    .filter(Boolean);
  if (!moduleLines.length) return;

  const consumed = new Set<number>();

  const assignLine = (moduleId: string, lineIndex: number, value: string): void => {
    if (!moduleConfig.some((moduleDef) => moduleDef.id === moduleId)) return;
    if (result[moduleId]) return;
    result[moduleId] = normalizeBuiltInSampleValue(moduleId, value);
    consumed.add(lineIndex);
  };

  moduleLines.forEach((line, lineIndex) => {
    const prefixedEntry = Object.entries(DIARY_COUNT_NARRATIVE_PREFIXES).find(([, prefix]) =>
      line.startsWith(prefix)
    );
    if (!prefixedEntry) return;
    assignLine(prefixedEntry[0], lineIndex, line);
  });

  const remainingModuleLines = moduleLines.filter((_, lineIndex) => !consumed.has(lineIndex));
  const freeWriteSections = [...remainingModuleLines, ...sections.slice(1)].filter(Boolean);
  result.freeWrite = freeWriteSections.join("\n\n").trim();
}

export function parseDiaryModules(
  content: string,
  moduleConfig: DiaryModuleDefinition[]
): DiaryModuleValues {
  const raw = content || "";
  const freeWriteMatch = raw.match(/###\s*自由记录\s*([\s\S]*)$/);
  const result: DiaryModuleValues = {
    freeWrite: freeWriteMatch ? freeWriteMatch[1].trim() : "",
  };

  moduleConfig.forEach((moduleDef) => {
    result[moduleDef.id] = normalizeBuiltInSampleValue(
      moduleDef.id,
      readDiaryLine(raw, moduleDef.label)
    );
  });
  fillNarrativeDiaryModules(result, raw, moduleConfig);
  moduleConfig.forEach((moduleDef) => {
    result[moduleDef.id] = normalizeBuiltInSampleValue(moduleDef.id, result[moduleDef.id]);
  });
  fillPlainDiaryModules(result, raw, moduleConfig);

  return result;
}

export function composeDiaryContent(
  values: DiaryModuleValues,
  moduleConfig: DiaryModuleDefinition[]
): string {
  const sections: string[] = [];
  const contentLines: string[] = [];
  const normalizedValues: Record<string, string> = {};

  const appendDiaryValue = (text: string) => {
    const cleaned = String(text || "").trim();
    if (!cleaned) return;
    contentLines.push(cleaned);
  };

  moduleConfig.forEach((moduleDef) => {
    const value = normalizeModuleValue(moduleDef.id, values[moduleDef.id]);
    normalizedValues[moduleDef.id] = value;
  });

  if (normalizedValues.weather) appendDiaryValue(normalizedValues.weather);
  if (normalizedValues.mood) appendDiaryValue(normalizedValues.mood);
  if (normalizedValues.todayThing) appendDiaryValue(normalizedValues.todayThing);
  if (normalizedValues.learnedThing) appendDiaryValue(normalizedValues.learnedThing);
  if (normalizedValues.happyThing) appendDiaryValue(normalizedValues.happyThing);
  if (normalizedValues.wantToSay) appendDiaryValue(normalizedValues.wantToSay);

  moduleConfig.forEach((moduleDef) => {
    if (
      [
        "weather",
        "mood",
        "todayThing",
        "learnedThing",
        "happyThing",
        "wantToSay",
        "comment",
      ].includes(moduleDef.id)
    ) {
      return;
    }
    if (!normalizedValues[moduleDef.id]) return;
    appendDiaryValue(normalizedValues[moduleDef.id]);
  });

  if (contentLines.length) sections.push(contentLines.join("\n"));
  if (values.freeWrite && values.freeWrite.trim()) {
    sections.push(values.freeWrite.trim());
  }

  return sections.join("\n\n").trim();
}

export function composeDiaryCommentContent(values: DiaryModuleValues): string {
  return normalizeModuleValue("comment", values.comment);
}

export function countDiaryCharacters(
  values: DiaryModuleValues,
  moduleConfig: DiaryModuleDefinition[]
): number {
  const countableValues: string[] = [];

  moduleConfig.forEach((moduleDef) => {
    if (DIARY_COUNT_EXCLUDED_MODULE_IDS.has(moduleDef.id)) return;
    const value = normalizeCountableDiaryValue(moduleDef.id, values[moduleDef.id]);
    if (value) countableValues.push(value);
  });

  const freeWrite = String(values.freeWrite || "").trim();
  if (freeWrite) countableValues.push(freeWrite);

  return countableValues.reduce((sum, value) => sum + Array.from(value).length, 0);
}

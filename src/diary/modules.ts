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
  return sampleValues[moduleId] === normalized ? "" : value || "";
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

  return result;
}

export function composeDiaryContent(
  values: DiaryModuleValues,
  moduleConfig: DiaryModuleDefinition[]
): string {
  const sections: string[] = [];
  const storyLines: string[] = [];
  const normalizedValues: Record<string, string> = {};

  const appendSentence = (text: string) => {
    const cleaned = String(text || "").trim();
    if (!cleaned) return;
    storyLines.push(/[。！？.!?]$/.test(cleaned) ? cleaned : cleaned + "。");
  };

  moduleConfig.forEach((moduleDef) => {
    const value = String(values[moduleDef.id] || "")
      .replace(/\s*\n+\s*/g, " / ")
      .trim();
    normalizedValues[moduleDef.id] = value;
  });

  if (normalizedValues.weather) appendSentence("今天的天气是" + normalizedValues.weather);
  if (normalizedValues.mood) appendSentence("我今天的心情是" + normalizedValues.mood);
  if (normalizedValues.todayThing) appendSentence(normalizedValues.todayThing);
  if (normalizedValues.learnedThing) appendSentence(normalizedValues.learnedThing);
  if (normalizedValues.happyThing) appendSentence(normalizedValues.happyThing);
  if (normalizedValues.wantToSay) appendSentence(normalizedValues.wantToSay);
  if (normalizedValues.comment) appendSentence("评语：" + normalizedValues.comment);

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
    appendSentence(moduleDef.label + "：" + normalizedValues[moduleDef.id]);
  });

  if (storyLines.length) sections.push("### 今天的小日记\n" + storyLines.join("\n"));
  if (values.freeWrite && values.freeWrite.trim()) {
    sections.push("### 自由记录\n" + values.freeWrite.trim());
  }

  return sections.join("\n\n").trim();
}

import type { DiaryModuleDefinition, DiaryModuleValues } from "../types";

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function readDiaryLine(content: string, label: string): string {
  const match = content.match(new RegExp(escapeRegex(label) + "：\\s*(.+)"));
  return match ? match[1].trim() : "";
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
    result[moduleDef.id] = readDiaryLine(raw, moduleDef.label);
  });

  return result;
}

export function composeDiaryContent(
  values: DiaryModuleValues,
  moduleConfig: DiaryModuleDefinition[]
): string {
  const sections: string[] = [];
  const recordLines: string[] = [];
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
    if (!value) return;
    recordLines.push(moduleDef.label + "：" + value);
  });

  if (normalizedValues.weather) appendSentence("今天的天气是" + normalizedValues.weather);
  if (normalizedValues.mood) appendSentence("我今天的心情是" + normalizedValues.mood);
  if (normalizedValues.todayThing) appendSentence(normalizedValues.todayThing);
  if (normalizedValues.learnedThing) appendSentence(normalizedValues.learnedThing);
  if (normalizedValues.happyThing) appendSentence(normalizedValues.happyThing);
  if (normalizedValues.wantToSay) appendSentence(normalizedValues.wantToSay);

  moduleConfig.forEach((moduleDef) => {
    if (
      ["weather", "mood", "todayThing", "learnedThing", "happyThing", "wantToSay"].includes(
        moduleDef.id
      )
    ) {
      return;
    }
    if (!normalizedValues[moduleDef.id]) return;
    appendSentence(moduleDef.label + "：" + normalizedValues[moduleDef.id]);
  });

  if (storyLines.length) sections.push("### 今天的小日记\n" + storyLines.join("\n"));
  if (recordLines.length) sections.push("### 小记录\n" + recordLines.join("\n"));
  if (values.freeWrite && values.freeWrite.trim()) {
    sections.push("### 自由记录\n" + values.freeWrite.trim());
  }

  return sections.join("\n\n").trim();
}

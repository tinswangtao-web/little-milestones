import { EMOJI_DATA, EMOJI_SEARCH } from "../data/emoji-data";

export function getEmojiCategoryKeys(): string[] {
  return Object.keys(EMOJI_DATA);
}

export function getEmojiCategoryItems(key: string): string[] {
  return EMOJI_DATA[key] || [];
}

export function searchEmojis(query: string, categoryKeys: string[]): string[] {
  const q = query.toLowerCase();
  const results: string[] = [];
  const seen = new Set<string>();

  for (const emoji in EMOJI_SEARCH) {
    if (EMOJI_SEARCH[emoji].includes(q) && !seen.has(emoji)) {
      results.push(emoji);
      seen.add(emoji);
    }
  }

  if (results.length === 0) {
    for (const key of categoryKeys) {
      if (key.toLowerCase().includes(q)) {
        for (const emoji of getEmojiCategoryItems(key)) {
          if (!seen.has(emoji)) {
            results.push(emoji);
            seen.add(emoji);
          }
        }
      }
    }
  }

  return results;
}

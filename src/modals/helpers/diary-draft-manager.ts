import type { DiaryModuleValues } from "../../types";

export interface DiaryUiDraftState {
  quickCustomInputs: Record<string, string>;
}

export interface DiaryDraftState {
  diaryContent: string;
  diaryModules: DiaryModuleValues;
  uiDrafts: DiaryUiDraftState;
  /** Report vault file mtime when draft was saved; if file is newer, drop draft on reopen. */
  sourceVaultMtime: number;
}

export function cloneDiaryUiDrafts(value: DiaryUiDraftState | undefined): DiaryUiDraftState {
  return {
    quickCustomInputs: { ...(value?.quickCustomInputs || {}) },
  };
}

/**
 * Manages diary draft state with an LRU-eviction static cache.
 * Drafts survive plugin hot-reloads because the cache is held on the class,
 * not on individual modal instances.
 */
export class DiaryDraftManager {
  private static drafts = new Map<string, DiaryDraftState>();
  private static readonly maxDrafts = 50;

  static get(key: string): DiaryDraftState | null {
    const draft = DiaryDraftManager.drafts.get(key);
    if (!draft) return null;
    return {
      diaryContent: draft.diaryContent,
      diaryModules: { ...draft.diaryModules },
      uiDrafts: cloneDiaryUiDrafts(draft.uiDrafts),
      sourceVaultMtime: draft.sourceVaultMtime ?? 0,
    };
  }

  static set(
    key: string,
    diaryContent: string,
    diaryModules: DiaryModuleValues,
    uiDrafts: DiaryUiDraftState | undefined,
    sourceVaultMtime: number,
  ): void {
    DiaryDraftManager.drafts.delete(key);
    DiaryDraftManager.drafts.set(key, {
      diaryContent,
      diaryModules: { ...diaryModules },
      uiDrafts: cloneDiaryUiDrafts(uiDrafts),
      sourceVaultMtime,
    });
    while (DiaryDraftManager.drafts.size > DiaryDraftManager.maxDrafts) {
      const oldestKey = DiaryDraftManager.drafts.keys().next().value;
      if (!oldestKey) break;
      DiaryDraftManager.drafts.delete(oldestKey);
    }
  }

  static delete(key: string): void {
    DiaryDraftManager.drafts.delete(key);
  }
}

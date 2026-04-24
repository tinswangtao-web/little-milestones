import type { DiaryModuleRowLayoutRefs, ItemSettingsRowLayoutRefs } from "./settings-section-layout";

export function renderDesktopDiaryModuleRowLayout(
  list: HTMLElement
): DiaryModuleRowLayoutRefs {
  const row = list.createDiv({
    cls: "diary-module-settings-row diary-module-settings-row-desktop",
  });
  const top = row.createDiv({
    cls: "diary-module-settings-top diary-module-settings-top-desktop",
  });
  const main = top.createDiv({
    cls: "diary-module-settings-main diary-module-settings-main-desktop",
  });
  const meta = top.createDiv({
    cls: "diary-module-settings-meta diary-module-settings-meta-desktop",
  });
  const actions = top.createDiv({
    cls: "diary-module-settings-actions diary-module-settings-actions-desktop",
  });
  const placeholderField = row.createDiv({
    cls: "diary-module-settings-field diary-module-settings-field-desktop is-wide is-full-row",
  });
  return { row, top, main, meta, actions, placeholderField };
}

export function renderDesktopItemSettingsRowLayout(
  itemsWrap: HTMLElement
): ItemSettingsRowLayoutRefs {
  const wrap = itemsWrap.createDiv({
    cls: "settings-item-wrap settings-item-wrap-desktop",
  });
  const row = wrap.createDiv({
    cls: "settings-item-row-v2 settings-item-row-v2-desktop",
  });
  const noteRow = wrap.createDiv({
    cls: "settings-item-note-row settings-item-note-row-desktop",
  });
  return { wrap, row, noteRow };
}

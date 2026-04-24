import type { DiaryModuleRowLayoutRefs, ItemSettingsRowLayoutRefs } from "./settings-section-layout";

export function renderMobileDiaryModuleRowLayout(
  list: HTMLElement
): DiaryModuleRowLayoutRefs {
  const row = list.createDiv({
    cls: "diary-module-settings-row diary-module-settings-row-mobile",
  });
  const top = row.createDiv({
    cls: "diary-module-settings-top diary-module-settings-top-mobile",
  });
  const main = top.createDiv({
    cls: "diary-module-settings-main diary-module-settings-main-mobile",
  });
  const meta = top.createDiv({
    cls: "diary-module-settings-meta diary-module-settings-meta-mobile",
  });
  const actions = top.createDiv({
    cls: "diary-module-settings-actions diary-module-settings-actions-mobile",
  });
  const placeholderField = row.createDiv({
    cls: "diary-module-settings-field diary-module-settings-field-mobile is-wide is-full-row",
  });
  return { row, top, main, meta, actions, placeholderField };
}

export function renderMobileItemSettingsRowLayout(
  itemsWrap: HTMLElement
): ItemSettingsRowLayoutRefs {
  const wrap = itemsWrap.createDiv({
    cls: "settings-item-wrap settings-item-wrap-mobile",
  });
  const row = wrap.createDiv({
    cls: "settings-item-row-v2 settings-item-row-v2-mobile",
  });
  const noteRow = wrap.createDiv({
    cls: "settings-item-note-row settings-item-note-row-mobile",
  });
  return { wrap, row, noteRow };
}

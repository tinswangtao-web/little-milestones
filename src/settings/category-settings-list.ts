import { Notice } from "obsidian";
import type KidScorePlugin from "../main";
import { showConfirmModal } from "../ui/confirm-modal";

interface RenderCategorySettingsListOptions {
  plugin: KidScorePlugin;
  catWrap: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  refreshItems: () => void;
}

export function renderCategorySettingsList({
  plugin,
  catWrap,
  bindSettingsInput,
  refreshItems,
}: RenderCategorySettingsListOptions): void {
  const dragState = {
    dragging: false,
    dragIdx: -1,
    placeholder: null as HTMLElement | null,
    ghost: null as HTMLElement | null,
    rows: [] as HTMLElement[],
  };

  const getDragRowIndex = (y: number) => {
    for (let index = 0; index < dragState.rows.length; index++) {
      const rect = dragState.rows[index].getBoundingClientRect();
      if (y < rect.top + rect.height / 2) return index;
    }
    return dragState.rows.length;
  };

  const onDragMove = (clientY: number) => {
    if (!dragState.dragging) return;
    if (dragState.ghost) dragState.ghost.style.top = clientY - 20 + "px";
    const targetIdx = getDragRowIndex(clientY);
    const parent = dragState.rows[0]?.parentElement;
    if (!parent || !dragState.placeholder) return;
    if (targetIdx >= dragState.rows.length) parent.appendChild(dragState.placeholder);
    else parent.insertBefore(dragState.placeholder, dragState.rows[targetIdx]);
  };

  const pointerMoveHandler = (e: PointerEvent) => {
    onDragMove(e.clientY);
  };

  const pointerCancelHandler = () => {
    document.removeEventListener("pointermove", pointerMoveHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
    document.removeEventListener("pointercancel", pointerCancelHandler);
    dragState.dragging = false;
    if (dragState.ghost) {
      dragState.ghost.remove();
      dragState.ghost = null;
    }
    if (dragState.placeholder) {
      dragState.placeholder.remove();
      dragState.placeholder = null;
    }
    document.body.style.userSelect = "";
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = "";
    renderCategories();
  };

  const onDragEnd = (clientY: number) => {
    if (!dragState.dragging) return;
    dragState.dragging = false;
    if (dragState.ghost) dragState.ghost.remove();
    if (dragState.placeholder) dragState.placeholder.remove();
    document.body.style.userSelect = "";
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = "";
    const targetIdx = getDragRowIndex(clientY);
    let fromIdx = dragState.dragIdx;
    if (targetIdx > fromIdx) fromIdx--;
    const arr = plugin.currentUser.categories;
    if (fromIdx !== targetIdx && fromIdx >= 0 && targetIdx >= 0 && targetIdx < arr.length) {
      const moved = arr.splice(fromIdx, 1)[0];
      arr.splice(targetIdx, 0, moved);
      (async () => {
        await plugin.saveSettings();
        renderCategories();
        refreshItems();
      })();
    } else {
      renderCategories();
    }
  };

  const pointerUpHandler = (e: PointerEvent) => {
    document.removeEventListener("pointermove", pointerMoveHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
    document.removeEventListener("pointercancel", pointerCancelHandler);
    onDragEnd(e.clientY);
  };

  const startDrag = (idx: number, row: HTMLElement, clientY: number) => {
    dragState.dragging = true;
    dragState.dragIdx = idx;
    dragState.rows = Array.from(
      catWrap.querySelectorAll(".kid-score-cat-row")
    ) as HTMLElement[];
    const rect = row.getBoundingClientRect();
    const ghost = row.cloneNode(true) as HTMLElement;
    ghost.className = "kid-score-cat-row settings-drag-ghost";
    ghost.style.cssText =
      "position:fixed;left:" +
      rect.left +
      "px;top:" +
      (clientY - 20) +
      "px;width:" +
      rect.width +
      "px;z-index:10000;opacity:0.85;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);background:var(--background-primary);border-radius:8px;";
    document.body.appendChild(ghost);
    dragState.ghost = ghost;
    const placeholder = document.createElement("div");
    placeholder.className = "settings-drag-placeholder";
    placeholder.style.cssText =
      "height:" +
      rect.height +
      "px;border:2px dashed var(--interactive-accent);border-radius:8px;margin:2px 0;background:var(--background-secondary);opacity:0.5;";
    if (row.parentElement) row.parentElement.insertBefore(placeholder, row);
    dragState.placeholder = placeholder;
    row.style.display = "none";
    document.body.style.userSelect = "none";
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect =
      "none";
    document.addEventListener("pointermove", pointerMoveHandler);
    document.addEventListener("pointerup", pointerUpHandler);
    document.addEventListener("pointercancel", pointerCancelHandler);
  };

  const renderCategories = () => {
    catWrap.empty();
    dragState.rows = [];
    const categories = plugin.currentUser.categories || [];

    for (let idx = 0; idx < categories.length; idx++) {
      const row = catWrap.createDiv({ cls: "kid-score-cat-row" });
      const handle = row.createEl("span", {
        cls: "settings-drag-handle",
        text: "☰",
      });
      handle.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        startDrag(idx, row, e.clientY);
      });

      const input = row.createEl("input", { cls: "settings-name-input" });
      bindSettingsInput(input);
      input.value = categories[idx];
      input.onchange = async () => {
        const oldName = plugin.currentUser.categories[idx];
        const newName = input.value.trim();
        if (!newName) return;
        plugin.currentUser.categories[idx] = newName;
        for (const item of plugin.currentUser.items) {
          if (item.category === oldName) item.category = newName;
        }
        await plugin.saveSettings();
        refreshItems();
      };

      const delBtn = row.createEl("button", {
        cls: "settings-delete-btn",
        text: "🗑",
      });
      delBtn.onclick = async () => {
        const removedCategory = plugin.currentUser.categories[idx];
        showConfirmModal(plugin.app, {
          title: "删除分类",
          message:
            "确定删除分类「" +
            removedCategory +
            "」吗？该分类下的项目将自动归入第一个分类。",
          isDestructive: true,
          onConfirm: async () => {
            try {
              plugin.currentUser.categories.splice(idx, 1);
              const fallback = plugin.currentUser.categories[0] || "其他";
              for (const item of plugin.currentUser.items) {
                if (item.category === removedCategory) item.category = fallback;
              }
              await plugin.saveSettings();
              renderCategories();
              refreshItems();
            } catch (error) {
              new Notice(
                "❌ 删除失败：" +
                  (error instanceof Error ? error.message : String(error))
              );
            }
          },
        });
      };

      dragState.rows.push(row);
    }
  };

  renderCategories();
}

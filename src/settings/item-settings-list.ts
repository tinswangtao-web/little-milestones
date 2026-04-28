import { Notice } from "obsidian";
import type KidScorePlugin from "../main";
import { showConfirmModal } from "../ui/confirm-modal";
import { showEmojiPicker } from "../ui/emoji-picker";
import { attachAutoResize } from "../utils/dom";
import { getMobilePlatform, isIOS } from "../utils/platform";
import { sortItemsByCategories } from "./item-sorting";
import { renderDesktopItemSettingsRowLayout } from "./desktop-settings-sections";
import { renderMobileItemSettingsRowLayout } from "./mobile-settings-sections";

interface RenderItemSettingsListOptions {
  plugin: KidScorePlugin;
  itemsWrap: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  pendingScrollItemId: string | null;
  setPendingScrollItemId: (itemId: string | null) => void;
}

export function renderItemSettingsList({
  plugin,
  itemsWrap,
  bindSettingsInput,
  pendingScrollItemId,
  setPendingScrollItemId,
}: RenderItemSettingsListOptions): void {
  const useInlineCategoryPicker = isIOS();
  const isTouchLayout = getMobilePlatform() !== "desktop";
  const getScrollContainer = () =>
    (itemsWrap.closest(".vertical-tab-content") ||
      itemsWrap.closest(".modal-content") ||
      itemsWrap.parentElement) as HTMLElement | null;

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
    if (targetIdx >= dragState.rows.length) {
      parent.appendChild(dragState.placeholder);
    } else {
      parent.insertBefore(dragState.placeholder, dragState.rows[targetIdx]);
    }
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
    renderItems();
  };

  const onDragEnd = (clientY: number) => {
    if (!dragState.dragging) return;
    dragState.dragging = false;
    if (dragState.ghost) dragState.ghost.remove();
    if (dragState.placeholder) dragState.placeholder.remove();
    document.body.style.userSelect = "";
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = "";
    const targetIdx = getDragRowIndex(clientY);
    const fromIdx = dragState.dragIdx;
    let insertIdx = targetIdx;
    if (targetIdx > fromIdx) insertIdx--;
    const arr = plugin.currentUser.items;
    if (
      fromIdx !== insertIdx &&
      fromIdx >= 0 &&
      insertIdx >= 0 &&
      insertIdx <= arr.length
    ) {
      const moved = arr.splice(fromIdx, 1)[0];
      arr.splice(insertIdx, 0, moved);
      (async () => {
        await plugin.saveSettings();
        renderItems();
      })();
    } else {
      renderItems();
    }
  };

  const pointerUpHandler = (e: PointerEvent) => {
    document.removeEventListener("pointermove", pointerMoveHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
    document.removeEventListener("pointercancel", pointerCancelHandler);
    onDragEnd(e.clientY);
  };



  const startDrag = (idx: number, wrap: HTMLElement, clientY: number) => {
    dragState.dragging = true;
    dragState.dragIdx = idx;
    dragState.rows = Array.from(
      itemsWrap.querySelectorAll(".settings-item-wrap")
    ) as HTMLElement[];
    const rect = wrap.getBoundingClientRect();
    const ghost = wrap.cloneNode(true) as HTMLElement;
    ghost.className = "settings-item-wrap settings-drag-ghost";
    ghost.style.cssText =
      "position:fixed;left:" +
      rect.left +
      "px;top:" +
      (clientY - 20) +
      "px;width:" +
      rect.width +
      "px;z-index:10000;opacity:0.85;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);background:var(--background-primary);border-radius:8px;padding:4px;";
    document.body.appendChild(ghost);
    dragState.ghost = ghost;
    const placeholder = document.createElement("div");
    placeholder.className = "settings-drag-placeholder";
    placeholder.style.cssText =
      "height:" +
      rect.height +
      "px;border:2px dashed var(--interactive-accent);border-radius:8px;margin:2px 0;background:var(--background-secondary);opacity:0.5;";
    if (wrap.parentElement) wrap.parentElement.insertBefore(placeholder, wrap);
    dragState.placeholder = placeholder;
    wrap.style.display = "none";
    document.body.style.userSelect = "none";
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect =
      "none";
    document.addEventListener("pointermove", pointerMoveHandler);
    document.addEventListener("pointerup", pointerUpHandler);
    document.addEventListener("pointercancel", pointerCancelHandler);
  };

  const renderItems = () => {
    const scroller = getScrollContainer();
    const preservedScrollTop = pendingScrollItemId ? null : scroller?.scrollTop ?? null;

    itemsWrap.empty();
    dragState.rows = [];

    if (plugin.currentUser.items.length === 0) {
      itemsWrap.createEl("p", {
        cls: "kid-score-hint",
        text: "还没有项目，点击下方添加！",
      });
      return;
    }

    const headerRow = itemsWrap.createDiv({
      cls: "settings-item-row-v2 header-row",
    });
    ["☰", "表情", "名称", "分类", "分值", ""].forEach((header) => {
      headerRow.createSpan({ text: header, cls: "col-header" });
    });

    let lastCategory: string | null = null;
    for (let idx = 0; idx < plugin.currentUser.items.length; idx++) {
      const item = plugin.currentUser.items[idx];
      const category = item.category || "其他";
      if (category !== lastCategory) {
        lastCategory = category;
        const groupHeader = itemsWrap.createDiv({
          cls: "settings-cat-group-header",
        });
        groupHeader.createSpan({ text: category });
      }

      const layout = isTouchLayout
        ? renderMobileItemSettingsRowLayout(itemsWrap)
        : renderDesktopItemSettingsRowLayout(itemsWrap);
      const { wrap, row, noteRow } = layout;
      wrap.dataset.itemId = item.id;
      row.dataset.idx = String(idx);

      const handle = row.createEl("span", {
        cls: "settings-drag-handle",
        text: "☰",
      });
      handle.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        startDrag(idx, wrap, e.clientY);
      });

      const emojiBtn = row.createEl("button", {
        cls: "settings-emoji-btn",
        text: item.emoji,
      });
      emojiBtn.onclick = () => {
        showEmojiPicker(async (emoji: string) => {
          plugin.currentUser.items[idx].emoji = emoji;
          await plugin.saveSettings();
          emojiBtn.textContent = emoji;
        });
      };

      const nameInput = row.createEl("input", { cls: "settings-name-input" });
      nameInput.type = "text";
      nameInput.value = item.name;
      bindSettingsInput(nameInput);
      nameInput.onchange = async () => {
        plugin.currentUser.items[idx].name = nameInput.value;
        await plugin.saveSettings();
      };

      const categories = plugin.currentUser.categories || [];
      const applyCategoryChange = async (nextCategory: string) => {
        if (!nextCategory || nextCategory === plugin.currentUser.items[idx].category) return;
        plugin.currentUser.items[idx].category = nextCategory;
        sortItemsByCategories(
          plugin.currentUser.items,
          plugin.currentUser.categories || []
        );
        await plugin.saveSettings();
        renderItems();
      };

      if (useInlineCategoryPicker) {
        const catTrigger = row.createEl("button", {
          cls: "settings-cat-trigger",
          text: item.category || categories[0] || "未分类",
        });
        catTrigger.type = "button";

        const catMenu = wrap.createDiv({ cls: "settings-cat-options" });
        categories.forEach((value) => {
          const optionBtn = catMenu.createEl("button", {
            cls:
              "settings-cat-option" +
              ((item.category || categories[0] || "未分类") === value ? " is-selected" : ""),
            text: value,
          });
          optionBtn.type = "button";
          optionBtn.onclick = async () => {
            await applyCategoryChange(value);
          };
        });

        catTrigger.onclick = () => {
          catMenu.classList.toggle("is-open");
        };
      } else {
        const catSelect = row.createEl("select", { cls: "settings-cat-select" });
        for (const value of categories) {
          const option = catSelect.createEl("option", {
            text: value,
            value,
          });
          if (item.category === value) option.selected = true;
        }
        catSelect.onchange = async () => {
          await applyCategoryChange(catSelect.value);
        };
      }

      const pointsInput = row.createEl("input", {
        cls: "settings-points-input",
      });
      pointsInput.type = "number";
      pointsInput.value = String(item.points);
      bindSettingsInput(pointsInput);
      pointsInput.onchange = async () => {
        plugin.currentUser.items[idx].points = parseInt(pointsInput.value, 10) || 0;
        await plugin.saveSettings();
      };

      const del = row.createEl("button", {
        text: "🗑",
        cls: "settings-delete-btn",
      });
      del.onclick = async () => {
        showConfirmModal(plugin.app, {
          title: "删除打分项",
          message: "确定删除打分项「" + item.name + "」吗？",
          isDestructive: true,
          onConfirm: async () => {
            try {
              plugin.currentUser.items.splice(idx, 1);
              await plugin.saveSettings();
              renderItems();
            } catch (error) {
              new Notice(
                "❌ 删除失败：" +
                  (error instanceof Error ? error.message : String(error))
              );
            }
          },
        });
      };

      const noteInput = noteRow.createEl("textarea", {
        cls: "settings-note-input",
      });
      noteInput.placeholder = "备注（可选），支持多行";
      noteInput.value = item.note || "";
      noteInput.rows = 1;
      attachAutoResize(noteInput);
      bindSettingsInput(noteInput);
      noteInput.addEventListener("change", async () => {
        plugin.currentUser.items[idx].note = noteInput.value;
        await plugin.saveSettings();
      });

      dragState.rows.push(wrap);
    }

    const groupHeaders = Array.from(
      itemsWrap.querySelectorAll(".settings-cat-group-header")
    ) as HTMLElement[];
    groupHeaders.forEach((header, hi) => {
      const category = header.querySelector("span")?.textContent || "";
      const nextSibling = groupHeaders[hi + 1] || null;
      const addBtn = document.createElement("button");
      addBtn.className = "settings-cat-add-btn";
      addBtn.textContent = "+ 在「" + category + "」添加项目";
      addBtn.onclick = async () => {
        try {
          const newItemId = "item_" + Date.now();
          plugin.currentUser.items.push({
            id: newItemId,
            name: "新项目",
            points: 1,
            emoji: "⭐",
            category,
            note: "",
          });
          sortItemsByCategories(
            plugin.currentUser.items,
            plugin.currentUser.categories || []
          );
          await plugin.saveSettings();
          setPendingScrollItemId(newItemId);
          renderItems();
        } catch (error) {
          new Notice(
            "❌ 添加失败：" +
              (error instanceof Error ? error.message : String(error))
          );
        }
      };
      if (nextSibling) itemsWrap.insertBefore(addBtn, nextSibling);
      else itemsWrap.appendChild(addBtn);
    });

    if (pendingScrollItemId) {
      requestAnimationFrame(() => {
        const newItemEl = itemsWrap.querySelector<HTMLElement>(
          '.settings-item-wrap[data-item-id="' + pendingScrollItemId + '"]'
        );
        if (newItemEl) {
          // Try scrollIntoView first (works on desktop and some mobile layouts)
          newItemEl.scrollIntoView({ block: "center", behavior: "smooth" });

          // Fallback: if Obsidian's settings page uses a separate scroll
          // container (common on mobile), also scroll that container.
          const scrollContainer = getScrollContainer();
          if (scrollContainer && scrollContainer !== itemsWrap) {
            const scrollerEl = scrollContainer as HTMLElement;
            const itemTop =
              newItemEl.offsetTop -
              (itemsWrap.offsetTop - scrollerEl.offsetTop);
            const desiredScroll = Math.max(
              0,
              itemTop -
                scrollerEl.clientHeight / 2 +
                newItemEl.clientHeight / 2
            );
            scrollerEl.scrollTo({ top: desiredScroll, behavior: "smooth" });
          }

          newItemEl.addClass("is-new-item");
          window.setTimeout(() => newItemEl.removeClass("is-new-item"), 1600);
          const nameInput = newItemEl.querySelector<HTMLInputElement>(".settings-name-input");
          if (nameInput) {
            window.setTimeout(() => {
              nameInput.focus();
              nameInput.select();
            }, 220);
          }
        }
        setPendingScrollItemId(null);
      });
    } else if (scroller && preservedScrollTop !== null) {
      requestAnimationFrame(() => {
        scroller.scrollTop = preservedScrollTop;
      });
    }
  };

  renderItems();
}

import { getOverlayMount, bindModalInputFocus } from "../utils/dom";
import {
  getEmojiCategoryItems,
  getEmojiCategoryKeys,
  searchEmojis,
} from "./emoji-picker-search";

export function showEmojiPicker(
  callback: (emoji: string) => void,
  container?: HTMLElement
): void {
  const activeInput = document.activeElement as HTMLElement | null;
  if (
    activeInput &&
    /^(INPUT|TEXTAREA|SELECT)$/.test(activeInput.tagName)
  ) {
    activeInput.blur();
  }

  const overlay = document.createElement("div");
  overlay.className = "kid-score-value-overlay";

  const popup = document.createElement("div");
  popup.className = "kid-score-emoji-fullpicker";
  const overlayStateId = "emoji-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  let pushedHistoryState = false;

  const header = document.createElement("div");
  header.className = "emoji-fp-header";
  header.textContent = "选择图标";
  popup.appendChild(header);

  const customRow = document.createElement("div");
  customRow.className = "emoji-fp-custom";
  const customInput = document.createElement("input");
  customInput.type = "text";
  customInput.placeholder = "搜索：输入中文关键字或直接输入emoji...";
  customInput.maxLength = 32;
  customInput.className = "emoji-fp-input";
  customInput.setAttribute("inputmode", "text");
  bindModalInputFocus(customInput);

  const customConfirm = document.createElement("button");
  customConfirm.className = "value-popup-confirm mod-cta";
  customConfirm.textContent = "确定";
  customConfirm.style.padding = "6px 16px";

  // iOS keyboard avoidance for emoji picker:
  // The overlay is position:fixed with top:0/bottom:0, so it covers the
  // *layout* viewport (including the keyboard area). We shrink it to the
  // *visual* viewport height so the popup aligns to the keyboard top edge.
  const adjustForKeyboard = () => {
    if (!window.visualViewport) return;
    const vvH = window.visualViewport.height;
    overlay.style.bottom = "auto";
    overlay.style.height = vvH + "px";
    popup.style.maxHeight = Math.max(200, vvH - 24) + "px";
  };
  const onVVResize = () => adjustForKeyboard();

  const removeOverlay = () => {
    overlay.remove();
    window.removeEventListener("popstate", onPopstate);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", onVVResize);
    }
    if (
      pushedHistoryState &&
      (history.state as any)?.kidScoreOverlayId === overlayStateId
    ) {
      history.back();
    }
  };

  customInput.addEventListener("focus", adjustForKeyboard);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onVVResize);
  }

  customConfirm.onclick = () => {
    const v = customInput.value.trim();
    if (v) {
      callback(v);
      removeOverlay();
    }
  };
  customRow.appendChild(customInput);
  customRow.appendChild(customConfirm);
  popup.appendChild(customRow);

  const catTabs = document.createElement("div");
  catTabs.className = "emoji-fp-tabs";
  const catKeys = getEmojiCategoryKeys();
  const gridWrap = document.createElement("div");
  gridWrap.className = "emoji-fp-grid-wrap";

  const renderEmojis = (emojis: string[]) => {
    gridWrap.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "emoji-fp-grid";
    for (const em of emojis) {
      const btn = document.createElement("button");
      btn.className = "emoji-fp-btn";
      btn.textContent = em;
      btn.onclick = () => {
        callback(em);
        removeOverlay();
      };
      grid.appendChild(btn);
    }
    if (emojis.length === 0) {
      const hint = document.createElement("div");
      hint.style.cssText =
        "text-align:center;color:var(--text-muted);padding:20px;font-size:0.9em;";
      hint.textContent = "没有找到匹配的 emoji";
      gridWrap.appendChild(hint);
    }
    gridWrap.appendChild(grid);
  };

  const renderCat = (key: string) => {
    renderEmojis(getEmojiCategoryItems(key));
  };

  let searchTimer: ReturnType<typeof setTimeout> | null = null;
  let isComposing = false;
  customInput.addEventListener("compositionstart", () => {
    isComposing = true;
    (customInput as HTMLInputElement & { composing?: boolean }).composing = true;
  });
  customInput.addEventListener("compositionend", () => {
    isComposing = false;
    (customInput as HTMLInputElement & { composing?: boolean }).composing = false;
    doSearch();
  });

  const doSearch = () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (isComposing) return;
      const q = customInput.value.trim();
      if (!q) {
        const activeTab = catTabs.querySelector<HTMLElement>(".emoji-fp-tab.is-active");
        if (activeTab) {
          renderCat(activeTab.title || "");
        }
        catTabs.style.display = "";
        return;
      }
      const pureEmoji =
        /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]+$/u.test(q);
      if (pureEmoji) return;
      catTabs.style.display = "none";
      const results = searchEmojis(q, catKeys);
      renderEmojis(results);
    }, 100);
  };

  customInput.addEventListener("input", () => {
    if (isComposing) return;
    doSearch();
  });

  catKeys.forEach((key, idx) => {
    const tab = document.createElement("button");
    tab.className = "emoji-fp-tab" + (idx === 0 ? " is-active" : "");
    tab.textContent = key.split(" ")[0];
    tab.title = key;
    tab.onclick = () => {
      catTabs.querySelectorAll(".emoji-fp-tab").forEach((t) => {
        t.classList.remove("is-active");
      });
      tab.classList.add("is-active");
      renderCat(key);
    };
    catTabs.appendChild(tab);
  });

  popup.appendChild(catTabs);
  popup.appendChild(gridWrap);
  renderCat(catKeys[0]);

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "value-popup-cancel";
  cancelBtn.textContent = "取消";
  cancelBtn.style.marginTop = "8px";
  cancelBtn.style.width = "100%";
  cancelBtn.onclick = () => {
    removeOverlay();
  };
  popup.appendChild(cancelBtn);
  overlay.appendChild(popup);

  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) {
      e.preventDefault();
      removeOverlay();
    }
  });

  const onPopstate = (e: PopStateEvent) => {
    if ((e.state as any)?.kidScoreOverlayId === overlayStateId) return;
    if (!overlay.isConnected) return;
    overlay.remove();
    window.removeEventListener("popstate", onPopstate);
    pushedHistoryState = false;
  };
  history.pushState({ kidScoreOverlay: true, kidScoreOverlayId: overlayStateId }, "");
  pushedHistoryState = true;
  window.addEventListener("popstate", onPopstate);
  popup.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
  popup.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  popup.addEventListener("focusin", (e) => {
    e.stopPropagation();
  });
  popup.addEventListener("focusout", (e) => {
    e.stopPropagation();
  });

  getOverlayMount(container).appendChild(overlay);
  setTimeout(() => {
    customInput.focus();
  }, 50);
}

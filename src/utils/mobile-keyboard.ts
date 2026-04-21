import { Modal } from "obsidian";

export type KeyboardCleanup = () => void;

export function setupModalKeyboard(modal: Modal): KeyboardCleanup {
  const cEl = modal.containerEl;
  const mEl = modal.modalEl;
  const contentEl = modal.contentEl;
  const ua = (navigator.userAgent || "").toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isEditModal = mEl.classList.contains("kid-score-edit-modal");
  let stableViewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;

  mEl.style.display = "flex";
  mEl.style.flexDirection = "column";
  mEl.style.overflow = "hidden";
  contentEl.style.flex = "1 1 auto";
  contentEl.style.minHeight = "0";
  contentEl.style.overflowY = "auto";
  contentEl.style.position = "relative";
  contentEl.style.width = "100%";
  (contentEl.style as unknown as Record<string, string>)["overscrollBehavior"] = "contain";
  (contentEl.style as unknown as Record<string, string>)["touchAction"] = "pan-y";
  (contentEl.style as unknown as Record<string, string>)["webkitOverflowScrolling"] =
    "touch";

  const ensureTargetVisible = (target: HTMLElement | null, extraBottom = 96) => {
    if (!target || !contentEl.contains(target)) return;
    const contentRect = contentEl.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const currentTop = targetRect.top - contentRect.top + contentEl.scrollTop;
    const currentBottom = currentTop + targetRect.height;
    const safeTop = contentEl.scrollTop + 12;
    const safeBottom = contentEl.scrollTop + contentEl.clientHeight - extraBottom;

    if (currentBottom > safeBottom) {
      contentEl.scrollTo({
        top: Math.max(0, currentBottom - contentEl.clientHeight + extraBottom),
        behavior: "smooth",
      });
      return;
    }
    if (currentTop < safeTop) {
      contentEl.scrollTo({
        top: Math.max(0, currentTop - 16),
        behavior: "smooth",
      });
    }
  };

  const getKeyboardHeight = () => {
    if (!window.visualViewport) return 0;
    const vv = window.visualViewport;
    const raw = Math.max(
      0,
      stableViewportHeight - vv.height - Math.max(0, vv.offsetTop || 0)
    );
    if (raw < 70) {
      stableViewportHeight = Math.max(stableViewportHeight, vv.height);
      return 0;
    }
    return raw;
  };

  const updateModalLift = (keyboardH: number) => {
    if (!(isIOS && isEditModal)) {
      mEl.style.setProperty("--keyboard-modal-offset", "0px");
      return;
    }
    if (keyboardH > 80) {
      const lift = Math.min(180, Math.max(72, Math.round(keyboardH * 0.32)));
      mEl.style.setProperty("--keyboard-modal-offset", -lift + "px");
    } else {
      mEl.style.setProperty("--keyboard-modal-offset", "0px");
    }
  };

  const applyLayout = () => {
    const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vvTop = window.visualViewport ? window.visualViewport.offsetTop : 0;
    cEl.style.position = "fixed";
    cEl.style.top = vvTop + "px";
    cEl.style.left = "0";
    cEl.style.right = "0";
    cEl.style.bottom = "auto";
    cEl.style.height = vvH + "px";

    if ((isIOS || isAndroid) && window.visualViewport) {
      const keyboardH = getKeyboardHeight();
      updateModalLift(keyboardH);
      if (keyboardH > 80) {
        mEl.style.alignSelf = "flex-start";
        mEl.style.marginTop = "max(12px, env(safe-area-inset-top, 0px))";
        mEl.style.marginBottom = "auto";
        mEl.style.maxHeight = Math.max(120, vvH - 24) + "px";
        if (isIOS && isEditModal) {
          mEl.style.height = Math.max(220, vvH - 12) + "px";
        }
        const extraBottom = isEditModal ? 176 : 72;
        contentEl.style.paddingBottom = Math.round(keyboardH + extraBottom) + "px";
        contentEl.style.scrollPaddingBottom = Math.round(keyboardH + extraBottom) + "px";
      } else {
        mEl.style.alignSelf = "";
        mEl.style.marginTop = "";
        mEl.style.marginBottom = "";
        mEl.style.maxHeight = Math.max(120, vvH - 32) + "px";
        mEl.style.height = "";
        contentEl.style.paddingBottom = "";
        contentEl.style.scrollPaddingBottom = "";
      }
    } else {
      mEl.style.maxHeight = Math.max(120, vvH - 32) + "px";
      mEl.style.height = "";
      updateModalLift(0);
    }

    const focused = document.activeElement as HTMLElement | null;
    if (focused && contentEl.contains(focused)) {
      setTimeout(() => {
        ensureTargetVisible(
          focused,
          focused.tagName === "TEXTAREA" ? 188 : isEditModal ? 148 : 104
        );
      }, isIOS ? 180 : 60);
    }
  };

  const onFocusIn = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target || !contentEl.contains(target)) return;
    const delays = isIOS ? [120, 380, 760] : [80, 220, 420];
    delays.forEach((delay) => {
      setTimeout(() => {
        applyLayout();
        ensureTargetVisible(target, target.tagName === "TEXTAREA" ? 188 : 116);
      }, delay);
    });
    if ((isIOS || isAndroid) && target.tagName === "TEXTAREA") {
      setTimeout(() => {
        if (contentEl.scrollHeight > contentEl.clientHeight) {
          const targetRect = target.getBoundingClientRect();
          const contentRect = contentEl.getBoundingClientRect();
          const targetBottom =
            targetRect.bottom - contentRect.top + contentEl.scrollTop;
          const containerBottom = contentEl.scrollTop + contentEl.clientHeight;
          if (targetBottom > containerBottom - 56) {
            contentEl.scrollTop = targetBottom - contentEl.clientHeight + 128;
          }
        }
      }, isEditModal ? 950 : 850);
      setTimeout(() => {
        ensureTargetVisible(target, 208);
      }, isEditModal ? 1150 : 980);
    }
  };

  const onVVChange = () => {
    setTimeout(applyLayout, 80);
  };

  const onWinResize = () => {
    setTimeout(applyLayout, 80);
  };

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onVVChange);
    window.visualViewport.addEventListener("scroll", onVVChange);
  }
  window.addEventListener("resize", onWinResize);
  mEl.addEventListener("focusin", onFocusIn);
  applyLayout();

  return () => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", onVVChange);
      window.visualViewport.removeEventListener("scroll", onVVChange);
    }
    window.removeEventListener("resize", onWinResize);
    mEl.removeEventListener("focusin", onFocusIn);
    cEl.style.position = "";
    cEl.style.top = "";
    cEl.style.left = "";
    cEl.style.right = "";
    cEl.style.bottom = "";
    cEl.style.height = "";
    mEl.style.maxHeight = "";
    mEl.style.height = "";
    mEl.style.display = "";
    mEl.style.flexDirection = "";
    mEl.style.overflow = "";
    mEl.style.transform = "";
    mEl.style.removeProperty("--keyboard-modal-offset");
    mEl.style.removeProperty("--manual-modal-offset");
    mEl.style.transition = "";
    mEl.style.alignSelf = "";
    mEl.style.marginTop = "";
    mEl.style.marginBottom = "";
    contentEl.style.flex = "";
    contentEl.style.minHeight = "";
    contentEl.style.overflowY = "";
    contentEl.style.position = "";
    contentEl.style.width = "";
    contentEl.style.paddingBottom = "";
    contentEl.style.scrollPaddingBottom = "";
    (contentEl.style as unknown as Record<string, string>)["overscrollBehavior"] = "";
    (contentEl.style as unknown as Record<string, string>)["touchAction"] = "";
    (contentEl.style as unknown as Record<string, string>)["webkitOverflowScrolling"] =
      "";
  };
}

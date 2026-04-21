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
  (contentEl.style as unknown as Record<string, string>)["webkitOverflowScrolling"] = "touch";

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
      const keyboardH = Math.max(0, window.innerHeight - window.visualViewport.height);
      if (keyboardH > 80) {
        // anchor modal to top so keyboard can never cover the bottom content
        mEl.style.alignSelf = "flex-start";
        mEl.style.marginTop = "max(12px, env(safe-area-inset-top, 0px))";
        mEl.style.marginBottom = "auto";
        mEl.style.maxHeight = Math.max(120, vvH - 24) + "px";
        contentEl.style.paddingBottom = Math.round(keyboardH + (isEditModal ? 120 : 40)) + "px";
      } else {
        mEl.style.alignSelf = "";
        mEl.style.marginTop = "";
        mEl.style.marginBottom = "";
        mEl.style.maxHeight = Math.max(120, vvH - 32) + "px";
        contentEl.style.paddingBottom = "";
      }
    } else {
      mEl.style.maxHeight = Math.max(120, vvH - 32) + "px";
    }

    const focused = document.activeElement as HTMLElement | null;
    if (focused && contentEl.contains(focused)) {
      setTimeout(() => {
        focused.scrollIntoView({ block: "center", behavior: "smooth" });
        ensureTargetVisible(focused, isEditModal ? 132 : 96);
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
        ensureTargetVisible(target, target.tagName === "TEXTAREA" ? 148 : 104);
      }, delay);
    });
    if ((isIOS || isAndroid) && target.tagName === "TEXTAREA") {
      setTimeout(() => {
        if (contentEl.scrollHeight > contentEl.clientHeight) {
          const targetRect = target.getBoundingClientRect();
          const contentRect = contentEl.getBoundingClientRect();
          const targetBottom = targetRect.bottom - contentRect.top + contentEl.scrollTop;
          const containerBottom = contentEl.scrollTop + contentEl.clientHeight;
          if (targetBottom > containerBottom - 40) {
            contentEl.scrollTop = targetBottom - contentEl.clientHeight + 80;
          }
        }
      }, isEditModal ? 950 : 850);
      setTimeout(() => {
        ensureTargetVisible(target, 168);
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

  return function cleanup() {
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
    mEl.style.display = "";
    mEl.style.flexDirection = "";
    mEl.style.overflow = "";
    mEl.style.transform = "";
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
    (contentEl.style as unknown as Record<string, string>)["overscrollBehavior"] = "";
    (contentEl.style as unknown as Record<string, string>)["touchAction"] = "";
    (contentEl.style as unknown as Record<string, string>)["webkitOverflowScrolling"] = "";
  };
}

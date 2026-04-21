import { Modal } from "obsidian";
import { isIOS, isAndroid } from "./platform";

export type KeyboardCleanup = () => void;

export function setupModalKeyboard(modal: Modal): KeyboardCleanup {
  const cEl = modal.containerEl;
  const mEl = modal.modalEl;
  const contentEl = modal.contentEl;
  const platformIsIOS = isIOS();
  const platformIsAndroid = isAndroid();
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
    if (!(platformIsIOS && isEditModal)) {
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

    if ((platformIsIOS || platformIsAndroid) && window.visualViewport) {
      const keyboardH = getKeyboardHeight();
      updateModalLift(keyboardH);
      if (keyboardH > 80) {
        mEl.style.alignSelf = "flex-start";
        mEl.style.marginTop = "max(12px, env(safe-area-inset-top, 0px))";
        mEl.style.marginBottom = "auto";
        mEl.style.maxHeight = Math.max(120, vvH - 24) + "px";
        if (platformIsIOS && isEditModal) {
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
      }, platformIsIOS ? 120 : 60);
    }
  };

  const onFocusIn = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target || !contentEl.contains(target)) return;
    // Primary: rely on visualViewport resize listener to adjust layout.
    // Fallback 1: quick retry for browsers with slightly delayed resize.
    const delay = platformIsIOS ? 120 : 80;
    setTimeout(() => {
      applyLayout();
      ensureTargetVisible(target, target.tagName === "TEXTAREA" ? 188 : 116);
    }, delay);
    // Fallback 2: longer retry for iOS where visualViewport resize may not
    // fire reliably (observed on iOS 26.4.1).
    if (platformIsIOS) {
      setTimeout(() => {
        applyLayout();
        ensureTargetVisible(target, target.tagName === "TEXTAREA" ? 188 : 116);
      }, 380);
    }
  };

  const onVVChange = () => {
    // Debounce slightly: iOS sometimes fires multiple resize events
    // during keyboard animation.
    setTimeout(applyLayout, 40);
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

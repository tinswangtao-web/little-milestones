import { Modal } from "obsidian";
import { isIOS, isAndroid } from "./platform";

export type KeyboardCleanup = () => void;

export function setupModalKeyboard(modal: Modal): KeyboardCleanup {
  const cEl = modal.containerEl;
  const mEl = modal.modalEl;
  const contentEl = modal.contentEl;
  const previousContainerStyles = {
    position: cEl.style.position,
    top: cEl.style.top,
    left: cEl.style.left,
    right: cEl.style.right,
    bottom: cEl.style.bottom,
    height: cEl.style.height,
  };
  const previousModalStyles = {
    maxHeight: mEl.style.maxHeight,
    height: mEl.style.height,
    display: mEl.style.display,
    flexDirection: mEl.style.flexDirection,
    overflow: mEl.style.overflow,
    transform: mEl.style.transform,
    transition: mEl.style.transition,
    alignSelf: mEl.style.alignSelf,
    marginTop: mEl.style.marginTop,
    marginBottom: mEl.style.marginBottom,
    keyboardOffset: mEl.style.getPropertyValue("--keyboard-modal-offset"),
    manualOffset: mEl.style.getPropertyValue("--manual-modal-offset"),
    datasetManualOffset: mEl.dataset.manualModalOffset || "",
  };
  const previousContentStyles = {
    flex: contentEl.style.flex,
    minHeight: contentEl.style.minHeight,
    overflowY: contentEl.style.overflowY,
    position: contentEl.style.position,
    width: contentEl.style.width,
    paddingBottom: contentEl.style.paddingBottom,
    scrollPaddingBottom: contentEl.style.scrollPaddingBottom,
    overscrollBehavior:
      (contentEl.style as unknown as Record<string, string>)["overscrollBehavior"] || "",
    touchAction:
      (contentEl.style as unknown as Record<string, string>)["touchAction"] || "",
    webkitOverflowScrolling:
      (contentEl.style as unknown as Record<string, string>)["webkitOverflowScrolling"] || "",
  };
  const platformIsIOS = isIOS();
  const platformIsAndroid = isAndroid();
  const isEditModal = mEl.classList.contains("kid-score-edit-modal");
  let stableViewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;
  let isManualAdjusting = false;

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

  const readManualOffset = () =>
    parseInt(mEl.dataset.manualModalOffset || "0", 10) || 0;

  const readKeyboardOffset = () =>
    parseInt(mEl.style.getPropertyValue("--keyboard-modal-offset") || "0", 10) || 0;

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
    if (keyboardH <= 80) {
      mEl.style.setProperty("--keyboard-modal-offset", "0px");
      return;
    }

    if (isManualAdjusting) return;

    const desiredBottom = (window.visualViewport?.offsetTop || 0) +
      (window.visualViewport?.height || window.innerHeight) -
      8;
    const currentRect = mEl.getBoundingClientRect();
    const currentKeyboardOffset = readKeyboardOffset();
    const nextKeyboardOffset = currentKeyboardOffset + (desiredBottom - currentRect.bottom);
    mEl.style.setProperty("--keyboard-modal-offset", Math.round(nextKeyboardOffset) + "px");
  };

  const applyLayout = () => {
    const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vvTop = window.visualViewport ? window.visualViewport.offsetTop : 0;
    const compactViewport = vvH < 520;
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
        const keyboardMaxHeight = Math.max(compactViewport ? 180 : 220, vvH - (compactViewport ? 8 : 12));
        mEl.style.maxHeight = keyboardMaxHeight + "px";
        if (platformIsIOS && isEditModal) {
          mEl.style.height = keyboardMaxHeight + "px";
        }
        const extraBottom = isEditModal ? 28 : 18;
        contentEl.style.paddingBottom = Math.round(extraBottom) + "px";
        contentEl.style.scrollPaddingBottom = Math.round(extraBottom + 12) + "px";
      } else {
        mEl.style.alignSelf = "";
        mEl.style.marginTop = "";
        mEl.style.marginBottom = "";
        mEl.style.maxHeight = Math.max(compactViewport ? 108 : 120, vvH - (compactViewport ? 20 : 32)) + "px";
        mEl.style.height = "";
        contentEl.style.paddingBottom = "";
        contentEl.style.scrollPaddingBottom = "";
      }
    } else {
      mEl.style.maxHeight = Math.max(compactViewport ? 108 : 120, vvH - (compactViewport ? 20 : 32)) + "px";
      mEl.style.height = "";
      updateModalLift(0);
    }

    const focused = document.activeElement as HTMLElement | null;
    if (focused && contentEl.contains(focused)) {
      setTimeout(() => {
        ensureTargetVisible(focused, focused.tagName === "TEXTAREA" ? 98 : isEditModal ? 76 : 56);
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
      ensureTargetVisible(target, target.tagName === "TEXTAREA" ? 98 : 72);
    }, delay);
    // Fallback 2: longer retry for iOS where visualViewport resize may not
    // fire reliably (observed on iOS 26.4.1).
    if (platformIsIOS) {
      setTimeout(() => {
        applyLayout();
        ensureTargetVisible(target, target.tagName === "TEXTAREA" ? 98 : 72);
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
  const onManualDragStart = () => {
    isManualAdjusting = true;
  };
  const onManualDragEnd = () => {
    isManualAdjusting = false;
  };
  window.addEventListener("resize", onWinResize);
  mEl.addEventListener("focusin", onFocusIn);
  mEl.addEventListener("kid-score:manual-drag-start", onManualDragStart as EventListener);
  mEl.addEventListener("kid-score:manual-drag-end", onManualDragEnd as EventListener);
  applyLayout();

  return () => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", onVVChange);
      window.visualViewport.removeEventListener("scroll", onVVChange);
    }
    window.removeEventListener("resize", onWinResize);
    mEl.removeEventListener("focusin", onFocusIn);
    mEl.removeEventListener("kid-score:manual-drag-start", onManualDragStart as EventListener);
    mEl.removeEventListener("kid-score:manual-drag-end", onManualDragEnd as EventListener);
    cEl.style.position = previousContainerStyles.position;
    cEl.style.top = previousContainerStyles.top;
    cEl.style.left = previousContainerStyles.left;
    cEl.style.right = previousContainerStyles.right;
    cEl.style.bottom = previousContainerStyles.bottom;
    cEl.style.height = previousContainerStyles.height;
    mEl.style.maxHeight = previousModalStyles.maxHeight;
    mEl.style.height = previousModalStyles.height;
    mEl.style.display = previousModalStyles.display;
    mEl.style.flexDirection = previousModalStyles.flexDirection;
    mEl.style.overflow = previousModalStyles.overflow;
    mEl.style.transform = previousModalStyles.transform;
    if (previousModalStyles.keyboardOffset) {
      mEl.style.setProperty("--keyboard-modal-offset", previousModalStyles.keyboardOffset);
    } else {
      mEl.style.removeProperty("--keyboard-modal-offset");
    }
    if (previousModalStyles.manualOffset) {
      mEl.style.setProperty("--manual-modal-offset", previousModalStyles.manualOffset);
    } else {
      mEl.style.removeProperty("--manual-modal-offset");
    }
    if (previousModalStyles.datasetManualOffset) {
      mEl.dataset.manualModalOffset = previousModalStyles.datasetManualOffset;
    } else {
      delete mEl.dataset.manualModalOffset;
    }
    mEl.style.transition = previousModalStyles.transition;
    mEl.style.alignSelf = previousModalStyles.alignSelf;
    mEl.style.marginTop = previousModalStyles.marginTop;
    mEl.style.marginBottom = previousModalStyles.marginBottom;
    contentEl.style.flex = previousContentStyles.flex;
    contentEl.style.minHeight = previousContentStyles.minHeight;
    contentEl.style.overflowY = previousContentStyles.overflowY;
    contentEl.style.position = previousContentStyles.position;
    contentEl.style.width = previousContentStyles.width;
    contentEl.style.paddingBottom = previousContentStyles.paddingBottom;
    contentEl.style.scrollPaddingBottom = previousContentStyles.scrollPaddingBottom;
    (contentEl.style as unknown as Record<string, string>)["overscrollBehavior"] =
      previousContentStyles.overscrollBehavior;
    (contentEl.style as unknown as Record<string, string>)["touchAction"] =
      previousContentStyles.touchAction;
    (contentEl.style as unknown as Record<string, string>)["webkitOverflowScrolling"] =
      previousContentStyles.webkitOverflowScrolling;
  };
}

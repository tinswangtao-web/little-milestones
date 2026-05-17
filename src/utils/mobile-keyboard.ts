import { Modal } from "obsidian";
import { isIOS, isAndroid } from "./platform";

export type KeyboardCleanup = () => void;

function getKeyboardHeight(stableViewportHeight: number): number {
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
  // Safety cap: iOS keyboard rarely exceeds ~350px. Anything larger is
  // usually an orientation change or split-screen shrinking the viewport
  // without an actual keyboard opening.
  if (raw > 520) return 0;
  return raw;
}

function hasFocusedModalField(contentEl: HTMLElement): boolean {
  const active = document.activeElement as HTMLElement | null;
  return !!(
    active &&
    contentEl.contains(active) &&
    /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)
  );
}

function getFocusScrollExtraBottom(
  target: HTMLElement,
  isEditModal: boolean,
  isDailyModal: boolean
): number {
  if (isDailyModal) {
    return Math.max(160, Math.round(window.innerHeight * 0.45));
  }
  if (target.tagName === "TEXTAREA") {
    return 98;
  }
  if (isEditModal) {
    return 76;
  }
  return 56;
}

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
    height: contentEl.style.height,
    display: contentEl.style.display,
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
  const isEditModal = mEl.classList.contains("little-milestones-edit-modal");
  const isDailyModal = (modal as { modalType?: string }).modalType === "daily";
  const requiresFullKeyboardHeight = !!mEl.querySelector(".little-milestones-custom-form");
  let stableViewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;
  let isManualAdjusting = false;

  // ── Unified layout scheduler ──
  // We debounce all layout-triggering events into a single applyLayout call
  // to prevent iOS keyboard animation jitter caused by multiple overlapping
  // applyLayout + ensureTargetVisible invocations.
  let layoutTimer: number | null = null;
  let fallbackTimer: number | null = null;
  let pendingFocusTarget: HTMLElement | null = null;
  let lastFlushTime = 0;

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
  // iOS Safari: -webkit-overflow-scrolling:touch is a notorious source of scroll
  // lock bugs. For daily modal we skip it entirely; for others we keep it.
  if (!isDailyModal) {
    (contentEl.style as unknown as Record<string, string>)["webkitOverflowScrolling"] =
      "touch";
  }

  const ensureTargetVisible = (target: HTMLElement | null, extraBottom = 96) => {
    if (!target || !contentEl.contains(target)) return;
    const contentRect = contentEl.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const currentTop = targetRect.top - contentRect.top + contentEl.scrollTop;
    let currentBottom = currentTop + targetRect.height;
    if (isDailyModal && target.classList.contains("diary-textarea")) {
      const actions = contentEl.querySelector<HTMLElement>(".little-milestones-actions");
      if (actions) {
        const actionsRect = actions.getBoundingClientRect();
        const actionsBottom = actionsRect.bottom - contentRect.top + contentEl.scrollTop;
        currentBottom = Math.max(currentBottom, actionsBottom);
      }
    }
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
      (isEditModal ? 24 : 8);
    const currentRect = mEl.getBoundingClientRect();
    const currentKeyboardOffset = readKeyboardOffset();
    // Derive the natural (un-lifted) bottom position by removing the current
    // keyboard offset from the measured rect. This prevents cumulative drift
    // where each layout pass adds another offset on top of the previous one.
    const naturalBottom = currentRect.bottom - currentKeyboardOffset;
    // Keyboard avoidance should never push the score-edit sheet downward.
    // If the sheet is already above the keyboard, leave downward adjustment to manual drag.
    const nextKeyboardOffset = Math.min(0, desiredBottom - naturalBottom);
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
      const keyboardH = getKeyboardHeight(stableViewportHeight);
      const forceKeyboardMode =
        platformIsIOS && hasFocusedModalField(contentEl) && (isEditModal || isDailyModal);
      const effectiveKeyboardH = forceKeyboardMode ? Math.max(keyboardH, 81) : keyboardH;
      if (effectiveKeyboardH > 80) {
        mEl.style.alignSelf = "flex-start";
        mEl.style.marginTop = "max(12px, env(safe-area-inset-top, 0px))";
        mEl.style.marginBottom = "auto";
        const keyboardMaxHeight = Math.max(compactViewport ? 180 : 220, vvH - (compactViewport ? 8 : 12));
        mEl.style.maxHeight = keyboardMaxHeight + "px";
        if (platformIsIOS && isEditModal && requiresFullKeyboardHeight) {
          mEl.style.height = keyboardMaxHeight + "px";
        } else if (isDailyModal) {
          // Daily modal: iOS Safari has a known bug where overflow-y:auto on a
          // child is silently ignored if the parent has overflow:hidden. We
          // remove the parent's clip (overflow:visible) and give the child a
          // strict pixel height so it establishes its own scrollable box.
          mEl.style.overflow = "visible";
          mEl.style.height = keyboardMaxHeight + "px";
          const titleHeight = modal.titleEl ? modal.titleEl.offsetHeight : 0;
          const contentHeight = Math.max(100, keyboardMaxHeight - titleHeight);
          contentEl.style.height = contentHeight + "px";
          contentEl.style.display = "block";
          contentEl.style.flex = "none";
        } else {
          mEl.style.height = "";
        }
        const extraBottom = isEditModal
          ? 28
          : isDailyModal
            ? Math.max(160, Math.round(stableViewportHeight * 0.5))
            : 18;
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
        if (isDailyModal) {
          mEl.style.overflow = previousModalStyles.overflow;
          contentEl.style.height = previousContentStyles.height;
          contentEl.style.display = "";
        }
      }
      updateModalLift(effectiveKeyboardH);
    } else {
      mEl.style.maxHeight = Math.max(compactViewport ? 108 : 120, vvH - (compactViewport ? 20 : 32)) + "px";
      mEl.style.height = "";
      updateModalLift(0);
    }
  };

  // Flush applies layout and then scrolls the pending focus target (if any)
  // into view with the correct extraBottom margin.
  const flushLayout = () => {
    if (layoutTimer !== null) {
      clearTimeout(layoutTimer);
      layoutTimer = null;
    }
    applyLayout();
    if (pendingFocusTarget && contentEl.contains(pendingFocusTarget)) {
      const extraBottom = getFocusScrollExtraBottom(
        pendingFocusTarget,
        isEditModal,
        isDailyModal
      );
      ensureTargetVisible(pendingFocusTarget, extraBottom);
    }
    pendingFocusTarget = null;
    lastFlushTime = Date.now();
  };

  // Schedule a single debounced layout pass. Multiple calls within `delay`
  // collapse into one execution, eliminating the jitter from overlapping
  // visualViewport resize + focusin + window resize events.
  const scheduleLayout = (delay: number, captureFocusTarget = false) => {
    if (layoutTimer !== null) {
      clearTimeout(layoutTimer);
    }
    if (captureFocusTarget) {
      const focused = document.activeElement as HTMLElement | null;
      if (focused && contentEl.contains(focused)) {
        pendingFocusTarget = focused;
      }
    }
    layoutTimer = window.setTimeout(flushLayout, delay);
  };

  // iOS sometimes fails to fire visualViewport resize. This hard fallback
  // guarantees that we run at least once ~400 ms after a focus event.
  const scheduleHardFallback = () => {
    if (fallbackTimer !== null) {
      clearTimeout(fallbackTimer);
    }
    fallbackTimer = window.setTimeout(() => {
      if (Date.now() - lastFlushTime > 300) {
        flushLayout();
      }
    }, 420);
  };

  const onFocusIn = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target || !contentEl.contains(target)) return;
    scheduleLayout(platformIsIOS ? 120 : 80, true);
    if (platformIsIOS) {
      scheduleHardFallback();
    }
  };

  const onVVChange = () => {
    // Slightly longer than before (40 -> 60) to catch the tail end of
    // iOS keyboard animation frames without over-firing.
    scheduleLayout(60);
  };

  const onWinResize = () => {
    scheduleLayout(80);
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
  mEl.addEventListener("little-milestones:manual-drag-start", onManualDragStart as EventListener);
  mEl.addEventListener("little-milestones:manual-drag-end", onManualDragEnd as EventListener);

  // Initial layout
  flushLayout();

  return () => {
    if (layoutTimer !== null) {
      clearTimeout(layoutTimer);
      layoutTimer = null;
    }
    if (fallbackTimer !== null) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", onVVChange);
      window.visualViewport.removeEventListener("scroll", onVVChange);
    }
    window.removeEventListener("resize", onWinResize);
    mEl.removeEventListener("focusin", onFocusIn);
    mEl.removeEventListener("little-milestones:manual-drag-start", onManualDragStart as EventListener);
    mEl.removeEventListener("little-milestones:manual-drag-end", onManualDragEnd as EventListener);
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
    contentEl.style.height = previousContentStyles.height;
    contentEl.style.display = previousContentStyles.display;
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

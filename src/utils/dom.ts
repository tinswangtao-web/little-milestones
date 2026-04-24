import { getMobilePlatform, isIOS, isTouchDevice } from "./platform";

export function getOverlayMount(containerEl?: HTMLElement): HTMLElement {
  return document.body.classList.contains("is-mobile")
    ? document.body
    : containerEl || document.body;
}

export interface BindInputFocusOptions {
  manualTouchFocus?: boolean;
  scrollOnIOSFocus?: boolean;
}

export function bindModalInputFocus(
  input: HTMLElement | null,
  options: BindInputFocusOptions = {}
): void {
  if (!input) return;
  const inp = input as HTMLInputElement;
  const isTouch = isTouchDevice() && getMobilePlatform() !== "desktop";
  const platformIsIOS = isIOS();
  const {
    manualTouchFocus = true,
    scrollOnIOSFocus = true,
  } = options;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  const touchMoveThreshold = 18;

  if (inp.tagName === "INPUT" && inp.type === "number") {
    inp.setAttribute("inputmode", "numeric");
  }
  input.setAttribute("tabindex", "0");

  input.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  if (isTouch) {
    input.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      touchStartX = touch ? touch.clientX : 0;
      touchStartY = touch ? touch.clientY : 0;
      touchMoved = false;
      e.stopPropagation();
    }, { passive: true } as EventListenerOptions);
    input.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      if (
        Math.abs(touch.clientX - touchStartX) > touchMoveThreshold ||
        Math.abs(touch.clientY - touchStartY) > touchMoveThreshold
      ) {
        touchMoved = true;
      }
    }, { passive: true } as EventListenerOptions);
    input.addEventListener("touchend", (e) => {
      e.stopPropagation();
      if (!manualTouchFocus || touchMoved) return;
      inp.focus();
    });
  }

  const setIOSKeyboardFocusState = (on: boolean) => {
    if (!platformIsIOS) return;
    const modal = input.closest(".kid-score-edit-modal, .kid-score-import-modal");
    const scroller = input.closest(".modal-content") as HTMLElement | null;
    if (!modal || !scroller) return;
    modal.classList.toggle("has-ios-keyboard-focus", on);
    if (on) {
      const target = input as HTMLElement;
      const forceScroll = () => {
        const scrollerRect = scroller.getBoundingClientRect();
        const inputRect = target.getBoundingClientRect();
        const visibleTop = scrollerRect.top + 12;
        const visibleBottom = scrollerRect.bottom - Math.max(48, scroller.clientHeight * 0.18);
        if (inputRect.top >= visibleTop && inputRect.bottom <= visibleBottom) return;
        const inputTop = inputRect.top - scrollerRect.top + scroller.scrollTop;
        const desiredTop = Math.max(
          0,
          inputTop - Math.max(16, scroller.clientHeight * 0.1)
        );
        scroller.scrollTo({ top: desiredTop, behavior: "smooth" });
      };
      setTimeout(forceScroll, 120);
      setTimeout(forceScroll, 360);
    }
  };

  input.addEventListener("focus", () => {
    if (!scrollOnIOSFocus) return;
    if (!platformIsIOS) return;
    setIOSKeyboardFocusState(true);
    const scrollWithinModal = () => {
      const scroller = input.closest(".modal-content") as HTMLElement | null;
      if (!scroller) {
        if (input.scrollIntoView) input.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      const scrollerRect = scroller.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();
      const visibleTop = scrollerRect.top + 12;
      const visibleBottom = scrollerRect.bottom - Math.max(52, scroller.clientHeight * 0.16);
      if (inputRect.top >= visibleTop && inputRect.bottom <= visibleBottom) return;
      const inputTop = inputRect.top - scrollerRect.top + scroller.scrollTop;
      const desiredTop = Math.max(
        0,
        inputTop - Math.max(18, scroller.clientHeight * 0.12)
      );
      scroller.scrollTo({ top: desiredTop, behavior: "smooth" });
    };
    const doScroll = (delay: number) => {
      setTimeout(() => {
        scrollWithinModal();
      }, delay);
    };
    doScroll(120);
    doScroll(360);
  });

  input.addEventListener("blur", () => {
    if (!platformIsIOS) return;
    setTimeout(() => {
      const active = document.activeElement as HTMLElement | null;
      if (
        active &&
        active.closest &&
        active.closest(".kid-score-edit-modal, .kid-score-import-modal") ===
          input.closest(".kid-score-edit-modal, .kid-score-import-modal")
      ) {
        return;
      }
      setIOSKeyboardFocusState(false);
    }, 180);
  });
}

export interface AttachAutoResizeOptions {
  minHeight?: number;
  immediate?: boolean;
}

export function attachAutoResize(
  textarea: HTMLTextAreaElement,
  options: AttachAutoResizeOptions = {}
): void {
  const { minHeight = 52, immediate = true } = options;
  const resize = () => {
    textarea.style.height = "auto";
    textarea.style.height = Math.max(minHeight, textarea.scrollHeight) + "px";
  };
  if (immediate) {
    requestAnimationFrame(resize);
    setTimeout(resize, 60);
  }
  textarea.addEventListener("input", resize);
  textarea.addEventListener("focus", resize);
}

export interface BindTouchScrollGuardOptions {
  releaseDelay?: number;
  moveThreshold?: number;
}

export function bindTouchScrollGuard(
  containerEl: HTMLElement,
  options: BindTouchScrollGuardOptions = {}
): () => void {
  const { releaseDelay = 120, moveThreshold = 18 } = options;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  let releaseTimer: number | null = null;

  const releaseReadonlyInputs = () => {
    if (releaseTimer !== null) {
      window.clearTimeout(releaseTimer);
      releaseTimer = null;
    }
    const inputs = containerEl.querySelectorAll(
      'input[readonly]:not([type="button"]):not([type="submit"]), textarea[readonly]'
    );
    inputs.forEach((inp) => inp.removeAttribute("readonly"));
  };

  const onTouchStart = (e: TouchEvent) => {
    releaseReadonlyInputs();
    if (!e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchMoved = false;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (
      Math.abs(touch.clientX - touchStartX) > moveThreshold ||
      Math.abs(touch.clientY - touchStartY) > moveThreshold
    ) {
      touchMoved = true;
      const inputs = containerEl.querySelectorAll(
        'input:not([type="button"]):not([type="submit"]), textarea'
      );
      inputs.forEach((inp) => inp.setAttribute("readonly", "readonly"));
    }
  };

  const onTouchEnd = () => {
    if (touchMoved) {
      releaseTimer = window.setTimeout(releaseReadonlyInputs, releaseDelay);
    }
  };

  const onTouchCancel = () => {
    touchMoved = false;
    releaseReadonlyInputs();
  };

  containerEl.addEventListener("touchstart", onTouchStart, { passive: true });
  containerEl.addEventListener("touchmove", onTouchMove, { passive: true });
  containerEl.addEventListener("touchend", onTouchEnd, { passive: true });
  containerEl.addEventListener("touchcancel", onTouchCancel, { passive: true });

  return () => {
    releaseReadonlyInputs();
    containerEl.removeEventListener("touchstart", onTouchStart);
    containerEl.removeEventListener("touchmove", onTouchMove);
    containerEl.removeEventListener("touchend", onTouchEnd);
    containerEl.removeEventListener("touchcancel", onTouchCancel);
  };
}

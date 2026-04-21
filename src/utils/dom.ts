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
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isIOS = /iphone|ipad|ipod/.test((navigator.userAgent || "").toLowerCase());
  const {
    manualTouchFocus = true,
    scrollOnIOSFocus = true,
  } = options;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;

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
        Math.abs(touch.clientX - touchStartX) > 8 ||
        Math.abs(touch.clientY - touchStartY) > 8
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
    if (!isIOS) return;
    const modal = input.closest(".kid-score-edit-modal, .kid-score-import-modal");
    const scroller = input.closest(".modal-content") as HTMLElement | null;
    if (!modal || !scroller) return;
    modal.classList.toggle("has-ios-keyboard-focus", on);
    if (on) {
      const target = input as HTMLElement;
      const forceScroll = () => {
        const scrollerRect = scroller.getBoundingClientRect();
        const inputRect = target.getBoundingClientRect();
        const inputTop = inputRect.top - scrollerRect.top + scroller.scrollTop;
        const desiredTop = Math.max(
          0,
          inputTop - Math.max(16, scroller.clientHeight * 0.1)
        );
        scroller.scrollTo({ top: desiredTop, behavior: "smooth" });
      };
      setTimeout(forceScroll, 80);
      setTimeout(forceScroll, 260);
      setTimeout(forceScroll, 520);
      setTimeout(forceScroll, 860);
    }
  };

  input.addEventListener("focus", () => {
    if (!scrollOnIOSFocus) return;
    if (!isIOS) return;
    setIOSKeyboardFocusState(true);
    const scrollWithinModal = () => {
      const scroller = input.closest(".modal-content") as HTMLElement | null;
      if (!scroller) {
        if (input.scrollIntoView) input.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      const scrollerRect = scroller.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();
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
    doScroll(400);
    doScroll(650);
  });

  input.addEventListener("blur", () => {
    if (!isIOS) return;
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

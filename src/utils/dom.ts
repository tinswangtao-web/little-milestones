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

  input.addEventListener("focus", () => {
    if (!scrollOnIOSFocus) return;
    const isIOS = /iphone|ipad|ipod/.test((navigator.userAgent || "").toLowerCase());
    if (!isIOS) return;
    const doScroll = (delay: number) => {
      setTimeout(() => {
        if (input.scrollIntoView) {
          input.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }, delay);
    };
    doScroll(400);
    doScroll(650);
  });
}

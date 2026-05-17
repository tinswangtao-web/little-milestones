interface AttachPressGestureOptions {
  element: HTMLElement;
  longPressMs: number;
  isTouchMode: boolean;
  onLongPress?: () => void;
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
  getDoubleTapThreshold?: () => number;
  shouldIgnoreTarget?: (target: EventTarget | null) => boolean;
}

export function attachPressGesture({
  element,
  longPressMs,
  isTouchMode,
  onLongPress,
  onSingleTap,
  onDoubleTap,
  getDoubleTapThreshold,
  shouldIgnoreTarget,
}: AttachPressGestureOptions): () => void {
  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  let clickTimer: ReturnType<typeof setTimeout> | null = null;
  let isLongPress = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let lastTapAt = 0;

  const ignoreTarget = (target: EventTarget | null) =>
    shouldIgnoreTarget ? shouldIgnoreTarget(target) : false;

  const onPointerDown = (e: PointerEvent) => {
    if (ignoreTarget(e.target)) return;
    isLongPress = false;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    if (!onLongPress) return;
    pressTimer = setTimeout(() => {
      if (!hasMoved) {
        isLongPress = true;
        onLongPress();
      }
    }, longPressMs);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!hasMoved && (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8)) {
      hasMoved = true;
      if (pressTimer) clearTimeout(pressTimer);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (pressTimer) clearTimeout(pressTimer);
    if (ignoreTarget(e.target) || isLongPress || hasMoved) return;

    if (isTouchMode) {
      onSingleTap?.();
      return;
    }

    if (!onDoubleTap) {
      onSingleTap?.();
      return;
    }

    const now = Date.now();
    const threshold = getDoubleTapThreshold ? getDoubleTapThreshold() : 260;
    if (lastTapAt && now - lastTapAt <= threshold) {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      lastTapAt = 0;
      onDoubleTap();
      return;
    }

    lastTapAt = now;
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
    if (onSingleTap) {
      clickTimer = setTimeout(() => {
        onSingleTap();
        clickTimer = null;
        lastTapAt = 0;
      }, threshold + 20);
    }
  };

  const onPointerCancel = () => {
    if (pressTimer) clearTimeout(pressTimer);
    hasMoved = true;
    lastTapAt = 0;
  };

  const onPointerLeave = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", onPointerUp);
  element.addEventListener("pointercancel", onPointerCancel);
  element.addEventListener("pointerleave", onPointerLeave);
  element.addEventListener("contextmenu", onContextMenu);

  return () => {
    if (pressTimer) clearTimeout(pressTimer);
    if (clickTimer) clearTimeout(clickTimer);
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", onPointerUp);
    element.removeEventListener("pointercancel", onPointerCancel);
    element.removeEventListener("pointerleave", onPointerLeave);
    element.removeEventListener("contextmenu", onContextMenu);
  };
}

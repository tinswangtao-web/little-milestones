import { Modal } from "obsidian";
import { KeyboardCleanup, setupModalKeyboard as setupKeyboardLayout } from "./mobile-keyboard";
export type DragCleanup = () => void;
export type { KeyboardCleanup } from "./mobile-keyboard";

export function setupModalKeyboard(modal: Modal): KeyboardCleanup {
  return setupKeyboardLayout(modal);
}

export function attachModalDragGesture(modal: Modal): DragCleanup | null {
  if (!modal) return null;
  const modalEl = modal.modalEl;
  if (!modalEl) return null;

  let startY = 0;
  let startOffset = 0;
  let dragging = false;
  let lastDeltaY = 0;

  const isInteractiveTarget = (target: EventTarget | null) => {
    return !!(
      target &&
      (target as HTMLElement).closest &&
      (target as HTMLElement).closest(
        "input, textarea, select, button, .clickable-icon, .modal-close-button"
      )
    );
  };

  const readOffset = () => parseInt(modalEl.dataset.manualModalOffset || "0", 10) || 0;
  const writeOffset = (next: number) => {
    const clamped = Math.max(-180, Math.min(140, next));
    modalEl.dataset.manualModalOffset = String(clamped);
    modalEl.style.setProperty("--manual-modal-offset", clamped + "px");
  };

  const snapOffset = (current: number, deltaY: number) => {
    const snapPoints = [-144, -72, 0, 72];
    const biased = current + Math.max(-18, Math.min(18, deltaY * 0.18));
    let best = snapPoints[0];
    let bestDist = Math.abs(biased - best);
    for (let i = 1; i < snapPoints.length; i++) {
      const point = snapPoints[i];
      const dist = Math.abs(biased - point);
      if (dist < bestDist) {
        best = point;
        bestDist = dist;
      }
    }
    return best;
  };

  const applyDamping = (delta: number) => {
    const sign = delta < 0 ? -1 : 1;
    const abs = Math.abs(delta);
    if (abs <= 48) return delta * 0.9;
    if (abs <= 120) return sign * (43 + (abs - 48) * 0.55);
    return sign * (82.6 + (abs - 120) * 0.28);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (!e.touches || e.touches.length !== 1) return;
    if (isInteractiveTarget(e.target)) return;
    const touch = e.touches[0];
    startY = touch.clientY;
    startOffset = readOffset();
    lastDeltaY = 0;
    dragging = true;
    modalEl.classList.add("is-dragging-position");
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging || !e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    lastDeltaY = deltaY;
    writeOffset(startOffset + applyDamping(deltaY));
    e.preventDefault();
  };

  const onTouchEnd = () => {
    if (!dragging) return;
    dragging = false;
    modalEl.classList.remove("is-dragging-position");
    modalEl.classList.add("is-settling-position");
    writeOffset(snapOffset(readOffset(), lastDeltaY));
    setTimeout(() => modalEl.classList.remove("is-settling-position"), 220);
  };

  modalEl.addEventListener("touchstart", onTouchStart, { passive: true });
  modalEl.addEventListener("touchmove", onTouchMove, { passive: false });
  modalEl.addEventListener("touchend", onTouchEnd, { passive: true });
  modalEl.addEventListener("touchcancel", onTouchEnd, { passive: true });

  return () => {
    modalEl.removeEventListener("touchstart", onTouchStart);
    modalEl.removeEventListener("touchmove", onTouchMove);
    modalEl.removeEventListener("touchend", onTouchEnd);
    modalEl.removeEventListener("touchcancel", onTouchEnd);
    modalEl.classList.remove("is-dragging-position");
  };
}

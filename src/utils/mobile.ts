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
  let minOffset = Number.NEGATIVE_INFINITY;
  let maxOffset = Number.POSITIVE_INFINITY;

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
    const clamped = Math.max(minOffset, Math.min(maxOffset, next));
    modalEl.dataset.manualModalOffset = String(clamped);
    modalEl.style.setProperty("--manual-modal-offset", clamped + "px");
  };

  const updateBounds = () => {
    const currentOffset = readOffset();
    const rect = modalEl.getBoundingClientRect();
    const viewportTop = window.visualViewport?.offsetTop || 0;
    const viewportBottom = viewportTop + (window.visualViewport?.height || window.innerHeight);
    const baseTop = rect.top - currentOffset;
    const baseBottom = rect.bottom - currentOffset;
    const overshootTop = Math.min(Math.max(rect.height * 0.35, 120), 260);
    minOffset = viewportTop + 8 - baseTop - overshootTop;
    maxOffset = viewportBottom - 8 - baseBottom;
    if (minOffset > maxOffset) {
      const middle = (minOffset + maxOffset) / 2;
      minOffset = middle;
      maxOffset = middle;
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    if (!e.touches || e.touches.length !== 1) return;
    if (isInteractiveTarget(e.target)) return;
    const touch = e.touches[0];
    startY = touch.clientY;
    startOffset = readOffset();
    updateBounds();
    dragging = true;
    modalEl.classList.add("is-dragging-position");
    modalEl.dispatchEvent(new CustomEvent("little-milestones:manual-drag-start"));
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging || !e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    writeOffset(startOffset + deltaY);
    e.preventDefault();
  };

  const onTouchEnd = () => {
    if (!dragging) return;
    dragging = false;
    modalEl.classList.remove("is-dragging-position");
    modalEl.dispatchEvent(new CustomEvent("little-milestones:manual-drag-end"));
  };

  modalEl.addEventListener("touchstart", onTouchStart, { passive: false });
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

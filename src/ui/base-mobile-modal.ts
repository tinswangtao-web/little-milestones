import { Modal, App } from "obsidian";
import type { KeyboardCleanup, DragCleanup } from "../utils/mobile";
import { setupModalKeyboard, attachModalDragGesture } from "../utils/mobile";
import type { MobilePlatform } from "../types";
import type KidScorePlugin from "../main";
import { getMobilePlatform } from "../utils/platform";

export abstract class BaseMobileModal extends Modal {
  plugin: KidScorePlugin;
  protected mobilePlatform: MobilePlatform = "desktop";
  private _kbCleanup: KeyboardCleanup | null = null;
  private _dragCleanup: DragCleanup | null = null;
  protected enableKeyboardAdjustment = true;
  protected enableManualDragAdjustment = false;
  /** Identifies the modal type for keyboard/layout heuristics.
   *  Must be set before super.onOpen() if it affects setupModalKeyboard. */
  readonly modalType: string = "default";

  constructor(app: App, plugin: KidScorePlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen(): void {
    this.mobilePlatform = getMobilePlatform();
    this.modalEl.toggleClass("is-mobile-ios", this.mobilePlatform === "ios");
    this.modalEl.toggleClass(
      "is-mobile-android",
      this.mobilePlatform === "android"
    );
    this.titleEl.addClass("kid-score-modal-title");
    if (this.enableKeyboardAdjustment && this.mobilePlatform !== "desktop") {
      this._kbCleanup = setupModalKeyboard(this);
    }
    if (this.enableManualDragAdjustment && this.mobilePlatform !== "desktop") {
      this._dragCleanup = attachModalDragGesture(this);
    }
  }

  onClose(): void {
    if (this._kbCleanup) {
      this._kbCleanup();
      this._kbCleanup = null;
    }
    if (this._dragCleanup) {
      this._dragCleanup();
      this._dragCleanup = null;
    }
    this.contentEl.empty();
  }

  getLongPressDuration(): number {
    if (this.mobilePlatform === "ios") return 560;
    if (this.mobilePlatform === "android") return 460;
    return 500;
  }

  triggerHaptic(type: "longpress" | "tap"): void {
    if (this.mobilePlatform !== "android") return;
    if (!(navigator as Navigator & { vibrate?: (pattern: number | number[]) => void }).vibrate) return;
    (navigator as Navigator & { vibrate?: (pattern: number | number[]) => void }).vibrate!(type === "longpress" ? 12 : 8);
  }
}

import { Modal, App } from "obsidian";
import type { KeyboardCleanup } from "../utils/mobile";
import { setupModalKeyboard } from "../utils/mobile";
import type { MobilePlatform } from "../types";
import type KidScorePlugin from "../main";

export abstract class BaseMobileModal extends Modal {
  plugin: KidScorePlugin;
  protected mobilePlatform: MobilePlatform = "desktop";
  private _kbCleanup: KeyboardCleanup | null = null;
  protected enableKeyboardAdjustment = true;

  constructor(app: App, plugin: KidScorePlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen(): void {
    this.mobilePlatform = this.detectMobilePlatform();
    this.modalEl.toggleClass("is-mobile-ios", this.mobilePlatform === "ios");
    this.modalEl.toggleClass(
      "is-mobile-android",
      this.mobilePlatform === "android"
    );
    if (this.enableKeyboardAdjustment && this.mobilePlatform !== "desktop") {
      this._kbCleanup = setupModalKeyboard(this);
    }
  }

  onClose(): void {
    if (this._kbCleanup) {
      this._kbCleanup();
      this._kbCleanup = null;
    }
    this.contentEl.empty();
  }

  detectMobilePlatform(): MobilePlatform {
    const ua = (navigator.userAgent || "").toLowerCase();
    if (/android/.test(ua)) return "android";
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    return document.body.classList.contains("is-mobile")
      ? "mobile-other"
      : "desktop";
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

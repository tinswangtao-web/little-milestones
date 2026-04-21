import { App, Notice, PluginSettingTab } from "obsidian";
import KidScorePlugin from "../main";
import { bindModalInputFocus } from "../utils/dom";
import { renderCategorySettings } from "./category-settings";
import { renderContentSettingsSections } from "./content-sections";
import { renderGoalSettingsSection } from "./goal-settings-section";
import { renderImportExportSettings } from "./import-export-settings";
import { renderItemSettings } from "./item-settings";
import { renderUserSettingsSection } from "./user-settings-section";
import { isTouchDevice } from "../utils/platform";

export class KidScoreSettingTab extends PluginSettingTab {
  plugin: KidScorePlugin;
  private touchGuardCleanup: (() => void) | null = null;
  private touchGuardReleaseTimer: number | null = null;

  constructor(app: App, plugin: KidScorePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const self = this;
    const containerEl = this.containerEl;
    containerEl.empty();
    containerEl.addClass("kid-score-settings");
    const bindSettingsInput = (input: HTMLElement | null) => {
      bindModalInputFocus(input, {
        manualTouchFocus: false,
        scrollOnIOSFocus: false,
      });
    };

    containerEl.createEl("h2", { text: "🌟 小朋友每日记录设置" });
    renderUserSettingsSection({
      app: self.plugin.app,
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      refresh: () => self.display(),
    });

    renderGoalSettingsSection({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
    });

    renderContentSettingsSections({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
    });

    renderCategorySettings({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      refreshItems: () => self.display(),
    });
    renderItemSettings({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
    });

    renderImportExportSettings({
      plugin: self.plugin,
      containerEl,
      refresh: () => self.display(),
    });

    this.detachTouchScrollGuard();

    // ── Touch-scroll guard: prevent keyboard pop-up on accidental swipe ──
    // When the user is scrolling the settings page with a finger, temporarily
    // set readonly on all text inputs so a sliding touch does not focus them.
    if (isTouchDevice()) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchMoved = false;
      const releaseReadonlyInputs = () => {
        if (this.touchGuardReleaseTimer !== null) {
          window.clearTimeout(this.touchGuardReleaseTimer);
          this.touchGuardReleaseTimer = null;
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
          Math.abs(touch.clientX - touchStartX) > 8 ||
          Math.abs(touch.clientY - touchStartY) > 8
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
          // Delay removal so the finger lift does not re-trigger focus
          this.touchGuardReleaseTimer = window.setTimeout(
            releaseReadonlyInputs,
            120
          );
        }
      };

      const onTouchCancel = () => {
        touchMoved = false;
        releaseReadonlyInputs();
      };

      containerEl.addEventListener("touchstart", onTouchStart, { passive: true });
      containerEl.addEventListener("touchmove", onTouchMove, { passive: true });
      containerEl.addEventListener("touchend", onTouchEnd, { passive: true });
      containerEl.addEventListener("touchcancel", onTouchCancel, {
        passive: true,
      });

      this.touchGuardCleanup = () => {
        releaseReadonlyInputs();
        containerEl.removeEventListener("touchstart", onTouchStart);
        containerEl.removeEventListener("touchmove", onTouchMove);
        containerEl.removeEventListener("touchend", onTouchEnd);
        containerEl.removeEventListener("touchcancel", onTouchCancel);
      };
    }
  }

  hide(): void {
    this.detachTouchScrollGuard();
    super.hide();
  }

  private detachTouchScrollGuard(): void {
    if (this.touchGuardCleanup) {
      this.touchGuardCleanup();
      this.touchGuardCleanup = null;
    }
    if (this.touchGuardReleaseTimer !== null) {
      window.clearTimeout(this.touchGuardReleaseTimer);
      this.touchGuardReleaseTimer = null;
    }
  }
}

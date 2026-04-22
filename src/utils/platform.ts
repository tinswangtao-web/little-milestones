import type { MobilePlatform } from "../types";

export function getMobilePlatform(): MobilePlatform {
  const ua = (navigator.userAgent || "").toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua) || (navigator.maxTouchPoints > 1 && /macintosh/.test(ua))) {
    return "ios";
  }
  return document.body.classList.contains("is-mobile") ? "mobile-other" : "desktop";
}

export function getPlatformKey(): string {
  const ua = (navigator.userAgent || "").toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/macintosh|mac os x/.test(ua)) return "mac";
  if (/windows/.test(ua)) return "windows";
  return "fallback";
}

export function isIOS(): boolean {
  const ua = (navigator.userAgent || "").toLowerCase();
  return /iphone|ipad|ipod/.test(ua) || (navigator.maxTouchPoints > 1 && /macintosh/.test(ua));
}

export function isAndroid(): boolean {
  return /android/.test((navigator.userAgent || "").toLowerCase());
}

export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

# Review: Codex Refactor (commits 502bd80..d782694)

## Reviewer
- `agent`: kimi-code
- `date`: 2026-04-21 16:00
- `target-task`: 2026-04-20-mobile-ux (refactor work done within this task window)
- `status`: pass-with-notes

## Findings

- `id`: R1
- `severity`: medium
- `summary`: Build artifacts (main.js / styles.css) are stale relative to latest source commits.
- `details`: The latest source commits (502bd80, 7810df3, 7f20e12, d782694) were authored at 15:13–15:34, but main.js and styles.css on disk carry timestamps of 15:29 and may not reflect the final docs commit. Before any vault sync or mobile validation, `npm run build` must be run to ensure src/** changes are baked into main.js and styles/** changes are merged into styles.css.
- `suggested-fix`: Run `npm run build` and verify the output timestamps match the latest commit time. Record the build step in the task log.
- `resolved`: no

- `id`: R2
- `severity`: medium
- `summary`: iOS keyboard avoidance in mobile-keyboard.ts relies on excessive "magic-number" timeouts that are fragile across iOS versions and devices.
- `details`: `setupModalKeyboard` schedules focus/scroll retries at [120, 380, 760] ms for iOS, plus additional delays up to 1150 ms for TEXTAREA. These hard-coded delays assume keyboard animation timing that varies by iOS version (especially iOS 26.4.1 on iPhone 16 Pro). If the keyboard opens slower or faster, the input may still be obscured or the scroll may jump after the user has already started typing. This is the most likely source of the "input experience problems" reported on iPhone.
- `suggested-fix`: Replace the timeout cascade with a `ResizeObserver` or `visualViewport` resize listener that reacts to the actual viewport change, not assumed timing. Keep at most one 60–120 ms debounced fallback for legacy browsers.
- `resolved`: no

- `id`: R3
- `severity`: medium
- `summary`: Settings page scroll restoration (`scrollIntoView`) may target the wrong scrolling container on iOS Obsidian.
- `details`: `item-settings-list.ts:320` calls `newItemEl.scrollIntoView({ block: "center", behavior: "smooth" })`. In Obsidian mobile, the settings tab is often nested inside `.vertical-tab-content` or another intermediate scroll wrapper, not `itemsWrap` itself. If `scrollIntoView` calculates against the wrong viewport, the page may jump to the tab header or a random position instead of the newly added item.
- `suggested-fix`: Verify the effective scroll container on iPhone. If it is a parent node, compute the desired scroll offset manually (`desiredTop = newItemEl.offsetTop - container.clientHeight/2 + newItemEl.clientHeight/2`) and call `container.scrollTo()` instead of `scrollIntoView`.
- `resolved`: no

- `id`: R4
- `severity`: low
- `summary`: Platform detection logic is duplicated across four files.
- `details`: `detectMobilePlatform` / `detectPlatformKey` logic appears in `src/main.ts`, `src/ui/base-mobile-modal.ts`, `src/utils/mobile-keyboard.ts`, and `src/utils/dom.ts`. This makes it easy for an agent to update one copy and forget the others, leading to inconsistent platform behavior.
- `suggested-fix`: Centralize platform detection into a single utility (e.g., `src/utils/platform.ts`) that exports `getMobilePlatform()`, `isIOS()`, `isAndroid()`, and `isTouchDevice()`. Import these everywhere else.
- `resolved`: no

- `id`: R5
- `severity`: low
- `summary`: Settings page lacks an explicit overflow-x guard, risking horizontal swipe on iPhone.
- `details`: The mobile-ux task originally introduced `.kid-score-settings-root` with `overflow-x: hidden` to prevent accidental horizontal scrolling. After the refactor, `settings-tab.ts` adds class `kid-score-settings` to `containerEl`, but `styles/07-mobile.css` and the base styles do not appear to set `overflow-x: hidden` on that class. On a narrow iPhone screen, wide grid rows or long input text can still trigger horizontal panning.
- `suggested-fix`: Add `.kid-score-settings { overflow-x: hidden; }` to `styles/06-settings.css` (or `07-mobile.css` under the mobile media query), and ensure all direct children have `min-width: 0` or `flex-wrap: wrap`.
- `resolved`: no

- `id`: R6
- `severity`: low
- `summary`: Touch-scroll-to-focus guard from the original mobile-UX patch may have been lost in the settings refactor.
- `details`: The original mobile-UX fix bound `touchstart/move/end` on the settings root to set `readonly` on inputs during a swipe, preventing keyboard pop-up on accidental scroll touches. The refactor moved settings rendering into `renderContentSettingsSections` and other helpers. It is unclear whether the readonly guard was preserved; `settings-tab.ts:display()` and `item-settings-list.ts` do not show this logic.
- `suggested-fix`: If the guard is indeed missing, re-introduce it in `settings-tab.ts` or `content-sections.ts` for the mobile breakpoint only. If it was intentionally removed, document the reason.
- `resolved`: unknown — needs code-level verification

- `id`: R7
- `severity`: low
- `summary`: File architecture is strong for multi-agent work but could benefit from a MODULE_MAP.
- `details`: The src/ tree is well split (panels, helpers, popups, settings, utils, etc.). However, a new agent still needs to grep around to learn which file owns which feature. A short `MODULE_MAP.md` (or comments in a top-level index) would reduce onboarding time.
- `suggested-fix`: Add a brief MODULE_MAP comment block at the top of `src/main.ts` or a standalone `src/README.md` listing the primary files and their responsibilities.
- `resolved`: no

## Conclusion
- The refactor is structurally sound and significantly improves maintainability.
- No blocking code issues found.
- The iPhone input/scroll problems reported by the user are most likely rooted in R2 (fragile keyboard timeouts) and R3 (settings scroll target), with possible contributions from R5/R6 (horizontal swipe and missing readonly guard).
- Recommended next step: address R1 (rebuild artifacts), then focus R2+R3 for the iPhone validation round.

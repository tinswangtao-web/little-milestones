## Write Lock
- `owner`: none
- `since`: 2026-04-24 15:05
- `scope`: none
- `reason`: Fixed daily modal iOS scroll lock; lock released
- `expires-at`: 2026-04-24 17:00
- `notes`: Root cause was `isDailyModal` evaluated too early (before renderModal added the class). Fixed by introducing `modalType` on BaseMobileModal. Vault synced.

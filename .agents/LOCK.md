## Write Lock
- `owner`: code-ai
- `since`: 2026-05-18T20:10:00+08:00
- `scope`: src/storage/day-data-store.ts, .agents/**
- `reason`: Fix vault enumeration by replacing app.vault.getFiles() with a scoped folder traversal.
- `expires-at`: 2026-05-18T20:40:00+08:00
- `notes`: Scoping getFiles() search to user save directory to resolve Obsidian audit recommendation.

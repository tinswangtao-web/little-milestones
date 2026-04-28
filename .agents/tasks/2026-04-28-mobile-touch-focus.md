# 移动端输入框触摸聚焦修复

- **slug**: 2026-04-28-mobile-touch-focus
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: done
- **write-scope**: `src/utils/dom.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `main.js`, `.agents/**`
- **origin**: from `2026-04-28-working-tree-organization-v2`

## 用户需求 / 风险

- 移动端滚动防误触逻辑不能导致输入框轻点后无法正常弹键盘。

## 实现

- `bindTouchScrollGuard()` 只释放本次 scroll guard 锁住的 readonly 输入框，避免误删其它 readonly 用途。
- 记录 touch 起点附近的目标输入框；轻触结束时主动恢复目标输入框 focus。
- `main.js` 已由构建同步对应产物。

## 验收

- [x] 用户确认设置页/打分页输入框轻点体验可以接受。
- [x] `npm run build` 已通过。
- [x] `npm run deploy` 已通过并输出 `main.js` / `styles.css` / `manifest.json` 三个 `MATCH`。

## 记录

- 2026-04-28 19:18 CST：用户确认当前移动端体验可以；任务记录补齐为 completed。

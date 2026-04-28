# 整理当前未提交改动

- **slug**: 2026-04-28-organize-working-tree
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: n/a
- **write-scope**: `.agents/**`
- **read-scope**: `src/**`, `styles/**`, `main.js`, `styles.css`, `.agents/**`

## 用户需求

- 整理当前未提交改动，明确哪些改动属于哪个任务，避免混在一起提交。

## 整理结果

### A. 已验收功能：保存后自动打开得分页

- `src/modals/daily-scoring-modal.ts`
- `main.js` 中对应的 `DailyScoringModal` 构建产物片段
- `.agents/tasks/2026-04-28-open-md-after-save.md`
- `.agents/STATE.md` / `.agents/LOCK.md` / `.agents/log.md` 中相关记录

状态：用户已验证“保存后跳转到得分页”；无确认弹窗，用户接受。已提交为 `e6b3761`。

建议提交名：`[codex] open generated result after saving`

### B. 待单独确认：移动端输入框触摸聚焦修复

- `src/utils/dom.ts`
- `main.js` 中对应的 `bindTouchScrollGuard` 构建产物片段

内容：只释放本次 scroll guard 锁住的 readonly 输入框；轻触输入框时主动聚焦，降低 iOS 上轻微滑动导致输入框点不开的概率。

建议：作为单独小修提交，提交前最好在 iPhone 上点一下设置页/打分页输入框。

建议提交名：`[codex] improve mobile touch input focus guard`

### C. 待验收/待核对：移动端按钮与 emoji 表单尺寸

- `styles/07-mobile.css`
- `styles.css` 中对应生成片段
- `.agents/tasks/2026-04-28-mobile-emoji-sheet.md`

内容：
- `打分页` 底部统计按钮不再强制第二行，回到同一行。
- 移动端自定义表单 emoji 输入和选择按钮从约 46px 放大到 56px。

注意：任务卡中写了 `src/ui/emoji-picker.ts` 的拖动 sheet 改动，但当前工作区没有这个源文件 diff；提交前需要核对任务卡描述，避免记录和实际代码不一致。

建议提交名：`[codex] refine mobile score actions and emoji controls`

### D. 已提交后残留的样式噪音：桌面日记布局/换行符

- `styles/04-diary.css`
- `styles.css` 中对应生成片段

内容：实际语义差异只有：
- `.diary-desktop-top` 从两列改为单列
- `.diary-module-grid` 从 auto-fit 多列改为单列

注意：这部分功能已在 `f4818a8` / `cfeadf9` 附近提交过；当前 diff 大量来自 `styles/04-diary.css` 的 CRLF/混合换行变化。提交前应避免把换行符噪音再次混进新提交。

## 后续整理

- 2026-04-28 19:05 CST：本卡已被新版整理卡取代，见 `.agents/tasks/2026-04-28-working-tree-organization-v2.md`。新版整理纳入了协议硬化、deploy guard、CSS EOL 清理后的最新 working tree 状态。

## 建议处理顺序

1. A 已提交为 `e6b3761`。
2. 再决定 B 是否保留；如果保留，单独验证并提交。
3. 再核对 C 的任务卡和实际 diff 是否一致，必要时修正任务卡。
4. 最后处理 D：如果只是已提交任务残留，优先清掉换行符噪音或单独确认是否还需要二次提交。

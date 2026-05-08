# CODEX_TO_CURSOR_REVIEW_CARD

## Current round goal

根据用户手机端复测反馈做二次修正：打分页新增/删除后避免明显弹跳；评语模块改到自由记录下方与保存按钮上方；统计页返回按钮与历史累计总分卡片拉开间距；保留已验证通过的底部半屏上滑能力。

## Changed file list

- src/modals/daily-scoring-modal.ts
- src/modals/popups/add-item-modal.ts
- src/modals/helpers/daily-modal-actions.ts
- src/modals/panels/diary-panel.ts
- src/modals/stats-modal.ts
- styles/07-mobile.css
- styles.css
- main.js
- .agents/tasks/2026-05-08-mobile-daily-diary-fixes.md
- .agents/STATE.md
- .agents/LOCK.md
- .agents/log.md

本轮 review 仅限“改动文件清单”列出的文件；其他 dirty 文件为历史/行尾噪音，不计入本轮结论。

## User-visible behavior changes

- 打分页新增/删除打分项后，列表保持在弹窗前的大致浏览位置，不再执行明显平滑跳转。
- 评语模块移动到自由记录下方（仍在保存按钮上方），输入继续走现有 diaryModules 草稿自动保存。
- 统计页“返回上一页”按钮与历史累计总分卡片之间增加垂直间距，不再叠在一起。
- 已解决的“底部可上滑半屏”保留，不回退。

## Verification already run

- npx tsc --noEmit: pass
- npm run build: pass, regenerated main.js/styles.css
- node --check main.js: pass
- git diff --check on intended files: pass

## Known risks / open confirmations

- 真实移动端键盘高度、惯性滚动和 Obsidian WebView 行为仍需用户在 Vault 中手测确认。
- 新增/删除后采用“恢复滚动位置”策略，不再保证自动定位到新卡片；以用户当前偏好为准。
- src/constants.ts 仍因历史 CRLF/mixed line-ending 状态显示 dirty，本轮未纳入改动文件清单。

## Strict Cursor review requested

Yes. This touches modal navigation, mobile keyboard avoidance, diary compose/parse, generated main.js/styles.css, and more than 3 files.

## Suggested user acceptance steps

1. 在打分页滚动到中部，新增一个打分项后关闭弹窗，确认页面保持原浏览位置、无明显弹跳。
2. 在任意项目上进入分值弹窗并删除该项，确认返回后列表仍保持原浏览位置。
3. 日记页确认“评语”位于自由记录下方且在保存按钮上方；输入后切统计再返回，草稿仍在。
4. 统计页点击“返回上一页”，确认按钮与历史累计总分卡片间距正常，不再视觉重叠。

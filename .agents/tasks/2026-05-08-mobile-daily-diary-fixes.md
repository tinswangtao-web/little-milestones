# 移动端打分页/日记页 4 项修复

- **slug**: 2026-05-08-mobile-daily-diary-fixes
- **created**: 2026-05-08
- **owner**: codex
- **status**: implemented-awaiting-user-test
- **origin**: 用户任务单：移动端打分页/日记页 4 个问题，保持草稿自动保存稳定
- **sync-to-vault**: done
- **write-scope**: `src/modals/daily-scoring-modal.ts`, `src/modals/popups/add-item-modal.ts`, `src/constants.ts`, `src/diary/modules.ts`, `src/modals/panels/diary-panel-fields.ts`, `src/utils/mobile-keyboard.ts`, `styles/07-mobile.css`, `styles.css`, `src/modals/stats-modal.ts`, `src/main.ts`, `main.js`, `.agents/**`
- **read-scope**: `src/**`, `styles/**`, `main.js`, `.agents/**`

## 目标

修复移动端打分页/日记页 4 个问题，且保持现有草稿自动保存逻辑稳定。

## 必须完成

- [x] 打分页新增打分项后不要跳顶，应自动定位到刚新增的打分项位置。
- [x] 日记页在“我还想说...”后面新增“评语”多行输入模块，并纳入草稿自动保存。
- [x] 日记页底部按钮以下保留约半屏上滑空间，用于移动端键盘避让。
- [x] 统计页增加“返回上一个页面”按钮，从打分页/日记页进入统计后可恢复原状态。

## 验证

- [x] 新增打分项后视图停留在新项位置（代码路径：新增 item id 回传，重渲染后滚动到对应卡片；待 Obsidian 手测）。
- [x] 评语模块输入后，切统计/关闭再进同日仍在；保存后写入正确（代码路径：复用 diaryModules 草稿 map 与 compose/parse；待 Obsidian 手测）。
- [x] 键盘弹出时，底部仍可上滑额外空间约半屏（代码路径：移动端 diary tab spacer + keyboard extraBottom；待真机键盘手测）。
- [x] 统计页能返回并恢复原状态（代码路径：StatsModal onBack 重开 DailyScoringModal 并恢复日期/页签，草稿由既有 map 恢复；待 Obsidian 手测）。
- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `node --check main.js`

## 风险与回滚

- 风险：统计页返回涉及 modal 切换状态恢复，需避免保存成功后的草稿清理语义回退。
- 风险：移动端底部空间若过大可能影响滚动手感；限定在移动端 CSS。
- 回滚：撤回本任务涉及的新增定位/评语模块/移动端底部空间/统计返回入口改动。

## 实现记录

- 2026-05-08 12:35 +0800：Codex 完成 4 项实现；未新增持久化路径，继续复用日记草稿 map。`src/constants.ts` 仍显示历史行尾 dirty，但本轮不将其纳入改动文件清单。
- 新增打分项由 `AddItemModal` 回传新 item id，`DailyScoringModal` 重渲染后滚动到对应 `.kid-score-card[data-item-id]`。
- 评语模块在日记面板打开时补齐到 `wantToSay` 后方，值进入 `diaryModules.comment`，由既有草稿保存和 compose/parse 路径处理。
- 移动端日记 tab 增加底部半屏 spacer，键盘打开时 daily modal 使用更大的 `extraBottom`。
- 统计页支持可选返回按钮，从打分页进入时保存草稿、关闭 daily、打开 stats；点击返回后按原日期/页签重开 daily。

## 未覆盖

- 尚未在 Obsidian 真机/移动端键盘中手测滚动位置与键盘避让手感。
- 已同步到 Vault；等待用户 Obsidian/移动端验证。

## Vault sync

- 2026-05-08 12:45 +0800：用户确认 review 完成并要求同步到 Vault；Codex 执行 `npm run deploy`，build 成功并同步 `main.js`、`styles.css`、`manifest.json`。同步后校验 `MATCH main.js 1eba1fcd6119`、`MATCH styles.css e808c1e887dc`、`MATCH manifest.json e82c7257a300`。未 commit。

- 2026-05-08 20:20 +0800：根据用户手机端复测反馈执行二次修正：
  - 打分页新增/删除后不再平滑滚动到新卡片，改为恢复弹窗前原滚动位置，减少“弹跳感”。
  - 评语模块展示位置调整为“自由记录”下方、“保存记录按钮”上方，保持原草稿自动保存链路。
  - 统计页“返回上一页”按钮与历史累计总分卡片增加间距，避免视觉重叠。
  - “底部可上滑半屏”保留现状，不回退。
  - 本轮已执行 `npx tsc --noEmit`、`npm run build`、`node --check main.js` 均通过；待用户再次真机验证。

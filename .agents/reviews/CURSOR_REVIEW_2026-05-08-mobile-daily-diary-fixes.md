# Cursor Review：2026-05-08-mobile-daily-diary-fixes

## Review 结论

- 结论：**待真机验证后可发布**（代码层面未见阻塞性缺陷）
- 风险等级：**中**（涉及 modal 导航、键盘布局、用户设置侧写；需 Obsidian 移动端手测确认）
- 是否阻塞提交：**否**（以 Vault 手测通过为前提）

**No blocking issues**（P0 代码逻辑层面）。

## 1) Blocking Issues（P0）

- 无。`tsc` / `node --check main.js` 本地已通过（Cursor 复跑）。

## 2) High Priority（P1）

- [P1-1] **工作区含大量非本任务 diff**
  - 风险：若误 `git add -A` 会把 `src/data/emoji-data.ts`、`MEMORY.md`、多份 CSS 大段变更等一并提交，评审结论失真。
  - 建议：提交时仅 stage Codex 交接卡与任务卡列出的文件；其余单独处理或恢复。
  - 可延期到下轮：否（发布前必须弄清）

- [P1-2] **`makeDefaultDiaryModules()` 未包含 `comment`**
  - 风险：新建用户默认 `diaryModules` 与运行期「补齐评语」依赖 `diary-panel` 首次打开时的 splice + `saveSettings()`；行为正确但配置来源一度不一致，依赖该迁移路径。
  - 建议（可选）：下轮将 `comment` 纳入 `src/constants.ts` 的 `makeDefaultDiaryModules()`，与运行态一致，减少“仅首次打开才写入设置”的隐式行为。
  - 可延期到下轮：是

## 3) Nice-to-have（P2）

- [P2-1] `getFocusScrollExtraBottom` 在 **daily modal 下对任意聚焦控件** 使用约 `0.45 * innerHeight` 的额外底部边距，可能在聚焦页面上方输入时产生偏大滚动位移；若手测“跳动感”明显，可再细分为仅日记区/多行输入才用大边距。

- [P2-2] 若用户配置中缺少 `wantToSay`，评语模块会插在索引 `0`（非“紧跟我还想说”）。属极端配置场景，可文档化或忽略。

## 4) 变更核对

- 本轮目标是否达成：**是**（对照交接卡四条均有对应实现）
- 是否出现新回归：**未见**（静态审查）
- 是否影响历史数据：**否**（评语走既有 compose/parse；旧文件无该字段则空）
- 是否需要迁移/清理：**否**（首次打开日记面板时向用户设置补齐 `comment` 模块）

## 5) 验证记录

- Build：未在 Cursor 内跑 `npm run build`（交接称已通过）；`npx tsc --noEmit`：**通过**；`node --check main.js`：**通过**
- 手工验证场景：需用户在 **Obsidian 移动端** 完成（键盘/滚动无法在此可靠模拟）

## 6) 给用户的下一步

1. 在 Vault 中只同步/覆盖本任务相关构建产物后，用真机测交接卡中 4 条验收。
2. 若通过，再授权 Codex **仅 stage 任务相关文件** 后提交；勿全仓 add。

**看到以下结果即通过：**

- 新增打分项后停在新卡片附近、不跳顶
- 评语有草稿、统计往返后仍在
- 日记 tab 下键盘弹出时底部可继续上滑约半屏
- 统计「返回上一页」后日期与页签、草稿恢复

## 7) 提交建议

- 建议现在提交：**仅在手测通过后**
- 建议先同步 Vault 再测：**是**（与交接卡一致）
- 建议 commit 范围：严格限制在 `.agents/reviews/CODEX_TO_CURSOR_REVIEW_CARD.md` 所列实现文件 + 本 review 说明，避免夹带无关大 diff

## 快速版

- 结论：代码审查 **无阻塞问题**；发布依赖真机验证
- 阻塞问题数（P0）：**0**
- 本轮可发：**手测通过后是**
- 用户下一步：**按交接卡 4 条在 Obsidian 手机端验收**

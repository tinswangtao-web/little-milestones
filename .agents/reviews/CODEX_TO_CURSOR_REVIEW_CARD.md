# Codex -> Cursor Review Card

Cursor 请只 review，不要改代码。请直接读取当前 working-tree diff 和本卡内容进行严格 review。当前没有 commit，也没有 Vault sync。

## 1) 本轮目标（用户原话）

新任务：修复“得分页修改日记后，打分页回填不一致/placeholder 变成输入内容”的联动问题。

用户期望：
1. 在得分页手动删除或修改日记内容后，重新打开同一天打分页，日记模块应反映最新文件状态。
2. 当用户在得分页把相关内容删空时，打分页应显示提示文字（placeholder），而不是把提示文字当作已输入内容。
3. 两个页面联动要一致：得分页是事实来源之一，打分页回填不能使用陈旧或伪造值。

补修任务：
- 历史记录中若模块值是“系统默认示例文案”（模板占位文本），应在回填时视为空值。
- 空值应走 placeholder 展示，不写回内容。
- 不影响用户真实输入（例如包含“今天我做了”但不是默认模板的实际句子）。

## 2) 改动文件清单

- `src/modals/helpers/daily-modal-state.ts`
- `src/diary/modules.ts`
- `src/modals/daily-scoring-modal.ts`
- `src/modals/panels/diary-panel.ts`
- `src/modals/panels/diary-panel-fields.ts`
- `main.js`（`npm run build` 生成）
- `.agents/STATE.md`
- `.agents/LOCK.md`
- `.agents/log.md`
- `.agents/tasks/2026-04-29-diary-empty-roundtrip.md`
- `.agents/reviews/CODEX_TO_CURSOR_REVIEW_CARD.md`

## 3) 关键行为变化（用户可见）

- 打分页打开当天记录时仍使用 `readDayData(date, { preferFreshRead: true })`，确保读取得分页手动编辑后的最新文件内容。
- `loadDailyModalState()` 新增 `hasExistingRecord`，并基于当天 Markdown 文件是否存在判断，而不是基于 frontmatter 是否成功解析。
- 因此即使用户手动改坏 frontmatter，只要当天文件存在，也不会被当成“新记录”注入默认示例。
- 打分页渲染日记面板时传入 `allowDefaultDiaryTemplate: !hasExistingRecord`。
- `ensureDefaultDiaryTemplate()` 现在只有在允许注入且所有模块/自由记录都空时，才把默认示例写进输入框。
- `parseDiaryModules()` 会把精确匹配的内置默认示例值归一为空：
  - `今天我做了____。`
  - `今天我学会了____。`
  - `今天最开心的是____。`
  - `我还想说____。`
- 归一逻辑只匹配内置多行模块的精确示例文本；真实用户句子不会因为包含“今天我做了”等前缀而被清空。
- 空值语义：
  - 已有文件中日记内容缺失/被删空 => 模块值为空字符串/空对象，输入框显示 placeholder，不写入示例文案。
  - 只有真正无当天文件的新建记录，才保留原来的默认示例注入行为。

## 4) 已执行验证（build/typecheck/手测）

- `npm run build`：通过。
- `npx tsc --noEmit`：通过。
- `node --check main.js`：通过。
- 手测：未在 Obsidian 内完成，等待用户验收。

## 5) 已知风险与待确认点

- 本轮改了打分页状态加载和日记面板注入条件，属于严格 review。
- `parseDiaryModules()` 只新增默认示例归一为空，不改变 `composeDiaryContent()` 输出格式。
- 没有扩大全局 fresh read；打分页当天读取入口已经显式 fresh，避免不必要性能回退。
- 已处理 Cursor P2：文件存在性与内容可解析性分离，坏 frontmatter 不再触发默认示例注入。
- 本轮未同步 Vault；用户未授权同步。

## 6) 是否请求 Cursor 严格review

是。

原因：
- 涉及打分页状态加载和日记回填链路。
- 用户明确要求修复页面联动一致性，需确认不会回归首建记录体验。

## 7) 建议用户验收步骤（2-4步）

1. 在得分页把“今日日记”内容删空，重新打开同一天打分页，确认日记模块为空并显示 placeholder。
2. 打开含有 `今天我做了____。` 等历史示例文案的旧日期，确认输入框为空并显示 placeholder。
3. 打开含有真实文本的旧日期，确认内容仍正常回填。
4. 打开一个从未保存过的新日期，确认原来的首建默认示例仍可出现。

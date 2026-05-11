# IMPLEMENTATION_REVIEW_HANDOFF（代码 AI → Review AI 交接卡）

## Current round goal

- 用户原话目标：增加 `export markdown` 命令，把 CSV 生成为 Markdown 报告；不引入新依赖。

## Architecture / approach summary（可选）

- 复用现有 CSV 解析逻辑，只新增 Markdown 拼装函数，避免把命令行解析、文件 IO、文本渲染耦合在一起。

## Changed file list

- `src/cli.ts`
- `src/exporter.ts`
- `tests/exporter.test.ts`

## User-visible behavior changes

- CLI 新增 `export markdown` 子命令
- 用户可指定输入 CSV 与输出 Markdown 路径
- 空值字段在最终 Markdown 中显示为空，而不是 `undefined`

## Verification already run

- `pnpm typecheck`
- `pnpm test`
- 手工跑一次 `export markdown --input ./fixtures/demo.csv --output ./tmp/report.md`

## Known risks / open points

- 复杂 CSV（嵌套引号、多行单元格）仍依赖现有解析器能力
- 当前 Markdown 模板固定，后续若要支持主题化需另开任务

## Strict Review AI review requested

- `否`

## Suggested user acceptance steps

1. 准备一个 3 到 5 行的示例 CSV
2. 运行 `export markdown` 生成报告
3. 检查标题、摘要、表格和空值显示是否符合预期

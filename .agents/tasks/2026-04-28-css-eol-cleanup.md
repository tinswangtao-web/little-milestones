# CSS 行尾清理

- **slug**: 2026-04-28-css-eol-cleanup
- **owner**: codex
- **created**: 2026-04-28
- **status**: completed
- **sync-to-vault**: n/a
- **write-scope**: `esbuild.config.mjs`, `styles/04-diary.css`, `styles.css`, `.agents/**`
- **read-scope**: `styles/**`, `styles.css`, `esbuild.config.mjs`, `.agents/**`
- **origin**: from `2026-04-28-protocol-hardening`

## 用户需求

- 清理当前 CSS CRLF/LF 假 diff，避免样式 review 被行尾噪音淹没。

## 范围

- 只处理当前已经产生噪音的 `styles/04-diary.css` 和生成文件 `styles.css`。
- 更新构建脚本，让后续生成的 `styles.css` 统一 LF。
- 不批量规范化未改动的其它 CSS 模块，避免无意义大 diff。

## 验收

- [x] `styles/04-diary.css` 工作区行尾为 LF。
- [x] `styles.css` 工作区行尾为 LF。
- [x] `npm run build` 后 `styles.css` 仍保持 LF。
- [x] `git diff --ignore-space-at-eol` 只显示真实样式变化。
- [x] 本轮不创建 git commit，除非用户明确要求提交。

## 记录

- 2026-04-28 18:56 CST：`styles/04-diary.css` 和 `styles.css` 已规范化为 LF；`esbuild.config.mjs` 的 `buildStyles()` 现在在合并 CSS 时统一输出 LF。
- 2026-04-28 18:58 CST：`npm run build` 通过；`git ls-files --eol` 显示 `styles/04-diary.css` / `styles.css` 工作区为 `w/lf`；`git diff --ignore-space-at-eol` 仅剩真实样式变化。

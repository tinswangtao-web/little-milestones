# Little Milestones 插件开发记录

## 项目信息
- **插件仓库**：https://github.com/tinswangtao-web/obsidian-little-milestones
- **插件目录（Obsidian）**：`C:\Users\Doody\Documents\Obsidian Vault\.obsidian\plugins\little-milestones\`
- **开发工作目录（git 仓库）**：`C:\Users\Doody\Documents\Claude\Little-Milestones\`
- **当前版本**：v2.0.0

## 工作流说明
- 在开发工作目录修改代码，再复制到插件目录供 Obsidian 使用
- Obsidian Sync 负责同步插件目录到其他设备（不含 .git）
- git / GitHub 负责版本管理和 Obsidian 插件市场发布

## 本次会话完成的功能

### 1. 打分规则区块（Score Panel 顶部）
- 位置：`main.js` → `DailyScoringModal.renderModal()` → Score Panel 开头
- 折叠/展开，有规则时默认展开
- 支持 Markdown 渲染预览
- 点击 ✏️ 进入编辑模式，支持保存到 `settings.scoringRules`
- 相关 CSS class：`.kid-score-rules-*`

### 2. 打分项长按编辑功能
- 位置：`main.js` → `DailyScoringModal.showCustomValuePopup()`
- 长按打分卡片弹出 popup，底部新增"✏️ 编辑此项目"按钮
- 点击后切换到编辑模式，可修改：图标、名称、默认分值、备注、分类
- 保存后立即刷新打分页
- 新增 CSS class：`.value-popup-edit-btn`、`.custom-form-select`

### 3. 新增字段
- `DEFAULT_SETTINGS.scoringRules: ""` — 打分规则文本

## Obsidian 插件市场 PR 状态

- **PR 链接**：https://github.com/obsidianmd/obsidian-releases/pull/11594
- **状态**：Open，待人工审核
- **已解决**：添加了 MIT License 文件
- **待完成**：需要登录 GitHub，更新 PR #11594 的描述内容

### PR 描述需要更新为以下内容（请登录后手动编辑）：

PR 页面右上角点击铅笔图标（Edit），替换描述为：

```markdown
## Plugin info

**Plugin ID:** little-milestones  
**Plugin name:** Little Milestones 🌱  
**Repository:** https://github.com/tinswangtao-web/obsidian-little-milestones  

## Description

A daily record plugin for kids — behavior scoring, diary, diet & activity tracking, with structured data ready for AI analysis.

Track your child's daily habits with customizable scoring items grouped by category (exercise, life skills, school, etc.). Features include:
- One-tap scoring with long-press for custom values or item editing
- Scoring rules panel with Markdown support
- Daily diary with template, quick weather/mood tags, and Markdown preview
- Cumulative score tracking and statistics
- Data exported as structured Markdown with YAML front matter for AI analysis

## Checklist

- [x] My plugin has a README in English
- [x] My plugin has a LICENSE file (MIT)
- [x] `manifest.json` contains valid fields
- [x] The plugin works on both desktop and mobile
- [x] I have tested the plugin and it works as expected
```

## Git 提交记录
- `768e2f6` chore: move repo outside vault, sync v2.0.0
- `aed8a0e` feat: add MIT license and update plugin to v2.0.0

# Localhost checkout browser validation

- **slug**: 2026-05-03-localhost-checkout-test
- **created**: 2026-05-03
- **owner**: codex
- **status**: blocked-awaiting-localhost-url
- **origin**: user request: "Test my checkout flow on localhost"
- **sync-to-vault**: n/a
- **write-scope**: `.agents/**`
- **read-scope**: local browser, local listening ports, repository metadata

## 用户需求

用浏览器插件测试 localhost 上的 checkout flow。

## 验证记录

- 2026-05-03 09:23 +0800：Codex 使用 Browser Use in-app browser 初始化本地浏览器测试会话。
- 检查当前浏览器标签：没有已打开的 localhost checkout 页面。
- 检查本机监听端口：未发现常见前端端口 `3000`、`5173`、`8080`、`8000` 在监听。
- 浏览器探测：
  - `http://localhost:3000`：connection refused。
  - `http://localhost:5173`：connection refused。
  - `http://localhost:8080`：connection refused。
  - `http://localhost:8000`：connection refused。
  - `http://localhost:5000`：可连接但页面为空黑屏，DOM snapshot 为空；监听进程显示为 `ControlCenter`，不像 checkout app。
  - `http://localhost:7000`：可连接但页面为空黑屏，DOM snapshot 为空；监听进程显示为 `ControlCenter`，不像 checkout app。
- 当前仓库是 Obsidian Little Milestones 插件，未发现 checkout/cart/payment 路由或 app 启动入口。

## 当前阻塞

需要用户提供实际 checkout app 的 localhost URL（含端口）或启动命令/正确工作区路径。

## 安全边界

- 不会提交真实订单、真实支付或保存支付信息。
- 若 checkout 最后一步会下单/付款，即使在 localhost，也会在动作前向用户确认。

## 验收

- [ ] 用户提供正确 URL/端口后，Codex 能打开 checkout 页面。
- [ ] Codex 走完商品/购物车/地址/配送/支付前置步骤。
- [ ] Codex 在最终提交订单/支付前停下或获得明确确认。

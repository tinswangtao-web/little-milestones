import { App } from "obsidian";
import { BaseMobileModal } from "../ui/base-mobile-modal";
import KidScorePlugin from "../main";
import { DayData } from "../types";

export class StatsModal extends BaseMobileModal {
  plugin: KidScorePlugin;

  constructor(app: App, plugin: KidScorePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async onOpen() {
    super.onOpen();
    const contentEl = this.contentEl;
    contentEl.empty();
    contentEl.addClass("kid-score-modal", "kid-score-stats-modal");

    contentEl.createEl("h2", { text: "📊 " + this.plugin.currentUser.name + " 的打分统计" });
    const allScores = await this.plugin.getAllScores();
    if (allScores.length === 0) {
      contentEl.createEl("p", { text: "📭 暂无数据", cls: "kid-score-empty" });
      return;
    }

    const grandTotal = allScores.reduce((s, r) => s + r.total, 0);
    const grandDays = allScores.length;
    const grandAvg = Math.round(grandTotal / grandDays);
    const gtSign = grandTotal >= 0 ? "+" : "";
    const gaSign = grandAvg >= 0 ? "+" : "";

    const grandBanner = contentEl.createDiv({ cls: "kid-score-grand-banner" });
    const gl = grandBanner.createDiv({ cls: "grand-left" });
    gl.createDiv({ cls: "grand-total-value", text: gtSign + grandTotal });
    gl.createDiv({ cls: "grand-total-label", text: "历史累计总分" });
    const gr = grandBanner.createDiv({ cls: "grand-right" });
    gr.createDiv({ text: "📅 记录 " + grandDays + " 天", cls: "grand-stat" });
    gr.createDiv({ text: "📈 日均 " + gaSign + grandAvg + " 分", cls: "grand-stat" });
    gr.createDiv({ text: "🗓️ 起始 " + allScores[0].date, cls: "grand-stat" });

    const tabs = contentEl.createDiv({ cls: "kid-score-tabs" });
    const statsBody = contentEl.createDiv({ cls: "kid-score-stats-body" });
    const periods = [
      { label: "本周", key: "week" },
      { label: "本月", key: "month" },
      { label: "全部", key: "all" },
    ];
    let activePeriod = "week";
    const self = this;

    const filterScores = (period: string, scores: DayData[]) => {
      const today = new Date();
      if (period === "week") {
        const ws = new Date(today);
        ws.setDate(today.getDate() - today.getDay() + 1);
        return scores.filter((s) => s.date >= ws.toISOString().slice(0, 10));
      } else if (period === "month") {
        const ms =
          today.getFullYear() +
          "-" +
          String(today.getMonth() + 1).padStart(2, "0") +
          "-01";
        return scores.filter((s) => s.date >= ms);
      }
      return scores;
    };

    const drawBarChart = (canvas: HTMLCanvasElement, data: DayData[]) => {
      const ctx = canvas.getContext("2d");
      if (!ctx || !data.length) return;
      const W = canvas.width,
        H = canvas.height;
      const pad = { top: 24, bottom: 32, left: 8, right: 8 };
      const chartH = H - pad.top - pad.bottom;
      const midY = pad.top + chartH * 0.6;
      const maxAbs = Math.max(...data.map((s) => Math.abs(s.total)).concat([1]));
      const barW = Math.max(Math.floor((W - pad.left - pad.right) / data.length) - 4, 6);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.left, midY);
      ctx.lineTo(W - pad.right, midY);
      ctx.stroke();
      ctx.setLineDash([]);
      data.forEach((score, i) => {
        const x = pad.left + i * (barW + 4);
        const pixPer = (chartH * 0.55) / maxAbs;
        const barH = Math.abs(score.total) * pixPer;
        const isPos = score.total >= 0;
        ctx.fillStyle = isPos ? "#4ade80" : "#f87171";
        ctx.fillRect(x, isPos ? midY - barH : midY, barW, barH);
        ctx.fillStyle = "#333";
        ctx.font = "bold " + Math.min(11, barW) + "px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(String(score.total), x + barW / 2, isPos ? midY - barH - 4 : midY + barH + 12);
        ctx.font = "9px sans-serif";
        ctx.fillStyle = "#999";
        ctx.fillText(score.date.slice(5), x + barW / 2, H - 4);
      });
    };

    const renderStats = (period: string) => {
      statsBody.empty();
      const filtered = filterScores(period, allScores);
      if (!filtered.length) {
        statsBody.createEl("p", { text: "暂无数据 📭", cls: "kid-score-empty" });
        return;
      }
      const total = filtered.reduce((s, r) => s + r.total, 0);
      const avg = Math.round((total / filtered.length) * 10) / 10;
      const max = Math.max(...filtered.map((s) => s.total));
      let streak = 0;
      const sortedScores = filtered.sort((a, b) => +new Date(b.date) - +new Date(a.date));
      for (const s of sortedScores) {
        if (s.total > 0) streak++;
        else break;
      }
      const positiveDays = filtered.filter((s) => s.total > 0).length;
      const negativeDays = filtered.filter((s) => s.total < 0).length;
      const neutralDays = filtered.filter((s) => s.total === 0).length;

      const calcCompleted = (day: DayData) => {
        let completed = (day.customItems || []).length;
        for (const item of self.plugin.currentUser.items) {
          const val = day.scores[item.id] || 0;
          const isDeduct = item.category === "减分" || item.points < 0;
          if (isDeduct ? val !== 0 : val > 0) completed++;
        }
        return completed;
      };

      const cards = statsBody.createDiv({ cls: "kid-score-summary-cards" });
      const mkCard = (l: string, v: string, a?: boolean) => {
        const c = cards.createDiv({ cls: "summary-card " + (a ? "accent" : "") });
        c.createDiv({ cls: "card-val", text: v });
        c.createDiv({ cls: "card-lbl", text: l });
      };
      mkCard("累计总分", (total >= 0 ? "+" : "") + total, true);
      mkCard("日均分", (avg >= 0 ? "+" : "") + avg);
      mkCard("最高单日", "+" + max);
      mkCard("记录天数", filtered.length + " 天");
      mkCard("连续打分", streak + " 天");
      mkCard("正面天数", positiveDays + " 天");
      mkCard("负面天数", negativeDays + " 天");

      const goals = self.plugin.currentUser.goals || { daily: 10, weekly: 70, monthly: 300 };
      let goalLabel = "";
      let goalTarget = 0;
      let goalCompleted = 0;
      if (period === "week") {
        goalLabel = "本周目标";
        goalTarget = goals.weekly;
        goalCompleted = filtered.reduce((s, d) => s + calcCompleted(d), 0);
      } else if (period === "month") {
        goalLabel = "本月目标";
        goalTarget = goals.monthly;
        goalCompleted = filtered.reduce((s, d) => s + calcCompleted(d), 0);
      }
      if (goalTarget > 0) {
        const goalPct = Math.min(100, Math.round((goalCompleted / goalTarget) * 100));
        const goalCard = cards.createDiv({ cls: "summary-card goal-card" });
        goalCard.createDiv({ cls: "card-val", text: goalCompleted + "/" + goalTarget });
        goalCard.createDiv({ cls: "card-lbl", text: goalLabel });
        const gBarWrap = goalCard.createDiv({ cls: "summary-goal-bar-wrap" });
        const gBar = gBarWrap.createDiv({ cls: "summary-goal-bar" });
        gBar.style.width = goalPct + "%";
        if (goalPct >= 100) gBar.addClass("is-complete");
      }

      if (self.plugin.currentUser.items.length > 0) {
        const categories = self.plugin.currentUser.categories || [];
        const categoryStats: Record<string, { total: number; completed: number }> = {};
        categories.forEach((cat) => {
          categoryStats[cat] = { total: 0, completed: 0 };
        });
        const isItemDone = (item: typeof self.plugin.currentUser.items[0], val: number) => {
          const isDeduct = item.category === "减分" || item.points < 0;
          return isDeduct ? val !== 0 : val > 0;
        };
        for (const item of self.plugin.currentUser.items) {
          const cat = item.category || "其他";
          if (!categoryStats[cat]) {
            categoryStats[cat] = { total: 0, completed: 0 };
          }
          categoryStats[cat].total++;
          const count = filtered.filter((s) => s.scores[item.id] !== undefined && isItemDone(item, s.scores[item.id])).length;
          categoryStats[cat].completed += count;
        }
        statsBody.createEl("h3", { text: "标题分类完成率", cls: "stats-section-title" });
        const categoryList = statsBody.createDiv({ cls: "kid-score-item-completion" });
        Object.entries(categoryStats).forEach(([cat, stats]) => {
          const rate = Math.round((stats.completed / (stats.total * filtered.length)) * 100);
          const row2 = categoryList.createDiv({ cls: "completion-row" });
          row2.createSpan({ cls: "completion-emoji", text: "📋" });
          row2.createSpan({ cls: "completion-name", text: cat });
          const bw2 = row2.createDiv({ cls: "completion-bar-wrap" });
          const bar2 = bw2.createDiv({ cls: "completion-bar pos" });
          bar2.style.width = rate + "%";
          row2.createSpan({ cls: "completion-rate", text: rate + "%" });
        });

        statsBody.createEl("h3", { text: "各项目完成率", cls: "stats-section-title" });
        const itemList = statsBody.createDiv({ cls: "kid-score-item-completion" });
        const drawSparkline = (canvas: HTMLCanvasElement, data: number[], isDeduct: boolean) => {
          const ctx = canvas.getContext("2d");
          if (!ctx || data.length === 0) return;
          const W = canvas.width;
          const H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          const pad = 4;
          const maxAbs = Math.max(...data.map((v) => Math.abs(v)), 1);
          const step = data.length > 1 ? (W - pad * 2) / (data.length - 1) : 0;
          const baselineY = H / 2;

          ctx.strokeStyle = isDeduct ? "#f87171" : "#4ade80";
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          data.forEach((v, i) => {
            const x = pad + i * step;
            const y = baselineY - (v / maxAbs) * (baselineY - pad);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();

          ctx.fillStyle = isDeduct ? "#f87171" : "#4ade80";
          data.forEach((v, i) => {
            const x = pad + i * step;
            const y = baselineY - (v / maxAbs) * (baselineY - pad);
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          });
        };

        for (const item of self.plugin.currentUser.items) {
          const itemHistory = filtered
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((s) => s.scores[item.id] || 0);
          const count = filtered.filter((s) => s.scores[item.id] !== undefined && isItemDone(item, s.scores[item.id])).length;
          const rate = Math.round((count / filtered.length) * 100);
          const rowWrap = itemList.createDiv({ cls: "completion-row-wrap" });
          const row = rowWrap.createDiv({ cls: "completion-row" });
          row.createSpan({ cls: "completion-emoji", text: item.emoji });
          row.createSpan({ cls: "completion-name", text: item.name });
          const bw = row.createDiv({ cls: "completion-bar-wrap" });
          const bar = bw.createDiv({ cls: "completion-bar " + (item.points >= 0 ? "pos" : "neg") });
          bar.style.width = rate + "%";
          row.createSpan({ cls: "completion-rate", text: count + "/" + filtered.length + " (" + rate + "%)" });

          const sparkWrap = rowWrap.createDiv({ cls: "sparkline-wrap is-hidden" });
          const canvas = sparkWrap.createEl("canvas", { cls: "sparkline-canvas" });
          canvas.width = 300;
          canvas.height = 48;

          row.onclick = () => {
            const wasHidden = sparkWrap.hasClass("is-hidden");
            itemList.querySelectorAll(".sparkline-wrap").forEach((el) => el.addClass("is-hidden"));
            if (wasHidden) {
              sparkWrap.removeClass("is-hidden");
              drawSparkline(canvas, itemHistory.slice(-30), item.category === "减分" || item.points < 0);
            }
          };
        }
      }

      statsBody.createEl("h3", { text: "每日得分趋势", cls: "stats-section-title" });
      const chartWrap = statsBody.createDiv({ cls: "kid-score-chart-wrap" });
      const canvas = chartWrap.createEl("canvas", { cls: "kid-score-chart" });
      canvas.width = 540;
      canvas.height = 200;
      setTimeout(() => {
        drawBarChart(canvas, filtered.slice(-20));
      }, 50);

      if (period === "all" && filtered.length > 7) {
        statsBody.createEl("h3", { text: "按月汇总", cls: "stats-section-title" });
        const byMonth: Record<string, number[]> = {};
        for (const s of filtered) {
          const m = s.date.slice(0, 7);
          if (!byMonth[m]) byMonth[m] = [];
          byMonth[m].push(s.total);
        }
        const monthWrap = statsBody.createDiv({ cls: "kid-score-month-table-wrap" });
        const mt = monthWrap.createEl("table", { cls: "kid-score-month-table" });
        const th = mt.createEl("thead").createEl("tr");
        ["月份", "天数", "总分", "日均"].forEach((h) => {
          th.createEl("th", { text: h });
        });
        const tb = mt.createEl("tbody");
        Object.entries(byMonth)
          .sort()
          .forEach((e) => {
            const sum = e[1].reduce((a, b) => a + b, 0);
            const av = Math.round(sum / e[1].length);
            const tr = tb.createEl("tr");
            tr.createEl("td", { text: e[0] });
            tr.createEl("td", { text: String(e[1].length) });
            tr.createEl("td", { text: (sum >= 0 ? "+" : "") + sum });
            tr.createEl("td", { text: (av >= 0 ? "+" : "") + av });
          });
      }
    };

    for (const p of periods) {
      ((period) => {
        const tab = tabs.createEl("button", {
          text: period.label,
          cls: "kid-score-tab " + (period.key === activePeriod ? "is-active" : ""),
        });
        tab.onclick = () => {
          activePeriod = period.key;
          tabs.querySelectorAll(".kid-score-tab").forEach((t) => {
            t.removeClass("is-active");
          });
          tab.addClass("is-active");
          renderStats(activePeriod);
        };
      })(p);
    }
    renderStats(activePeriod);
  }

  onClose() {
    super.onClose();
  }
}

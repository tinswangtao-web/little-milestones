import type KidScorePlugin from "../../main";
import type { DayData, ScoreItem, StatsPeriod } from "../../types";
import { countPositiveDateStreak, getStartOfWeekString } from "../../utils/date";

function precomputeDoneCounts(
  items: ScoreItem[],
  filtered: DayData[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (const day of filtered) {
    for (const item of items) {
      if (isItemDone(item, day.scores[item.id])) {
        map.set(item.id, (map.get(item.id) || 0) + 1);
      }
    }
  }
  return map;
}

export function renderStatsPanel(
  statsBody: HTMLElement,
  plugin: KidScorePlugin,
  allScores: DayData[],
  period: StatsPeriod
): void {
  statsBody.empty();
  const filtered = filterScores(period, allScores);
  if (!filtered.length) {
    statsBody.createEl("p", { text: "暂无数据 📭", cls: "kid-score-empty" });
    return;
  }

  const total = filtered.reduce((sum, record) => sum + record.total, 0);
  const avg = Math.round((total / filtered.length) * 10) / 10;
  const max = Math.max(...filtered.map((record) => record.total));
  const streak = countPositiveStreak(filtered);
  const positiveDays = filtered.filter((record) => record.total > 0).length;
  const negativeDays = filtered.filter((record) => record.total < 0).length;
  const currentUser = plugin.currentUser;

  const cards = statsBody.createDiv({ cls: "kid-score-summary-cards" });
  renderSummaryCard(cards, "累计总分", (total >= 0 ? "+" : "") + total, true);
  renderSummaryCard(cards, "日均分", (avg >= 0 ? "+" : "") + avg);
  renderSummaryCard(cards, "最高单日", "+" + max);
  renderSummaryCard(cards, "记录天数", filtered.length + " 天");
  renderSummaryCard(cards, "连续打分", streak + " 天");
  renderSummaryCard(cards, "正面天数", positiveDays + " 天");
  renderSummaryCard(cards, "负面天数", negativeDays + " 天");

  renderGoalCard(cards, currentUser, filtered, period);

  if (currentUser.items.length > 0) {
    renderCategoryCompletion(statsBody, currentUser.items, currentUser.categories || [], filtered);
    renderItemCompletion(statsBody, currentUser.items, filtered);
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
    renderMonthlySummary(statsBody, filtered);
  }
}

export function filterScores(period: StatsPeriod, scores: DayData[]): DayData[] {
  const today = new Date();
  if (period === "week") {
    const weekStart = getStartOfWeekString(today);
    return scores.filter((score) => score.date >= weekStart);
  }
  if (period === "month") {
    const monthStart =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-01";
    return scores.filter((score) => score.date >= monthStart);
  }
  return scores;
}

function renderSummaryCard(
  cards: HTMLElement,
  label: string,
  value: string,
  accent = false
): void {
  const card = cards.createDiv({ cls: "summary-card " + (accent ? "accent" : "") });
  card.createDiv({ cls: "card-val", text: value });
  card.createDiv({ cls: "card-lbl", text: label });
}

function renderGoalCard(
  cards: HTMLElement,
  currentUser: KidScorePlugin["currentUser"],
  filtered: DayData[],
  period: StatsPeriod
): void {
  const goals = currentUser.goals || { daily: 10, weekly: 70, monthly: 300 };
  let goalLabel = "";
  let goalTarget = 0;
  let goalCompleted = 0;

  if (period === "week") {
    goalLabel = "本周目标";
    goalTarget = goals.weekly;
    goalCompleted = filtered.reduce(
      (sum, day) => sum + calcCompleted(currentUser.items, day),
      0
    );
  } else if (period === "month") {
    goalLabel = "本月目标";
    goalTarget = goals.monthly;
    goalCompleted = filtered.reduce(
      (sum, day) => sum + calcCompleted(currentUser.items, day),
      0
    );
  }

  if (goalTarget <= 0) return;

  const goalPct = Math.min(100, Math.round((goalCompleted / goalTarget) * 100));
  const goalCard = cards.createDiv({ cls: "summary-card goal-card" });
  goalCard.createDiv({ cls: "card-val", text: goalCompleted + "/" + goalTarget });
  goalCard.createDiv({ cls: "card-lbl", text: goalLabel });
  const wrap = goalCard.createDiv({ cls: "summary-goal-bar-wrap" });
  const bar = wrap.createDiv({ cls: "summary-goal-bar" });
  bar.style.width = goalPct + "%";
  if (goalPct >= 100) bar.addClass("is-complete");
}

function calcCompleted(items: ScoreItem[], day: DayData): number {
  let completed = (day.customItems || []).length;
  for (const item of items) {
    const val = day.scores[item.id] || 0;
    const isDeduct = item.category === "减分" || item.points < 0;
    if (isDeduct ? val !== 0 : val > 0) completed++;
  }
  return completed;
}

function renderCategoryCompletion(
  statsBody: HTMLElement,
  items: ScoreItem[],
  categories: string[],
  filtered: DayData[]
): void {
  const doneCounts = precomputeDoneCounts(items, filtered);
  const categoryStats: Record<string, { total: number; completed: number }> = {};
  categories.forEach((category) => {
    categoryStats[category] = { total: 0, completed: 0 };
  });

  for (const item of items) {
    const category = item.category || "其他";
    if (!categoryStats[category]) categoryStats[category] = { total: 0, completed: 0 };
    categoryStats[category].total++;
    categoryStats[category].completed += doneCounts.get(item.id) || 0;
  }

  statsBody.createEl("h3", { text: "分类完成率", cls: "stats-section-title" });
  const list = statsBody.createDiv({ cls: "kid-score-item-completion" });
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const rate = Math.round((stats.completed / (stats.total * filtered.length)) * 100);
    const row = list.createDiv({ cls: "completion-row" });
    row.createSpan({ cls: "completion-emoji", text: "📋" });
    row.createSpan({ cls: "completion-name", text: category });
    const wrap = row.createDiv({ cls: "completion-bar-wrap" });
    const bar = wrap.createDiv({ cls: "completion-bar pos" });
    bar.style.width = rate + "%";
    row.createSpan({ cls: "completion-rate", text: rate + "%" });
  });
}

function renderItemCompletion(
  statsBody: HTMLElement,
  items: ScoreItem[],
  filtered: DayData[]
): void {
  statsBody.createEl("h3", { text: "各项目完成率", cls: "stats-section-title" });
  const itemList = statsBody.createDiv({ cls: "kid-score-item-completion" });
  const doneCounts = precomputeDoneCounts(items, filtered);
  const sortedFiltered = filtered
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  for (const item of items) {
    const itemHistory = sortedFiltered.map((day) => day.scores[item.id] || 0);
    const count = doneCounts.get(item.id) || 0;
    const rate = Math.round((count / filtered.length) * 100);
    const rowWrap = itemList.createDiv({ cls: "completion-row-wrap" });
    const row = rowWrap.createDiv({ cls: "completion-row" });
    row.createSpan({ cls: "completion-emoji", text: item.emoji });
    row.createSpan({ cls: "completion-name", text: item.name });
    const wrap = row.createDiv({ cls: "completion-bar-wrap" });
    const bar = wrap.createDiv({
      cls: "completion-bar " + (item.points >= 0 ? "pos" : "neg"),
    });
    bar.style.width = rate + "%";
    row.createSpan({
      cls: "completion-rate",
      text: count + "/" + filtered.length + " (" + rate + "%)",
    });

    const sparkWrap = rowWrap.createDiv({ cls: "sparkline-wrap is-hidden" });
    const canvas = sparkWrap.createEl("canvas", { cls: "sparkline-canvas" });
    canvas.width = 300;
    canvas.height = 48;

    row.onclick = () => {
      const wasHidden = sparkWrap.hasClass("is-hidden");
      itemList.querySelectorAll(".sparkline-wrap").forEach((el) => {
        el.addClass("is-hidden");
      });
      if (wasHidden) {
        sparkWrap.removeClass("is-hidden");
        drawSparkline(
          canvas,
          itemHistory.slice(-30),
          item.category === "减分" || item.points < 0
        );
      }
    };
  }
}

function renderMonthlySummary(statsBody: HTMLElement, filtered: DayData[]): void {
  statsBody.createEl("h3", { text: "按月汇总", cls: "stats-section-title" });
  const byMonth: Record<string, number[]> = {};
  for (const day of filtered) {
    const month = day.date.slice(0, 7);
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(day.total);
  }

  const wrap = statsBody.createDiv({ cls: "kid-score-month-table-wrap" });
  const table = wrap.createEl("table", { cls: "kid-score-month-table" });
  const th = table.createEl("thead").createEl("tr");
  ["月份", "天数", "总分", "日均"].forEach((header) => {
    th.createEl("th", { text: header });
  });
  const tbody = table.createEl("tbody");
  Object.entries(byMonth)
    .sort()
    .forEach(([month, values]) => {
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = Math.round(sum / values.length);
      const tr = tbody.createEl("tr");
      tr.createEl("td", { text: month });
      tr.createEl("td", { text: String(values.length) });
      tr.createEl("td", { text: (sum >= 0 ? "+" : "") + sum });
      tr.createEl("td", { text: (avg >= 0 ? "+" : "") + avg });
    });
}

function isItemDone(item: ScoreItem, val: number): boolean {
  const isDeduct = item.category === "减分" || item.points < 0;
  return isDeduct ? val !== 0 : val > 0;
}

function countPositiveStreak(filtered: DayData[]): number {
  return countPositiveDateStreak(filtered);
}

function drawBarChart(canvas: HTMLCanvasElement, data: DayData[]): void {
  const ctx = canvas.getContext("2d");
  if (!ctx || !data.length) return;
  const width = canvas.width;
  const height = canvas.height;
  const pad = { top: 24, bottom: 32, left: 8, right: 8 };
  const chartHeight = height - pad.top - pad.bottom;
  const midY = pad.top + chartHeight * 0.6;
  const maxAbs = Math.max(...data.map((score) => Math.abs(score.total)).concat([1]));
  const barWidth = Math.max(
    Math.floor((width - pad.left - pad.right) / data.length) - 4,
    6
  );

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pad.left, midY);
  ctx.lineTo(width - pad.right, midY);
  ctx.stroke();
  ctx.setLineDash([]);

  data.forEach((score, index) => {
    const x = pad.left + index * (barWidth + 4);
    const pixPer = (chartHeight * 0.55) / maxAbs;
    const barHeight = Math.abs(score.total) * pixPer;
    const isPositive = score.total >= 0;
    ctx.fillStyle = isPositive ? "#4ade80" : "#f87171";
    ctx.fillRect(x, isPositive ? midY - barHeight : midY, barWidth, barHeight);
    ctx.fillStyle = "#333";
    ctx.font = "bold " + Math.min(11, barWidth) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      String(score.total),
      x + barWidth / 2,
      isPositive ? midY - barHeight - 4 : midY + barHeight + 12
    );
    ctx.font = "9px sans-serif";
    ctx.fillStyle = "#999";
    ctx.fillText(score.date.slice(5), x + barWidth / 2, height - 4);
  });
}

function drawSparkline(
  canvas: HTMLCanvasElement,
  data: number[],
  isDeduct: boolean
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx || data.length === 0) return;
  const width = canvas.width;
  const height = canvas.height;
  const pad = 4;
  const maxAbs = Math.max(...data.map((value) => Math.abs(value)), 1);
  const step = data.length > 1 ? (width - pad * 2) / (data.length - 1) : 0;
  const baselineY = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = isDeduct ? "#f87171" : "#4ade80";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  data.forEach((value, index) => {
    const x = pad + index * step;
    const y = baselineY - (value / maxAbs) * (baselineY - pad);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = isDeduct ? "#f87171" : "#4ade80";
  data.forEach((value, index) => {
    const x = pad + index * step;
    const y = baselineY - (value / maxAbs) * (baselineY - pad);
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

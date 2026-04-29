import type { CustomScoreItem, ScoreItem } from "../../types";

interface RenderDailyTotalDisplayOptions {
  element: HTMLElement;
  items: ScoreItem[];
  scores: Record<string, number>;
  customItems: CustomScoreItem[];
  dailyGoal: number;
}

export function renderDailyTotalDisplay({
  element,
  items,
  scores,
  customItems,
  dailyGoal,
}: RenderDailyTotalDisplayOptions) {
  let total = 0;
  for (const item of items) {
    const val = scores[item.id] || 0;
    total += val;
  }
  total += customItems.reduce((sum, item) => sum + item.points, 0);
  const pct =
    dailyGoal > 0
      ? Math.min(100, Math.max(0, Math.round((total / dailyGoal) * 100)))
      : 0;
  element.empty();
  element.createSpan({ text: "🏆 当前总分：" + (total >= 0 ? "+" : "") + total + " 分  " });
  const goalWrap = element.createSpan({ cls: "daily-goal-wrap" });
  goalWrap.createSpan({ cls: "daily-goal-label", text: "今日目标 " + total + "/" + dailyGoal });
  const barWrap = goalWrap.createSpan({ cls: "daily-goal-bar-wrap" });
  const bar = barWrap.createSpan({ cls: "daily-goal-bar" });
  bar.style.width = pct + "%";
  if (pct >= 100) bar.addClass("is-complete");
}

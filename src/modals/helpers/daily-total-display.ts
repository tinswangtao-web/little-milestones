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
  let completed = 0;
  for (const item of items) {
    const val = scores[item.id] || 0;
    total += val;
    const isDeduct = item.category === "减分" || item.points < 0;
    if (isDeduct ? val !== 0 : val > 0) {
      completed++;
    }
  }
  completed += customItems.length;
  const pct = Math.min(100, Math.round((completed / dailyGoal) * 100));
  element.empty();
  element.createSpan({ text: "🏆 当前总分：" + (total >= 0 ? "+" : "") + total + " 分  " });
  const goalWrap = element.createSpan({ cls: "daily-goal-wrap" });
  goalWrap.createSpan({ cls: "daily-goal-label", text: "今日目标 " + completed + "/" + dailyGoal });
  const barWrap = goalWrap.createSpan({ cls: "daily-goal-bar-wrap" });
  const bar = barWrap.createSpan({ cls: "daily-goal-bar" });
  bar.style.width = pct + "%";
  if (pct >= 100) bar.addClass("is-complete");
}

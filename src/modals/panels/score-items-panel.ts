import type { CustomScoreItem, DayData, ScoreItem } from "../../types";
import { attachPressGesture } from "../helpers/press-gesture";
import { renderDesktopCustomItemRowLayout } from "./desktop-score-sections";
import { renderMobileCustomItemRowLayout } from "./mobile-score-sections";
import { renderDesktopScoreCardLayout } from "./desktop-score-card";
import { renderMobileScoreCardLayout } from "./mobile-score-card";

interface RenderScoreCardOptions {
  item: ScoreItem;
  grid: HTMLElement;
  yesterdayData: DayData | null;
  getScore: (itemId: string) => number;
  isTouchMode: boolean;
  longPressMs: number;
  getDoubleTapThreshold: () => number;
  triggerHaptic: (style: "tap" | "longpress") => void;
  onToggleScore: (item: ScoreItem) => void;
  onCustomValue: (item: ScoreItem, quickOnly: boolean, card: HTMLElement) => void;
}

interface RenderCustomItemsOptions {
  container: HTMLElement;
  customItems: CustomScoreItem[];
  isTouchMode: boolean;
  longPressMs: number;
  onQuickAdjust: (idx: number) => void;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
}

export function renderScoreCard({
  item,
  grid,
  yesterdayData,
  getScore,
  isTouchMode,
  longPressMs,
  getDoubleTapThreshold,
  triggerHaptic,
  onToggleScore,
  onCustomValue,
}: RenderScoreCardOptions) {
  const scoreVal = getScore(item.id);
  const isEarned = scoreVal > 0;
  const isNeg = scoreVal < 0;
  const isDeductItem = item.category === "减分" || item.points < 0;
  const isDeductedActive = isDeductItem && scoreVal !== 0;
  const cardClassName =
    (isEarned ? " is-earned" : "") +
    (isNeg ? " is-negative" : "") +
    (isDeductedActive ? " is-deducted-active" : "");
  const layout = isTouchMode
    ? renderMobileScoreCardLayout(grid, cardClassName)
    : renderDesktopScoreCardLayout(grid, cardClassName);
  const { card, emoji, name, noteHost, points, yesterday } = layout;
  card.dataset.itemId = item.id;
  const moreBtn = card.createEl("button", {
    cls: "kid-score-card-more-btn",
    text: "⋯",
  });
  moreBtn.setAttribute("aria-label", "调整分值");
  moreBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCustomValue(item, false, card);
  };
  emoji.setText(item.emoji);
  name.setText(item.name);
  if (item.note) {
    noteHost.createDiv({ cls: "card-note", text: item.note });
  }
  const pointsText =
    scoreVal !== 0
      ? (scoreVal >= 0 ? "+" : "") +
        scoreVal +
        " 分" +
        (scoreVal !== item.points ? " 📝" : "")
      : (item.points >= 0 ? "+" : "") + item.points + " 分";
  points.setText(pointsText);
  if (yesterdayData) {
    const yScore = yesterdayData.scores[item.id] || 0;
    const yClass = yScore > 0 ? "was-earned" : yScore < 0 ? "was-negative" : "was-missed";
    const ySign = yScore > 0 ? "+" : "";
    yesterday.className = "card-yesterday " + yClass;
    yesterday.textContent = "昨 " + ySign + yScore + " 分";
  } else {
    yesterday.className = "card-yesterday was-missed";
    yesterday.textContent = "昨 -";
  }

  attachPressGesture({
    element: card,
    longPressMs,
    isTouchMode,
    getDoubleTapThreshold,
    shouldIgnoreTarget: (target) =>
      target === moreBtn || moreBtn.contains(target as Node),
    onLongPress: () => {
      triggerHaptic("longpress");
      onCustomValue(item, false, card);
    },
    onSingleTap: () => {
      onToggleScore(item);
    },
    onDoubleTap: () => {
      onCustomValue(item, true, card);
    },
  });

  return card;
}

export function refreshScoreCard(card: HTMLElement, item: ScoreItem, scoreVal: number) {
  const isEarned = scoreVal > 0;
  const isNeg = scoreVal < 0;
  const isDeductItem = item.category === "减分" || item.points < 0;
  const isDeductedActive = isDeductItem && scoreVal !== 0;
  card.classList.toggle("is-earned", isEarned);
  card.classList.toggle("is-negative", isNeg);
  card.classList.toggle("is-deducted-active", isDeductedActive);
  const pointsEl = card.querySelector(".card-points");
  if (pointsEl) {
    pointsEl.textContent =
      scoreVal !== 0
        ? (scoreVal >= 0 ? "+" : "") +
          scoreVal +
          " 分" +
          (scoreVal !== item.points ? " 📝" : "")
        : (item.points >= 0 ? "+" : "") + item.points + " 分";
  }
}

export function renderCustomItemsList({
  container,
  customItems,
  isTouchMode,
  longPressMs,
  onQuickAdjust,
  onEdit,
  onDelete,
}: RenderCustomItemsOptions) {
  container.empty();
  if (customItems.length === 0) {
    container.createDiv({ cls: "kid-score-custom-empty", text: "暂无临时事项" });
    return;
  }

  for (let i = 0; i < customItems.length; i++) {
    ((idx) => {
      const ci = customItems[idx];
      const layout = isTouchMode
        ? renderMobileCustomItemRowLayout(container)
        : renderDesktopCustomItemRowLayout(container);
      const { wrap, row, main } = layout;
      main.createSpan({ cls: "custom-emoji", text: ci.emoji });
      main.createSpan({ cls: "custom-name", text: ci.name });
      main.createSpan({
        cls: "custom-points " + (ci.points >= 0 ? "pos" : "neg"),
        text: (ci.points >= 0 ? "+" : "") + ci.points + " 分",
      });
      const quick = row.createEl("button", {
        cls: "custom-row-more-btn",
        text: "调分",
      });
      quick.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickAdjust(idx);
      };
      const edit = row.createEl("button", { cls: "custom-edit-btn", text: "✏️" });
      edit.onclick = (e) => {
        e.stopPropagation();
        onEdit(idx);
      };
      const del = row.createEl("button", { cls: "custom-delete-btn", text: "🗑" });
      del.onclick = (e) => {
        e.stopPropagation();
        onDelete(idx);
      };
      if (ci.note) {
        wrap.createDiv({ cls: "custom-item-note", text: ci.note });
      }

      attachPressGesture({
        element: row,
        longPressMs,
        isTouchMode,
        shouldIgnoreTarget: (target) =>
          target === del ||
          del.contains(target as Node) ||
          target === quick ||
          quick.contains(target as Node) ||
          target === edit ||
          edit.contains(target as Node),
        onLongPress: () => {
          onEdit(idx);
        },
        onSingleTap: () => {
          onQuickAdjust(idx);
        },
        onDoubleTap: () => {
          onQuickAdjust(idx);
        },
      });
    })(i);
  }
}

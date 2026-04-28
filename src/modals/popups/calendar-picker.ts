import { formatDate, parseDateString } from "../../utils/date";

interface OpenCalendarPickerOptions {
  currentDate: string;
  recordDates: Set<string>;
  onSelect: (dateStr: string) => void;
}

export function openCalendarPicker({
  currentDate,
  recordDates,
  onSelect,
}: OpenCalendarPickerOptions) {
  const overlay = document.createElement("div");
  overlay.className = "kid-score-value-overlay";
  const popup = document.createElement("div");
  popup.className = "kid-score-calendar-popup";

  let viewDate = parseDateString(currentDate);
  const overlayStateId = "calendar-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  let pushedHistoryState = false;

  const header = popup.createDiv({ cls: "cal-header" });
  const prevMonthBtn = header.createEl("button", { cls: "cal-nav-btn", text: "◀" });
  const monthLabel = header.createEl("span", { cls: "cal-month-label" });
  const nextMonthBtn = header.createEl("button", { cls: "cal-nav-btn", text: "▶" });

  const grid = popup.createDiv({ cls: "cal-grid" });
  ["日", "一", "二", "三", "四", "五", "六"].forEach((d) => {
    grid.createEl("div", { cls: "cal-weekday", text: d });
  });

  const removeOverlay = () => {
    overlay.remove();
    window.removeEventListener("popstate", onPopstate);
    if (
      pushedHistoryState &&
      (history.state as any)?.kidScoreOverlayId === overlayStateId
    ) {
      history.back();
    }
  };

  const renderMonth = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.textContent = year + "年" + (month + 1) + "月";
    grid.querySelectorAll(".cal-day").forEach((el) => el.remove());

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const todayStr = formatDate(0);

    for (let i = 0; i < startOffset; i++) {
      grid.createEl("div", { cls: "cal-day is-empty" });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const ds =
        year +
        "-" +
        String(month + 1).padStart(2, "0") +
        "-" +
        String(d).padStart(2, "0");
      const cell = grid.createEl("button", { cls: "cal-day" });
      cell.textContent = String(d);
      if (ds === currentDate) cell.addClass("is-selected");
      if (ds === todayStr) cell.addClass("is-today");
      if (recordDates.has(ds)) cell.addClass("has-record");
      if (ds > todayStr) {
        cell.disabled = true;
        cell.addClass("is-future");
      } else {
        cell.onclick = () => {
          onSelect(ds);
          removeOverlay();
        };
      }
    }
  };

  prevMonthBtn.onclick = () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderMonth();
  };
  nextMonthBtn.onclick = () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderMonth();
  };

  renderMonth();

  const cancelBtn = popup.createEl("button", { cls: "value-popup-cancel", text: "取消" });
  cancelBtn.style.marginTop = "10px";
  cancelBtn.style.width = "100%";
  cancelBtn.onclick = () => {
    removeOverlay();
  };
  popup.appendChild(cancelBtn);
  overlay.appendChild(popup);

  const onPopstate = (e: PopStateEvent) => {
    // When the user navigates "back" away from our pushed overlay state, `e.state`
    // becomes the previous history entry (not our overlay id). In that case we
    // should dismiss the overlay.
    if ((e.state as any)?.kidScoreOverlayId === overlayStateId) return;
    if (!overlay.isConnected) return;
    overlay.remove();
    window.removeEventListener("popstate", onPopstate);
    pushedHistoryState = false;
  };
  history.pushState({ kidScoreOverlay: true, kidScoreOverlayId: overlayStateId }, "");
  pushedHistoryState = true;
  window.addEventListener("popstate", onPopstate);

  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) {
      e.preventDefault();
      removeOverlay();
    }
  });
  overlay.addEventListener("pointerdown", (e) => {
    if (e.target === overlay) {
      e.preventDefault();
      removeOverlay();
    }
  });
  document.body.appendChild(overlay);
}

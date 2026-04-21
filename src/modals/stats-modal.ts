import { App } from "obsidian";
import { BaseMobileModal } from "../ui/base-mobile-modal";
import KidScorePlugin from "../main";
import type { StatsPeriod } from "../types";
import { renderStatsPanel } from "./panels/stats-panel";

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
      { label: "本周", key: "week" as StatsPeriod },
      { label: "本月", key: "month" as StatsPeriod },
      { label: "全部", key: "all" as StatsPeriod },
    ];
    let activePeriod: StatsPeriod = "week";

    const renderStats = (period: StatsPeriod) => {
      renderStatsPanel(statsBody, this.plugin, allScores, period);
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

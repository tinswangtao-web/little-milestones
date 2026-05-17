import { App } from "obsidian";
import { BaseMobileModal } from "../ui/base-mobile-modal";
import KidScorePlugin from "../main";
import type { StatsPeriod } from "../types";
import { renderStatsPanel } from "./panels/stats-panel";

interface StatsModalOptions {
  onBack?: () => void;
  backLabel?: string;
}

export class StatsModal extends BaseMobileModal {
  plugin: KidScorePlugin;

  constructor(app: App, plugin: KidScorePlugin, private options: StatsModalOptions = {}) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async onOpen() {
    super.onOpen();
    const contentEl = this.contentEl;
    contentEl.empty();
    contentEl.addClass("little-milestones-modal", "little-milestones-stats-modal");

    contentEl.createEl("h2", { text: "📊 " + this.plugin.currentUser.name + " 的打分统计" });
    if (this.options.onBack) {
      const backBar = contentEl.createDiv({ cls: "little-milestones-stats-actions" });
      const backBtn = backBar.createEl("button", {
        cls: "diary-tool-btn little-milestones-stats-back-btn",
        text: this.options.backLabel || "← 返回上一页",
      });
      backBtn.onclick = () => {
        const onBack = this.options.onBack;
        this.close();
        onBack?.();
      };
    }
    const allScores = await this.plugin.getAllScores();
    if (allScores.length === 0) {
      contentEl.createEl("p", { text: "📭 暂无数据", cls: "little-milestones-empty" });
      return;
    }

    const grandTotal = allScores.reduce((s, r) => s + r.total, 0);
    const grandDays = allScores.length;
    const grandAvg = Math.round(grandTotal / grandDays);
    const gtSign = grandTotal >= 0 ? "+" : "";
    const gaSign = grandAvg >= 0 ? "+" : "";

    const grandBanner = contentEl.createDiv({ cls: "little-milestones-grand-banner" });
    const gl = grandBanner.createDiv({ cls: "grand-left" });
    gl.createDiv({ cls: "grand-total-value", text: gtSign + grandTotal });
    gl.createDiv({ cls: "grand-total-label", text: "历史累计总分" });
    const gr = grandBanner.createDiv({ cls: "grand-right" });
    gr.createDiv({ text: "📅 记录 " + grandDays + " 天", cls: "grand-stat" });
    gr.createDiv({ text: "📈 日均 " + gaSign + grandAvg + " 分", cls: "grand-stat" });
    gr.createDiv({ text: "🗓️ 起始 " + allScores[0].date, cls: "grand-stat" });

    const tabs = contentEl.createDiv({ cls: "little-milestones-tabs" });
    const statsBody = contentEl.createDiv({ cls: "little-milestones-stats-body" });
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
          cls: "little-milestones-tab " + (period.key === activePeriod ? "is-active" : ""),
        });
        tab.onclick = () => {
          activePeriod = period.key;
          tabs.querySelectorAll(".little-milestones-tab").forEach((t) => {
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

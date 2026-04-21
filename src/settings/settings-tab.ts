import { App, Modal, Notice, PluginSettingTab, Setting, MarkdownRenderer } from "obsidian";
import KidScorePlugin from "../main";
import { makeDefaultUser } from "../constants";
import { showEmojiPicker } from "../ui/emoji-picker";
import { bindModalInputFocus } from "../utils/dom";
import { setupModalKeyboard } from "../utils/mobile";
import { DEFAULT_DIARY_TEMPLATE } from "../constants";

export class KidScoreSettingTab extends PluginSettingTab {
  plugin: KidScorePlugin;

  constructor(app: App, plugin: KidScorePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const self = this;
    const containerEl = this.containerEl;
    containerEl.empty();
    containerEl.addClass("kid-score-settings");
    let pendingScrollItemId: string | null = null;

    const bindSettingsInput = (input: HTMLElement | null) => {
      bindModalInputFocus(input, {
        manualTouchFocus: false,
        scrollOnIOSFocus: false,
      });
    };

    containerEl.createEl("h2", { text: "🌟 小朋友每日记录设置" });
    containerEl.createEl("h3", { text: "👥 用户管理" });
    containerEl.createEl("p", { cls: "kid-score-hint", text: "点击用户名切换，长按用户名可删除该用户。" });

    const userMgrWrap = containerEl.createDiv({ cls: "kid-score-settings-users" });

    const showUserDeleteConfirm = (u: ReturnType<typeof makeDefaultUser>) => {
      const delModal = new (class extends Modal {
        _kbCleanup?: ReturnType<typeof setupModalKeyboard>;
        onOpen() {
          const m = this;
          m.titleEl.setText("⚠️ 删除用户");
          m.modalEl.addClass("kid-score-edit-modal");
          this._kbCleanup = setupModalKeyboard(this);
          const c = m.contentEl;
          c.createDiv({ cls: "value-popup-hint", text: "将删除「" + u.name + "」的所有设置，已保存的记录文件不受影响。" });
          const promptEl = c.createDiv();
          promptEl.style.marginBottom = "6px";
          promptEl.style.fontSize = "0.9em";
          promptEl.textContent = "请输入『确定删除』继续：";
          const confirmInput = c.createEl("input", { type: "text", cls: "custom-form-name-input" });
          confirmInput.placeholder = "确定删除";
          confirmInput.autocomplete = "off";
          bindModalInputFocus(confirmInput);
          const acts = c.createDiv({ cls: "value-popup-actions" });
          acts.style.marginTop = "12px";
          const cancelBtn = acts.createEl("button", { cls: "value-popup-cancel", text: "取消" });
          cancelBtn.onclick = () => {
            m.close();
          };
          const delBtn = acts.createEl("button", { cls: "value-popup-confirm", text: "删除" });
          delBtn.style.background = "var(--color-red, #e03131)";
          delBtn.style.color = "#fff";
          delBtn.onclick = async () => {
            if (confirmInput.value.trim() !== "确定删除") {
              confirmInput.classList.add("is-error");
              confirmInput.focus();
              return;
            }
            try {
              const users = self.plugin.settings.users;
              const idx = users.findIndex((uu) => uu.id === u.id);
              if (idx !== -1 && users.length > 1) {
                users.splice(idx, 1);
                self.plugin.settings.currentUserId = users[Math.max(0, idx - 1)].id;
                await self.plugin.saveSettings();
                m.close();
                self.display();
              }
            } catch (e) {
              new Notice("❌ 删除失败：" + (e instanceof Error ? e.message : String(e)));
            }
          };
        }
        onClose() {
          if (this._kbCleanup) this._kbCleanup();
          this.contentEl.empty();
        }
      })(self.plugin.app);
      delModal.open();
    };

    const renderUserMgr = () => {
      userMgrWrap.empty();
      self.plugin.settings.users.forEach((u) => {
        const uBtn = userMgrWrap.createEl("button", {
          cls: "kid-score-user-btn" + (u.id === self.plugin.settings.currentUserId ? " is-active" : ""),
          text: u.name,
        });
        let pressTimer: number | null = null;
        let isLongPress = false;
        let hasMoved = false;
        let startX = 0;
        let startY = 0;
        uBtn.addEventListener("pointerdown", (e) => {
          isLongPress = false;
          hasMoved = false;
          startX = e.clientX;
          startY = e.clientY;
          pressTimer = window.setTimeout(() => {
            if (!hasMoved && self.plugin.settings.users.length > 1) {
              isLongPress = true;
              showUserDeleteConfirm(u as ReturnType<typeof makeDefaultUser>);
            }
          }, 600);
        });
        uBtn.addEventListener("pointermove", (e) => {
          if (!hasMoved && (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8)) {
            hasMoved = true;
            if (pressTimer) clearTimeout(pressTimer);
          }
        });
        uBtn.addEventListener("pointerup", () => {
          if (pressTimer) clearTimeout(pressTimer);
          if (!isLongPress && !hasMoved) {
            self.plugin.settings.currentUserId = u.id;
            self.plugin.saveSettings().then(() => {
              self.display();
            });
          }
        });
        uBtn.addEventListener("pointercancel", () => {
          if (pressTimer) clearTimeout(pressTimer);
        });
      });
      const addUBtn = userMgrWrap.createEl("button", { cls: "kid-score-user-add-btn", text: "＋ 添加用户" });
      addUBtn.onclick = async () => {
        try {
          const nu = makeDefaultUser();
          nu.name = "新用户";
          self.plugin.settings.users.push(nu);
          self.plugin.settings.currentUserId = nu.id;
          await self.plugin.saveSettings();
          self.display();
        } catch (e) {
          new Notice("❌ 添加用户失败：" + (e instanceof Error ? e.message : String(e)));
        }
      };
    };
    renderUserMgr();

    new Setting(containerEl)
      .setName("小朋友姓名")
      .setDesc("当前用户的显示名字")
      .addText((t) =>
        t
          .setPlaceholder("王靖辰")
          .setValue(self.plugin.currentUser.name)
          .onChange(async (v) => {
            const newName = v.trim() || "小朋友";
            const oldName = self.plugin.currentUser.name;
            if (newName === oldName) return;
            if (!confirm("确定将用户名修改为「" + newName + "」吗？")) return;
            try {
              await self.plugin.renameUserInFiles(oldName, newName);
              self.plugin.currentUser.name = newName;
              await self.plugin.saveSettings();
              renderUserMgr();
              new Notice("✅ 用户名已更新，历史记录中的名称已同步替换");
            } catch (e) {
              console.error("[Little Milestones] renameUserInFiles error", e);
              new Notice("❌ " + (e instanceof Error ? e.message : String(e)));
            }
          })
      );
    bindSettingsInput(containerEl.querySelector(".setting-item:last-child input"));

    new Setting(containerEl)
      .setName("记录保存路径")
      .setDesc("每日打分 Markdown 文件存放的文件夹")
      .addText((t) =>
        t
          .setPlaceholder("Little Milestones/Daily Records")
          .setValue(self.plugin.currentUser.savePath)
          .onChange(async (v) => {
            const newPath = v.trim() || "Little Milestones/Daily Records";
            const oldPath = self.plugin.currentUser.savePath;
            if (newPath === oldPath) return;
            if (!confirm("确定将记录保存路径修改为「" + newPath + "」吗？\n已有的历史记录将自动迁移到新路径。")) return;
            try {
              await self.plugin.migrateSavePath(oldPath, newPath);
              self.plugin.currentUser.savePath = newPath;
              await self.plugin.saveSettings();
              new Notice("✅ 保存路径已修改，历史记录已自动迁移");
            } catch (e) {
              console.error("[Little Milestones] migrateSavePath error", e);
              new Notice("❌ " + (e instanceof Error ? e.message : String(e)));
            }
          })
      );
    bindSettingsInput(containerEl.querySelector(".setting-item:last-child input"));

    const goalsWrap = containerEl.createDiv({ cls: "kid-score-goals-section" });
    goalsWrap.createEl("h3", { text: "🎯 每日目标" });
    goalsWrap.createEl("p", { cls: "kid-score-hint", text: "以完成项目数为统计标准（含加分项、减分项和临时事项）" });
    const goalsGrid = goalsWrap.createDiv({ cls: "kid-score-goals-grid" });
    const goalFields: { key: "daily" | "weekly" | "monthly"; label: string }[] = [
      { key: "daily", label: "每日目标" },
      { key: "weekly", label: "每周目标" },
      { key: "monthly", label: "每月目标" },
    ];
    for (const gf of goalFields) {
      const cell = goalsGrid.createDiv({ cls: "kid-score-goal-cell" });
      cell.createEl("label", { text: gf.label });
      const inp = cell.createEl("input", { cls: "kid-score-goal-input" });
      inp.type = "number";
      inp.min = "1";
      inp.value = String(self.plugin.currentUser.goals[gf.key] || 1);
      bindSettingsInput(inp);
      inp.onchange = async () => {
        const n = parseInt(inp.value, 10);
        if (Number.isFinite(n) && n > 0) {
          self.plugin.currentUser.goals[gf.key] = n;
          await self.plugin.saveSettings();
          new Notice("✅ " + gf.label + "已更新为 " + n);
        }
      };
    }

    renderRulesAndTemplateSections();

    const catHeaderWrap = containerEl.createDiv({ cls: "kid-score-section-header" });
    catHeaderWrap.createEl("h3", { text: "📁 分类管理" });
    catHeaderWrap.createSpan({ cls: "kid-score-section-desc", text: "可拖拽排序，项目会按分类分组显示" });

    const catWrap = containerEl.createDiv({ cls: "kid-score-cat-list" });
    const catDrag = {
      dragging: false,
      dragIdx: -1,
      placeholder: null as HTMLElement | null,
      ghost: null as HTMLElement | null,
      rows: [] as HTMLElement[],
    };
    const getCatDragRowIndex = (y: number) => {
      for (let r = 0; r < catDrag.rows.length; r++) {
        const rect = catDrag.rows[r].getBoundingClientRect();
        if (y < rect.top + rect.height / 2) return r;
      }
      return catDrag.rows.length;
    };
    const onCatDragMove = (clientY: number) => {
      if (!catDrag.dragging) return;
      if (catDrag.ghost) catDrag.ghost.style.top = clientY - 20 + "px";
      const targetIdx = getCatDragRowIndex(clientY);
      const parent = catDrag.rows[0].parentElement;
      if (!parent || !catDrag.placeholder) return;
      if (targetIdx >= catDrag.rows.length) {
        parent.appendChild(catDrag.placeholder);
      } else {
        parent.insertBefore(catDrag.placeholder, catDrag.rows[targetIdx]);
      }
    };
    const onCatDragEnd = (clientY: number) => {
      if (!catDrag.dragging) return;
      catDrag.dragging = false;
      if (catDrag.ghost) catDrag.ghost.remove();
      if (catDrag.placeholder) catDrag.placeholder.remove();
      document.body.style.userSelect = "";
      (document.body.style as any).webkitUserSelect = "";
      const targetIdx = getCatDragRowIndex(clientY);
      let fromIdx = catDrag.dragIdx;
      if (targetIdx > fromIdx) fromIdx--;
      const arr = self.plugin.currentUser.categories;
      if (fromIdx !== targetIdx && fromIdx >= 0 && targetIdx >= 0 && targetIdx < arr.length) {
        const moved = arr.splice(fromIdx, 1)[0];
        arr.splice(targetIdx, 0, moved);
        (async () => {
          await self.plugin.saveSettings();
          renderCategories();
          renderItems();
        })();
      } else {
        renderCategories();
      }
    };
    const catPointerMoveHandler = (e: PointerEvent) => {
      onCatDragMove(e.clientY);
    };
    const catPointerUpHandler = (e: PointerEvent) => {
      document.removeEventListener("pointermove", catPointerMoveHandler);
      document.removeEventListener("pointerup", catPointerUpHandler);
      document.removeEventListener("pointercancel", catPointerCancelHandler);
      onCatDragEnd(e.clientY);
    };
    const catPointerCancelHandler = () => {
      document.removeEventListener("pointermove", catPointerMoveHandler);
      document.removeEventListener("pointerup", catPointerUpHandler);
      document.removeEventListener("pointercancel", catPointerCancelHandler);
      catDrag.dragging = false;
      if (catDrag.ghost) {
        catDrag.ghost.remove();
        catDrag.ghost = null;
      }
      if (catDrag.placeholder) {
        catDrag.placeholder.remove();
        catDrag.placeholder = null;
      }
      document.body.style.userSelect = "";
      (document.body.style as any).webkitUserSelect = "";
      renderCategories();
    };

    const renderCategories = () => {
      catWrap.empty();
      catDrag.rows = [];
      const cats = self.plugin.currentUser.categories || [];
      for (let ci = 0; ci < cats.length; ci++) {
        ((idx: number) => {
          const row = catWrap.createDiv({ cls: "kid-score-cat-row" });
          const handle = row.createEl("span", { cls: "settings-drag-handle", text: "☰" });
          handle.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            catDrag.dragging = true;
            catDrag.dragIdx = idx;
            catDrag.rows = Array.from(catWrap.querySelectorAll(".kid-score-cat-row")) as HTMLElement[];
            const rect = row.getBoundingClientRect();
            const ghost = row.cloneNode(true) as HTMLElement;
            ghost.className = "kid-score-cat-row settings-drag-ghost";
            ghost.style.cssText =
              "position:fixed;left:" +
              rect.left +
              "px;top:" +
              (e.clientY - 20) +
              "px;width:" +
              rect.width +
              "px;z-index:10000;opacity:0.85;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);background:var(--background-primary);border-radius:8px;";
            document.body.appendChild(ghost);
            catDrag.ghost = ghost;
            const ph = document.createElement("div");
            ph.className = "settings-drag-placeholder";
            ph.style.cssText =
              "height:" +
              rect.height +
              "px;border:2px dashed var(--interactive-accent);border-radius:8px;margin:2px 0;background:var(--background-secondary);opacity:0.5;";
            if (row.parentElement) row.parentElement.insertBefore(ph, row);
            catDrag.placeholder = ph;
            row.style.display = "none";
            document.body.style.userSelect = "none";
            (document.body.style as any).webkitUserSelect = "none";
            document.addEventListener("pointermove", catPointerMoveHandler);
            document.addEventListener("pointerup", catPointerUpHandler);
            document.addEventListener("pointercancel", catPointerCancelHandler);
          });
          const input = row.createEl("input", { cls: "settings-name-input" });
          bindSettingsInput(input);
          input.value = cats[idx];
          input.onchange = async () => {
            const oldName = self.plugin.currentUser.categories[idx];
            const newName = input.value.trim();
            if (!newName) return;
            self.plugin.currentUser.categories[idx] = newName;
            for (const it of self.plugin.currentUser.items) {
              if (it.category === oldName) it.category = newName;
            }
            await self.plugin.saveSettings();
            renderItems();
          };
          const delBtn = row.createEl("button", { cls: "settings-delete-btn", text: "🗑" });
          delBtn.onclick = async () => {
            const removedCat = self.plugin.currentUser.categories[idx];
            if (!confirm("确定删除分类「" + removedCat + "」吗？该分类下的项目将自动归入第一个分类。")) return;
            try {
              self.plugin.currentUser.categories.splice(idx, 1);
              const fallback = self.plugin.currentUser.categories[0] || "其他";
              for (const it of self.plugin.currentUser.items) {
                if (it.category === removedCat) it.category = fallback;
              }
              await self.plugin.saveSettings();
              renderCategories();
              renderItems();
            } catch (e) {
              new Notice("❌ 删除失败：" + (e instanceof Error ? e.message : String(e)));
            }
          };
          catDrag.rows.push(row);
        })(ci);
      }
    };
    renderCategories();

    new Setting(containerEl)
      .setName("添加分类")
      .addButton((btn) =>
        btn
          .setButtonText("＋ 新分类")
          .setCta()
          .onClick(async () => {
            self.plugin.currentUser.categories.push("新分类");
            await self.plugin.saveSettings();
            renderCategories();
            renderItems();
          })
      );

    new Setting(containerEl)
      .setName("保存并刷新")
      .setDesc("保存分类修改，刷新下方打分项目的分类下拉菜单")
      .addButton((btn) =>
        btn.setButtonText("🔄 保存并刷新").onClick(async () => {
          await self.plugin.saveSettings();
          renderCategories();
          renderItems();
          new Notice("✅ 分类已保存，打分项目已刷新");
        })
      );

    containerEl.createEl("h3", { text: "📝 打分项目管理" });
    containerEl.createEl("p", { cls: "kid-score-hint", text: "点击表情按钮打开emoji选择器。按住 ☰ 拖动排序。" });

    const itemsWrap = containerEl.createDiv({ cls: "kid-score-settings-items" });
    const dragState = {
      dragging: false,
      dragIdx: -1,
      placeholder: null as HTMLElement | null,
      ghost: null as HTMLElement | null,
      startY: 0,
      rows: [] as HTMLElement[],
    };
    const getDragRowIndex = (y: number) => {
      for (let r = 0; r < dragState.rows.length; r++) {
        const rect = dragState.rows[r].getBoundingClientRect();
        if (y < rect.top + rect.height / 2) return r;
      }
      return dragState.rows.length;
    };
    const onDragMove = (clientY: number) => {
      if (!dragState.dragging) return;
      if (dragState.ghost) dragState.ghost.style.top = clientY - 20 + "px";
      const targetIdx = getDragRowIndex(clientY);
      const parent = dragState.rows[0].parentElement;
      if (!parent || !dragState.placeholder) return;
      if (targetIdx >= dragState.rows.length) {
        parent.appendChild(dragState.placeholder);
      } else {
        parent.insertBefore(dragState.placeholder, dragState.rows[targetIdx]);
      }
    };
    const onDragEnd = (clientY: number) => {
      if (!dragState.dragging) return;
      dragState.dragging = false;
      if (dragState.ghost) dragState.ghost.remove();
      if (dragState.placeholder) dragState.placeholder.remove();
      document.body.style.userSelect = "";
      (document.body.style as any).webkitUserSelect = "";
      const targetIdx = getDragRowIndex(clientY);
      let fromIdx = dragState.dragIdx;
      if (targetIdx > fromIdx) fromIdx--;
      const arr = self.plugin.currentUser.items;
      if (fromIdx !== targetIdx && fromIdx >= 0 && targetIdx >= 0 && targetIdx < arr.length) {
        const moved = arr.splice(fromIdx, 1)[0];
        arr.splice(targetIdx, 0, moved);
        (async () => {
          await self.plugin.saveSettings();
          renderItems();
        })();
      } else {
        renderItems();
      }
    };
    const pointerMoveHandler = (e: PointerEvent) => {
      onDragMove(e.clientY);
    };
    const pointerUpHandler = (e: PointerEvent) => {
      document.removeEventListener("pointermove", pointerMoveHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
      document.removeEventListener("pointercancel", pointerCancelHandler);
      onDragEnd(e.clientY);
    };
    const pointerCancelHandler = () => {
      document.removeEventListener("pointermove", pointerMoveHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
      document.removeEventListener("pointercancel", pointerCancelHandler);
      dragState.dragging = false;
      if (dragState.ghost) {
        dragState.ghost.remove();
        dragState.ghost = null;
      }
      if (dragState.placeholder) {
        dragState.placeholder.remove();
        dragState.placeholder = null;
      }
      document.body.style.userSelect = "";
      (document.body.style as any).webkitUserSelect = "";
      renderItems();
    };

    const renderItems = () => {
      itemsWrap.empty();
      dragState.rows = [];
      if (self.plugin.currentUser.items.length === 0) {
        itemsWrap.createEl("p", { cls: "kid-score-hint", text: "还没有项目，点击下方添加！" });
        return;
      }
      const headerRow = itemsWrap.createDiv({ cls: "settings-item-row-v2 header-row" });
      ["☰", "表情", "名称", "分类", "分值", ""].forEach((h) => {
        headerRow.createSpan({ text: h, cls: "col-header" });
      });
      let lastCat: string | null = null;
      for (let i = 0; i < self.plugin.currentUser.items.length; i++) {
        ((idx: number) => {
          const item = self.plugin.currentUser.items[idx];
          const thisCat = item.category || "其他";
          if (thisCat !== lastCat) {
            lastCat = thisCat;
            const groupHeader = itemsWrap.createDiv({ cls: "settings-cat-group-header" });
            groupHeader.createSpan({ text: thisCat });
          }
          const wrap = itemsWrap.createDiv({ cls: "settings-item-wrap" });
          wrap.dataset.itemId = item.id;
          const row = wrap.createDiv({ cls: "settings-item-row-v2" });
          row.dataset.idx = String(idx);
          const handle = row.createEl("span", { cls: "settings-drag-handle", text: "☰" });
          handle.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            dragState.dragging = true;
            dragState.dragIdx = idx;
            dragState.rows = Array.from(itemsWrap.querySelectorAll(".settings-item-wrap")) as HTMLElement[];
            dragState.startY = e.clientY;
            const rect = wrap.getBoundingClientRect();
            const ghost = wrap.cloneNode(true) as HTMLElement;
            ghost.className = "settings-item-wrap settings-drag-ghost";
            ghost.style.cssText =
              "position:fixed;left:" +
              rect.left +
              "px;top:" +
              (e.clientY - 20) +
              "px;width:" +
              rect.width +
              "px;z-index:10000;opacity:0.85;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);background:var(--background-primary);border-radius:8px;padding:4px;";
            document.body.appendChild(ghost);
            dragState.ghost = ghost;
            const ph = document.createElement("div");
            ph.className = "settings-drag-placeholder";
            ph.style.cssText =
              "height:" +
              rect.height +
              "px;border:2px dashed var(--interactive-accent);border-radius:8px;margin:2px 0;background:var(--background-secondary);opacity:0.5;";
            if (wrap.parentElement) wrap.parentElement.insertBefore(ph, wrap);
            dragState.placeholder = ph;
            wrap.style.display = "none";
            document.body.style.userSelect = "none";
            (document.body.style as any).webkitUserSelect = "none";
            document.addEventListener("pointermove", pointerMoveHandler);
            document.addEventListener("pointerup", pointerUpHandler);
            document.addEventListener("pointercancel", pointerCancelHandler);
          });
          const emojiBtn = row.createEl("button", { cls: "settings-emoji-btn", text: item.emoji });
          emojiBtn.onclick = () => {
            showEmojiPicker(async (em: string) => {
              self.plugin.currentUser.items[idx].emoji = em;
              await self.plugin.saveSettings();
              emojiBtn.textContent = em;
            });
          };
          const nameInput = row.createEl("input", { cls: "settings-name-input" });
          nameInput.type = "text";
          nameInput.value = item.name;
          bindSettingsInput(nameInput);
          nameInput.onchange = async () => {
            self.plugin.currentUser.items[idx].name = nameInput.value;
            await self.plugin.saveSettings();
          };
          const catSelect = row.createEl("select", { cls: "settings-cat-select" });
          const cats = self.plugin.currentUser.categories || [];
          for (const c of cats) {
            const opt = catSelect.createEl("option", { text: c, value: c });
            if (item.category === c) opt.selected = true;
          }
          catSelect.onchange = async () => {
            self.plugin.currentUser.items[idx].category = catSelect.value;
            const cats2 = self.plugin.currentUser.categories || [];
            self.plugin.currentUser.items.sort((a, b) => {
              let ai = cats2.indexOf(a.category);
              if (ai === -1) ai = 9999;
              let bi = cats2.indexOf(b.category);
              if (bi === -1) bi = 9999;
              return ai - bi;
            });
            await self.plugin.saveSettings();
            renderItems();
          };
          const pointsInput = row.createEl("input", { cls: "settings-points-input" });
          pointsInput.type = "number";
          pointsInput.value = String(item.points);
          bindSettingsInput(pointsInput);
          pointsInput.onchange = async () => {
            self.plugin.currentUser.items[idx].points = parseInt(pointsInput.value) || 0;
            await self.plugin.saveSettings();
          };
          const del = row.createEl("button", { text: "🗑", cls: "settings-delete-btn" });
          del.onclick = async () => {
            if (!confirm("确定删除打分项「" + item.name + "」吗？")) return;
            try {
              self.plugin.currentUser.items.splice(idx, 1);
              await self.plugin.saveSettings();
              renderItems();
            } catch (e) {
              new Notice("❌ 删除失败：" + (e instanceof Error ? e.message : String(e)));
            }
          };
          const noteRow = wrap.createDiv({ cls: "settings-item-note-row" });
          const noteInput = noteRow.createEl("textarea", { cls: "settings-note-input" });
          noteInput.placeholder = "备注（可选），支持多行";
          noteInput.value = item.note || "";
          noteInput.rows = 1;
          const autoResize = (ta: HTMLTextAreaElement) => {
            ta.style.height = "auto";
            ta.style.height = ta.scrollHeight + "px";
          };
          autoResize(noteInput);
          noteInput.addEventListener("input", () => autoResize(noteInput));
          noteInput.addEventListener("focus", () => autoResize(noteInput));
          bindSettingsInput(noteInput);
          noteInput.addEventListener("change", async () => {
            self.plugin.currentUser.items[idx].note = noteInput.value;
            await self.plugin.saveSettings();
          });
          dragState.rows.push(wrap);
        })(i);
      }
      const groupHeaders = Array.from(itemsWrap.querySelectorAll(".settings-cat-group-header")) as HTMLElement[];
      groupHeaders.forEach((header, hi) => {
        const cat = header.querySelector("span")?.textContent || "";
        const nextSibling = groupHeaders[hi + 1] || null;
        const addBtn = document.createElement("button");
        addBtn.className = "settings-cat-add-btn";
        addBtn.textContent = "+ 在「" + cat + "」添加项目";
        ((c: string) => {
          addBtn.onclick = async () => {
            try {
              const newItemId = "item_" + Date.now();
              self.plugin.currentUser.items.push({
                id: newItemId,
                name: "新项目",
                points: 1,
                emoji: "⭐",
                category: c,
                note: "",
              });
              const cats2 = self.plugin.currentUser.categories || [];
              self.plugin.currentUser.items.sort((a, b) => {
                let ai = cats2.indexOf(a.category);
                if (ai === -1) ai = 9999;
                let bi = cats2.indexOf(b.category);
                if (bi === -1) bi = 9999;
                return ai - bi;
              });
              await self.plugin.saveSettings();
              pendingScrollItemId = newItemId;
              renderItems();
            } catch (e) {
              new Notice("❌ 添加失败：" + (e instanceof Error ? e.message : String(e)));
            }
          };
        })(cat);
        if (nextSibling) {
          itemsWrap.insertBefore(addBtn, nextSibling);
        } else {
          itemsWrap.appendChild(addBtn);
        }
      });
      if (pendingScrollItemId) {
        requestAnimationFrame(() => {
          const newItemEl = itemsWrap.querySelector<HTMLElement>(
            '.settings-item-wrap[data-item-id="' + pendingScrollItemId + '"]'
          );
          if (newItemEl) {
            newItemEl.scrollIntoView({ block: "center", behavior: "smooth" });
            newItemEl.addClass("is-new-item");
            window.setTimeout(() => newItemEl.removeClass("is-new-item"), 1600);
          }
          pendingScrollItemId = null;
        });
      }
    };
    renderItems();

    new Setting(containerEl)
      .setName("添加新项目")
      .addButton((btn) =>
        btn
          .setButtonText("＋ 添加项目")
          .setCta()
          .onClick(async () => {
            const defaultCat = self.plugin.currentUser.categories[0] || "加分项";
            const newItemId = "item_" + Date.now();
            self.plugin.currentUser.items.push({
              id: newItemId,
              name: "新项目",
              points: 1,
              emoji: "⭐",
              category: defaultCat,
              note: "",
            });
            const cats = self.plugin.currentUser.categories || [];
            self.plugin.currentUser.items.sort((a, b) => {
              let ai = cats.indexOf(a.category);
              if (ai === -1) ai = 9999;
              let bi = cats.indexOf(b.category);
              if (bi === -1) bi = 9999;
              return ai - bi;
            });
            await self.plugin.saveSettings();
            pendingScrollItemId = newItemId;
            renderItems();
          })
      )
      .addButton((btn) =>
        btn.setButtonText("📂 按分类排序").onClick(async () => {
          const cats = self.plugin.currentUser.categories || [];
          self.plugin.currentUser.items.sort((a, b) => {
            let ai = cats.indexOf(a.category);
            if (ai === -1) ai = 9999;
            let bi = cats.indexOf(b.category);
            if (bi === -1) bi = 9999;
            return ai - bi;
          });
          await self.plugin.saveSettings();
          renderItems();
          new Notice("✅ 已按分类排序");
        })
      );

    function renderRulesAndTemplateSections() {
      const settingsRulesSection = containerEl.createDiv({ cls: "kid-score-rules-section" });
      const settingsRulesHeader = settingsRulesSection.createDiv({ cls: "kid-score-rules-header" });
      const settingsRulesToggle = settingsRulesHeader.createEl("span", { cls: "kid-score-rules-toggle", text: "▶" });
      settingsRulesHeader.createEl("span", { cls: "kid-score-rules-title", text: "📋 打分规则" });
      settingsRulesHeader.createSpan({ cls: "kid-score-rules-desc", text: "修改后同步到打分页" });
      const settingsRulesEditBtn = settingsRulesHeader.createEl("button", { cls: "kid-score-rules-edit-btn", text: "✏️" });
      const settingsRulesBody = settingsRulesSection.createDiv({ cls: "kid-score-rules-body" });
      const settingsRulesView = settingsRulesBody.createDiv({ cls: "kid-score-rules-view" });
      const settingsRulesEdit = settingsRulesBody.createDiv({ cls: "kid-score-rules-edit is-hidden" });
      const settingsRulesTextarea = settingsRulesEdit.createEl("textarea", { cls: "kid-score-rules-textarea" });
      settingsRulesTextarea.placeholder = "例如：\n- 完成作业 +2\n- 主动收拾玩具 +1\n- 乱发脾气 -2";
      settingsRulesTextarea.value = self.plugin.currentUser.scoringRules || "";
      const settingsRulesActRow = settingsRulesEdit.createDiv({ cls: "kid-score-rules-actions" });
      const settingsRulesSaveBtn = settingsRulesActRow.createEl("button", { cls: "mod-cta kid-score-rules-save-btn", text: "保存规则" });
      const settingsRulesCancelBtn = settingsRulesActRow.createEl("button", { cls: "kid-score-rules-cancel-btn", text: "取消" });

      const renderSettingsRules = () => {
        settingsRulesView.empty();
        const text = self.plugin.currentUser.scoringRules || "";
        if (text.trim()) {
          MarkdownRenderer.render(self.app, text, settingsRulesView, "", self.plugin);
        } else {
          settingsRulesView.createEl("p", { cls: "kid-score-rules-empty", text: "暂无规则，点击 ✏️ 添加打分规则" });
        }
      };
      renderSettingsRules();

      let settingsRulesOpen = !!(self.plugin.currentUser.scoringRules && self.plugin.currentUser.scoringRules.trim());
      if (!settingsRulesOpen) {
        settingsRulesBody.addClass("is-hidden");
      } else {
        settingsRulesToggle.textContent = "▼";
      }
      settingsRulesHeader.addEventListener("click", (e) => {
        if (e.target === settingsRulesEditBtn || settingsRulesEditBtn.contains(e.target as Node)) return;
        settingsRulesOpen = !settingsRulesOpen;
        settingsRulesToggle.textContent = settingsRulesOpen ? "▼" : "▶";
        settingsRulesBody.toggleClass("is-hidden", !settingsRulesOpen);
      });
      let settingsRulesIsEditing = false;
      settingsRulesEditBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        settingsRulesIsEditing = !settingsRulesIsEditing;
        if (settingsRulesIsEditing) {
          settingsRulesOpen = true;
          settingsRulesToggle.textContent = "▼";
          settingsRulesBody.removeClass("is-hidden");
          settingsRulesTextarea.value = self.plugin.currentUser.scoringRules || "";
          settingsRulesView.addClass("is-hidden");
          settingsRulesEdit.removeClass("is-hidden");
          settingsRulesTextarea.focus();
        } else {
          settingsRulesView.removeClass("is-hidden");
          settingsRulesEdit.addClass("is-hidden");
        }
      });
      settingsRulesSaveBtn.addEventListener("click", async () => {
        self.plugin.currentUser.scoringRules = settingsRulesTextarea.value;
        await self.plugin.saveSettings();
        renderSettingsRules();
        settingsRulesIsEditing = false;
        settingsRulesView.removeClass("is-hidden");
        settingsRulesEdit.addClass("is-hidden");
        new Notice("✅ 规则已保存");
      });
      settingsRulesCancelBtn.addEventListener("click", () => {
        settingsRulesIsEditing = false;
        settingsRulesView.removeClass("is-hidden");
        settingsRulesEdit.addClass("is-hidden");
      });

      const tmplSection = containerEl.createDiv({ cls: "kid-score-rules-section" });
      const tmplHeader = tmplSection.createDiv({ cls: "kid-score-rules-header" });
      const tmplToggle = tmplHeader.createEl("span", { cls: "kid-score-rules-toggle", text: "▶" });
      tmplHeader.createEl("span", { cls: "kid-score-rules-title", text: "📝 日记模板" });
      tmplHeader.createSpan({ cls: "kid-score-rules-desc", text: "支持 Markdown，修改后同步到打分页" });
      const tmplEditBtn = tmplHeader.createEl("button", { cls: "kid-score-rules-edit-btn", text: "✏️" });
      const tmplBody = tmplSection.createDiv({ cls: "kid-score-rules-body" });
      const tmplView = tmplBody.createDiv({ cls: "kid-score-rules-view" });
      const tmplEdit = tmplBody.createDiv({ cls: "kid-score-rules-edit is-hidden" });
      const tmplTextarea = tmplEdit.createEl("textarea", { cls: "kid-score-rules-textarea" });
      tmplTextarea.value = self.plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
      tmplTextarea.style.minHeight = "220px";
      const tmplPreviewWrap = tmplEdit.createDiv({ cls: "diary-preview-wrap diary-preview-settings" });
      tmplPreviewWrap.style.display = "none";
      const tmplActRow = tmplEdit.createDiv({ cls: "kid-score-rules-actions" });
      const tmplPreviewBtn = tmplActRow.createEl("button", { cls: "kid-score-rules-cancel-btn", text: "MD预览" });
      const tmplSaveBtn = tmplActRow.createEl("button", { cls: "mod-cta kid-score-rules-save-btn", text: "保存模板" });
      const tmplCancelBtn = tmplActRow.createEl("button", { cls: "kid-score-rules-cancel-btn", text: "取消" });

      const renderTemplateView = () => {
        tmplView.empty();
        const text = self.plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
        MarkdownRenderer.render(self.app, text, tmplView, "", self.plugin);
      };
      renderTemplateView();
      let tmplOpen = true;
      tmplToggle.textContent = "▼";
      let tmplIsEditing = false;
      let tmplIsPreview = false;
      const refreshTemplatePreview = () => {
        tmplPreviewWrap.empty();
        MarkdownRenderer.render(
          self.app,
          tmplTextarea.value || "_还没有内容_",
          tmplPreviewWrap,
          "",
          self.plugin
        );
      };
      tmplHeader.addEventListener("click", (e) => {
        if (e.target === tmplEditBtn || tmplEditBtn.contains(e.target as Node)) return;
        tmplOpen = !tmplOpen;
        tmplToggle.textContent = tmplOpen ? "▼" : "▶";
        tmplBody.toggleClass("is-hidden", !tmplOpen);
      });
      tmplEditBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tmplIsEditing = !tmplIsEditing;
        if (tmplIsEditing) {
          tmplOpen = true;
          tmplToggle.textContent = "▼";
          tmplBody.removeClass("is-hidden");
          tmplTextarea.value = self.plugin.currentUser.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
          tmplView.addClass("is-hidden");
          tmplEdit.removeClass("is-hidden");
          tmplIsPreview = false;
          tmplPreviewWrap.style.display = "none";
          tmplPreviewBtn.textContent = "MD预览";
          tmplTextarea.focus();
        } else {
          tmplView.removeClass("is-hidden");
          tmplEdit.addClass("is-hidden");
        }
      });
      tmplPreviewBtn.addEventListener("click", () => {
        tmplIsPreview = !tmplIsPreview;
        if (tmplIsPreview) {
          refreshTemplatePreview();
          tmplPreviewWrap.style.display = "";
          tmplPreviewBtn.textContent = "关闭预览";
        } else {
          tmplPreviewWrap.style.display = "none";
          tmplPreviewBtn.textContent = "MD预览";
        }
      });
      tmplTextarea.addEventListener("input", () => {
        if (!tmplIsPreview) return;
        refreshTemplatePreview();
      });
      tmplSaveBtn.addEventListener("click", async () => {
        self.plugin.currentUser.diaryTemplate = tmplTextarea.value;
        await self.plugin.saveSettings();
        renderTemplateView();
        tmplIsEditing = false;
        tmplIsPreview = false;
        tmplPreviewWrap.style.display = "none";
        tmplPreviewBtn.textContent = "MD预览";
        tmplView.removeClass("is-hidden");
        tmplEdit.addClass("is-hidden");
        new Notice("✅ 日记模板已保存");
      });
      tmplCancelBtn.addEventListener("click", () => {
        tmplIsEditing = false;
        tmplIsPreview = false;
        tmplPreviewWrap.style.display = "none";
        tmplPreviewBtn.textContent = "MD预览";
        tmplView.removeClass("is-hidden");
        tmplEdit.addClass("is-hidden");
      });
    }

    containerEl.createEl("h3", { text: "📦 导出 / 导入配置" });
    new Setting(containerEl)
      .setName("导出打分项配置")
      .setDesc("将所有分类和打分项导出为 JSON 文件")
      .addButton((btn) => {
        btn.setButtonText("📤 导出").onClick(() => {
          const data = { categories: self.plugin.currentUser.categories, items: self.plugin.currentUser.items };
          const json = JSON.stringify(data, null, 2);
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "little-milestones-config.json";
          a.click();
          URL.revokeObjectURL(url);
        });
      });

    new Setting(containerEl)
      .setName("导入打分项配置")
      .setDesc("从 JSON 文件导入分类和打分项（将覆盖现有配置）")
      .addButton((btn) => {
        btn.setButtonText("📥 导入").onClick(() => {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = ".json";
          fileInput.onchange = async () => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            try {
              const text = await file.text();
              const data = JSON.parse(text);
              if (Array.isArray(data.items)) self.plugin.currentUser.items = data.items;
              if (Array.isArray(data.categories)) self.plugin.currentUser.categories = data.categories;
              await self.plugin.saveSettings();
              self.display();
              new Notice("✅ 配置导入成功");
            } catch (e) {
              new Notice("❌ JSON 格式有误，导入失败");
            }
          };
          fileInput.click();
        });
      });
  }
}

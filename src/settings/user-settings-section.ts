import { App, Modal, Notice, Setting } from "obsidian";
import { makeDefaultUser } from "../constants";
import type KidScorePlugin from "../main";
import { attachPressGesture } from "../modals/helpers/press-gesture";
import { bindModalInputFocus } from "../utils/dom";
import { setupModalKeyboard } from "../utils/mobile";

interface RenderUserSettingsSectionOptions {
  app: App;
  plugin: KidScorePlugin;
  containerEl: HTMLElement;
  bindSettingsInput: (input: HTMLElement | null) => void;
  refresh: () => void;
}

export function renderUserSettingsSection({
  app,
  plugin,
  containerEl,
  bindSettingsInput,
  refresh,
}: RenderUserSettingsSectionOptions): void {
  containerEl.createEl("h3", { text: "👥 用户管理" });
  containerEl.createEl("p", {
    cls: "kid-score-hint",
    text: "点击用户名切换，长按用户名可删除该用户。",
  });

  const userMgrWrap = containerEl.createDiv({ cls: "kid-score-settings-users" });

  const showUserDeleteConfirm = (user: ReturnType<typeof makeDefaultUser>) => {
    const deleteModal = new (class extends Modal {
      _kbCleanup?: ReturnType<typeof setupModalKeyboard>;
      onOpen() {
        this.titleEl.setText("⚠️ 删除用户");
        this.modalEl.addClass("kid-score-edit-modal");
        this._kbCleanup = setupModalKeyboard(this);
        const content = this.contentEl;
        content.createDiv({
          cls: "value-popup-hint",
          text:
            "将删除「" +
            user.name +
            "」的所有设置，已保存的记录文件不受影响。",
        });
        const promptEl = content.createDiv();
        promptEl.style.marginBottom = "6px";
        promptEl.style.fontSize = "0.9em";
        promptEl.textContent = "请输入『确定删除』继续：";
        const confirmInput = content.createEl("input", {
          type: "text",
          cls: "custom-form-name-input",
        });
        confirmInput.placeholder = "确定删除";
        confirmInput.autocomplete = "off";
        bindModalInputFocus(confirmInput);

        const actions = content.createDiv({ cls: "value-popup-actions" });
        actions.style.marginTop = "12px";
        const cancelBtn = actions.createEl("button", {
          cls: "value-popup-cancel",
          text: "取消",
        });
        cancelBtn.onclick = () => this.close();
        const deleteBtn = actions.createEl("button", {
          cls: "value-popup-confirm",
          text: "删除",
        });
        deleteBtn.style.background = "var(--color-red, #e03131)";
        deleteBtn.style.color = "#fff";
        deleteBtn.onclick = async () => {
          if (confirmInput.value.trim() !== "确定删除") {
            confirmInput.classList.add("is-error");
            confirmInput.focus();
            return;
          }
          try {
            const users = plugin.settings.users;
            const idx = users.findIndex((item) => item.id === user.id);
            if (idx !== -1 && users.length > 1) {
              users.splice(idx, 1);
              plugin.settings.currentUserId = users[Math.max(0, idx - 1)].id;
              await plugin.saveSettings();
              this.close();
              refresh();
            }
          } catch (error) {
            new Notice(
              "❌ 删除失败：" +
                (error instanceof Error ? error.message : String(error))
            );
          }
        };
      }
      onClose() {
        if (this._kbCleanup) this._kbCleanup();
        this.contentEl.empty();
      }
    })(app);
    deleteModal.open();
  };

  const renderUserMgr = () => {
    userMgrWrap.empty();
    plugin.settings.users.forEach((user) => {
      const userBtn = userMgrWrap.createEl("button", {
        cls:
          "kid-score-user-btn" +
          (user.id === plugin.settings.currentUserId ? " is-active" : ""),
        text: user.name,
      });
      attachPressGesture({
        element: userBtn,
        longPressMs: 600,
        isTouchMode: true,
        onLongPress: () => {
          if (plugin.settings.users.length > 1) {
            showUserDeleteConfirm(user as ReturnType<typeof makeDefaultUser>);
          }
        },
        onSingleTap: () => {
          plugin.settings.currentUserId = user.id;
          plugin.saveSettings().then(() => refresh());
        },
      });
    });

    const addUserBtn = userMgrWrap.createEl("button", {
      cls: "kid-score-user-add-btn",
      text: "＋ 添加用户",
    });
    addUserBtn.onclick = async () => {
      try {
        const newUser = makeDefaultUser();
        newUser.name = "新用户";
        plugin.settings.users.push(newUser);
        plugin.settings.currentUserId = newUser.id;
        await plugin.saveSettings();
        refresh();
      } catch (error) {
        new Notice(
          "❌ 添加用户失败：" +
            (error instanceof Error ? error.message : String(error))
        );
      }
    };
  };

  renderUserMgr();

  new Setting(containerEl)
    .setName("姓名")
    .setDesc("当前用户的显示名字")
    .addText((text) =>
      text
        .setPlaceholder("王靖辰")
        .setValue(plugin.currentUser.name)
        .onChange(async (value) => {
          const newName = value.trim() || "未命名";
          const oldName = plugin.currentUser.name;
          if (newName === oldName) return;
          if (!confirm("确定将用户名修改为「" + newName + "」吗？")) return;
          try {
            await plugin.renameUserInFiles(oldName, newName);
            plugin.currentUser.name = newName;
            await plugin.saveSettings();
            renderUserMgr();
            new Notice("✅ 用户名已更新，历史记录中的名称已同步替换");
          } catch (error) {
            console.error("[Little Milestones] renameUserInFiles error", error);
            new Notice(
              "❌ " +
                (error instanceof Error ? error.message : String(error))
            );
          }
        })
    );
  bindSettingsInput(containerEl.querySelector(".setting-item:last-child input"));

  new Setting(containerEl)
    .setName("记录保存路径")
    .setDesc("每日打分 Markdown 文件存放的文件夹")
    .addText((text) =>
      text
        .setPlaceholder("Little Milestones/Daily Records")
        .setValue(plugin.currentUser.savePath)
        .onChange(async (value) => {
          const newPath = value.trim() || "Little Milestones/Daily Records";
          const oldPath = plugin.currentUser.savePath;
          if (newPath === oldPath) return;
          if (
            !confirm(
              "确定将记录保存路径修改为「" +
                newPath +
                "」吗？\n已有的历史记录将自动迁移到新路径。"
            )
          ) {
            return;
          }
          try {
            await plugin.migrateSavePath(oldPath, newPath);
            plugin.currentUser.savePath = newPath;
            await plugin.saveSettings();
            new Notice("✅ 保存路径已修改，历史记录已自动迁移");
          } catch (error) {
            console.error("[Little Milestones] migrateSavePath error", error);
            new Notice(
              "❌ " +
                (error instanceof Error ? error.message : String(error))
            );
          }
        })
    );
  bindSettingsInput(containerEl.querySelector(".setting-item:last-child input"));
}

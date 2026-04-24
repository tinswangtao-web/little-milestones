import { Modal, App } from "obsidian";

export interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export class ConfirmModal extends Modal {
  constructor(app: App, private options: ConfirmModalOptions) {
    super(app);
  }

  onOpen(): void {
    const {
      title,
      message,
      confirmText = "确定",
      cancelText = "取消",
      isDestructive,
      onConfirm,
      onCancel,
    } = this.options;
    this.titleEl.setText(title);

    const content = this.contentEl;
    content.createEl("p", { text: message, cls: "confirm-modal-message" });

    const actions = content.createDiv({ cls: "confirm-modal-actions" });
    const cancelBtn = actions.createEl("button", {
      text: cancelText,
      cls: "confirm-modal-cancel",
    });
    cancelBtn.onclick = () => {
      this.close();
      onCancel?.();
    };

    const confirmBtn = actions.createEl("button", {
      text: confirmText,
      cls:
        "confirm-modal-confirm" + (isDestructive ? " is-destructive" : ""),
    });
    confirmBtn.onclick = () => {
      this.close();
      onConfirm();
    };
  }
}

export function showConfirmModal(app: App, options: ConfirmModalOptions): void {
  new ConfirmModal(app, options).open();
}

import { Component } from "../../components/base/Component";
import { eventBus } from "../../utils/event-bus";

export class ModalView extends Component<{}> {
  private modalEl: HTMLElement;
  private contentEl: HTMLElement;
  private closeBtn: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.modalEl = container;
    this.contentEl = container.querySelector(".modal__content") as HTMLElement;
    this.closeBtn = container.querySelector(".modal__close") as HTMLElement;

    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);

    this.modalEl.addEventListener("click", this.onOutsideClick);
    this.closeBtn.addEventListener("click", this.onCloseClick);
  }

  set content(node: HTMLElement | null) {
    if (!this.contentEl) return;
    this.contentEl.replaceChildren(node ?? document.createTextNode(""));
  }

  open(): void {
    this.modalEl.classList.add("modal_active");
    document.body.style.overflow = "hidden";
  }

  close(): void {
    this.modalEl.classList.remove("modal_active");
    document.body.style.overflow = "";
    this.content = null;
    eventBus.emit("view:modal:closed", undefined);
  }

  // ✅ Добавляем метод getContainer
  getContainer(): HTMLElement {
    return this.container;
  }

  private onOutsideClick(e: MouseEvent) {
    if (e.target === this.modalEl) {
      this.close();
    }
  }

  private onCloseClick() {
    this.close();
  }
}
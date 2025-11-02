// src/components/Views/HeaderView.ts
import { Component } from "../../components/base/Component";
import { eventBus } from "../../utils/event-bus";

export class HeaderView extends Component<{}> {
  private counterEl: HTMLElement | null;
  private basketBtn: HTMLButtonElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.counterEl = container.querySelector(".header__basket-counter");
    this.basketBtn = container.querySelector(
      ".header__basket"
    ) as HTMLButtonElement | null;
    this.onBasketClick = this.onBasketClick.bind(this);
    this.basketBtn?.addEventListener("click", this.onBasketClick);
  }

  setCounter(value: number) {
    if (this.counterEl) this.counterEl.textContent = String(value);
  }

  private onBasketClick() {
    eventBus.emit("view:open:cart", undefined);
  }
}

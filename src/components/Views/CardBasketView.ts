// src/components/Views/CardBasketView.ts
import { CardBase } from "./CardBase";
import { IProduct } from "../../types";
import { eventBus } from "../../utils/event-bus";

export class CardBasketView extends CardBase {
  private titleEl: HTMLElement | null;
  private priceEl: HTMLElement | null;
  private delBtn: HTMLButtonElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.titleEl = container.querySelector(".card__title");
    this.priceEl = container.querySelector(".card__price");
    this.delBtn = container.querySelector(
      ".basket__item-delete"
    ) as HTMLButtonElement | null;

    this.onDelete = this.onDelete.bind(this);
    this.delBtn?.addEventListener("click", this.onDelete);
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data) this.product = data as IProduct;
    if (!this.product) return this.root;

    if (this.titleEl) this.titleEl.textContent = this.product.title;
    if (this.priceEl)
      this.priceEl.textContent = `${this.product.price ?? 0} синапсов`;
    return this.root;
  }

  private onDelete(e: Event) {
    e.stopPropagation();
    eventBus.emit("view:cart:remove", { id: this.product.id });
  }
}

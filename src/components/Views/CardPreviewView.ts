// src/components/Views/CardPreviewView.ts
import { CardBase } from "./CardBase";
import { IProduct } from "../../types";
import { eventBus } from "../../utils/event-bus";

export class CardPreviewView extends CardBase {
  private imgEl: HTMLImageElement | null;
  private titleEl: HTMLElement | null;
  private textEl: HTMLElement | null;
  private priceEl: HTMLElement | null;
  private buyBtn: HTMLButtonElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.imgEl = container.querySelector(
      ".card__image"
    ) as HTMLImageElement | null;
    this.titleEl = container.querySelector(".card__title");
    this.textEl = container.querySelector(".card__text");
    this.priceEl = container.querySelector(".card__price");
    this.buyBtn = container.querySelector(
      ".card__button"
    ) as HTMLButtonElement | null;

    this.onBuyClick = this.onBuyClick.bind(this);
    this.buyBtn?.addEventListener("click", this.onBuyClick);
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data) this.product = data as IProduct;
    if (!this.product) return this.root;

    if (this.titleEl) this.titleEl.textContent = this.product.title;
    if (this.textEl) this.textEl.textContent = this.product.description;
    if (this.priceEl)
      this.priceEl.textContent = this.product.price
        ? `${this.product.price} синапсов`
        : "Бесценно";
    this.setImage(this.imgEl, this.product.image);
    this.setCategory(
      this.root.querySelector(".card__category") as HTMLElement,
      this.product.category
    );

    // button state
    if (!this.product.price) {
      this.buyBtn?.setAttribute("disabled", "true");
      if (this.buyBtn) this.buyBtn.textContent = "Недоступно";
    } else {
      this.buyBtn?.removeAttribute("disabled");
      if (this.buyBtn) this.buyBtn.textContent = "В корзину";
    }

    
    return this.root;
  }

  private onBuyClick(e: Event) {
    e.stopPropagation();
    eventBus.emit("view:product:toggle-cart", { id: this.product.id });
  
    eventBus.emit("view:modal:close", undefined);
  }
}

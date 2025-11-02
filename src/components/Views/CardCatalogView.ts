// src/components/Views/CardCatalogView.ts
import { CardBase } from "./CardBase";
import { IProduct } from "../../types";

export class CardCatalogView extends CardBase {
  private titleEl: HTMLElement | null;
  private imgEl: HTMLImageElement | null;
  private priceEl: HTMLElement | null;
  private categoryEl: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.titleEl = container.querySelector(".card__title");
    this.imgEl = container.querySelector(
      ".card__image"
    ) as HTMLImageElement | null;
    this.priceEl = container.querySelector(".card__price");
    this.categoryEl = container.querySelector(".card__category");
 
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data) this.product = data as IProduct;
    if (!this.product) return this.root;

    if (this.titleEl) this.titleEl.textContent = this.product.title;
    if (this.priceEl)
      this.priceEl.textContent = this.product.price
        ? `${this.product.price} синапсов`
        : "Недоступно";
    this.setImage(this.imgEl, this.product.image);
    this.setCategory(this.categoryEl, this.product.category);

    this.bindOpenByRoot();
    return this.root;
  }
}

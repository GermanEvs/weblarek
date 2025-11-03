import { CardBase } from "./CardBase";
import { IProduct } from "../../types";

export class CardCatalogView extends CardBase {
  private titleEl: HTMLElement;
  private imgEl: HTMLImageElement;
  private priceEl: HTMLElement;
  private categoryEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleEl = container.querySelector(".card__title") as HTMLElement;
    this.imgEl = container.querySelector(".card__image") as HTMLImageElement;
    this.priceEl = container.querySelector(".card__price") as HTMLElement;
    this.categoryEl = container.querySelector(".card__category") as HTMLElement;
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (!data) return this.root;

    this.titleEl.textContent = data.title || '';
    this.priceEl.textContent = data.price ? `${data.price} синапсов` : "Недоступно";
    
    this.setImage(this.imgEl, data.image, data.title);
    
    if (data.category) {
      this.setCategory(this.categoryEl, data.category);
    }
    
    if (data.id) {
      this.bindOpenByRoot(data.id);
    }

    return this.root;
  }
}
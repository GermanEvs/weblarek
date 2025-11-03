import { CardBase } from "./CardBase";
import { IProduct } from "../../types";
import { eventBus } from "../../utils/event-bus";

interface CardBasketData extends Partial<IProduct> {
  index?: number;
}

export class CardBasketView extends CardBase {
  private titleEl: HTMLElement | null;
  private priceEl: HTMLElement | null;
  private indexEl: HTMLElement | null;
  private delBtn: HTMLButtonElement | null;
  private currentProductId: string | null = null;

  constructor(container: HTMLElement) {
    super(container);
    this.titleEl = container.querySelector(".card__title");
    this.priceEl = container.querySelector(".card__price");
    this.indexEl = container.querySelector(".basket__item-index");
    this.delBtn = container.querySelector(
      ".basket__item-delete"
    ) as HTMLButtonElement | null;

    this.onDelete = this.onDelete.bind(this);
    this.delBtn?.addEventListener("click", this.onDelete);
  }

  render(data?: CardBasketData): HTMLElement {
    if (!data) return this.root;

    if (this.titleEl) this.titleEl.textContent = data.title || '';
    if (this.priceEl) 
      this.priceEl.textContent = `${data.price ?? 0} синапсов`;
    
    if (this.indexEl && data.index !== undefined) {
      this.indexEl.textContent = (data.index + 1).toString();
    }

    this.currentProductId = data.id || null;
    
    // Исправление: проверяем на null перед установкой dataset
    if (this.currentProductId) {
      this.root.dataset.id = this.currentProductId;
    } else {
      delete this.root.dataset.id;
    }

    return this.root;
  }

  private onDelete(e: Event) {
    e.stopPropagation();
    if (this.currentProductId) {
      eventBus.emit("view:cart:remove", { id: this.currentProductId });
    }
  }
}
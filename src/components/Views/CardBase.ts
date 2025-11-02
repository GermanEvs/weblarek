// src/components/Views/CardBase.ts
import { Component } from "../../components/base/Component";
import { IProduct } from "../../types";
import { eventBus } from "../../utils/event-bus";
import { CDN_URL, categoryMap } from "../../utils/constants";

export abstract class CardBase extends Component<IProduct> {
  protected product!: IProduct;
  protected root: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.root = container;
  }

  protected bindOpenByRoot() {
    this.root.addEventListener("click", () => {
      eventBus.emit("view:card:open", { id: this.product.id });
    });
  }

  protected setImage(el: HTMLImageElement | null, fileName?: string | null) {
    if (!el) return;
    if (!fileName) {
      el.removeAttribute("src");
      return;
    }
    el.src = `${CDN_URL}/${fileName}`;
    el.alt = this.product.title;
  }

  protected setCategory(el: HTMLElement | null, category: string) {
    if (!el) return;

    // Исправленная строка - используем type assertion
    const cls =
      categoryMap[category as keyof typeof categoryMap] ||
      categoryMap["другое"];

    el.className = `card__category ${cls}`;
    el.textContent = category;
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data) this.product = data as IProduct;
    return this.root;
  }
}

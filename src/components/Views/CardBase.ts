import { Component } from "../../components/base/Component";
import { IProduct } from "../../types";
import { eventBus } from "../../utils/event-bus";
import { CDN_URL, categoryMap } from "../../utils/constants";

export abstract class CardBase extends Component<IProduct> {
  protected root: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.root = container;
  }

  protected bindOpenByRoot(id: string) {
    this.root.addEventListener("click", () => {
      eventBus.emit("view:card:open", { id });
    });
  }

  protected setImage(el: HTMLImageElement | null, fileName?: string | null, title?: string) {
    if (!el) return;
    if (!fileName) {
      el.removeAttribute("src");
      return;
    }
    el.src = `${CDN_URL}/${fileName}`;
    el.alt = title || '';
  }

  protected setCategory(el: HTMLElement | null, category: string) {
    if (!el) return;

    const cls =
      categoryMap[category as keyof typeof categoryMap] ||
      categoryMap["другое"];

    el.className = `card__category ${cls}`;
    el.textContent = category;
  }

  render(data?: Partial<IProduct>): HTMLElement {
    return this.root;
  }
}
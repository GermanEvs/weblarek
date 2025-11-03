import { Component } from "../../components/base/Component";
import { eventBus } from "../../utils/event-bus";

interface BasketData {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<BasketData> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.listEl = container.querySelector(".basket__list") as HTMLElement;
    this.totalEl = container.querySelector(".basket__price") as HTMLElement;
    this.orderBtn = container.querySelector(
      ".basket__button"
    ) as HTMLButtonElement;

    this.onOrderClick = this.onOrderClick.bind(this);
    this.orderBtn.addEventListener("click", this.onOrderClick);
  }

  render(data?: Partial<BasketData>): HTMLElement {
    if (!data) return this.container;

    const items = data.items || [];
    const total = data.total || 0;

    this.listEl.replaceChildren();
    if (!items.length) {
      this.listEl.textContent = "Корзина пуста";
      this.totalEl.textContent = "0 синапсов";
      this.orderBtn.disabled = true;
    } else {
      this.listEl.replaceChildren(...items);
      this.totalEl.textContent = `${total} синапсов`;
      this.orderBtn.disabled = false;
    }

    return this.container;
  }

  // ✅ Добавляем метод getContainer
  getContainer(): HTMLElement {
    return this.container;
  }

  private onOrderClick() {
    eventBus.emit("view:order:open", undefined);
  }
}
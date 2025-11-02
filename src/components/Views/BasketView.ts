// src/components/Views/BasketView.ts
import { Component } from "../../components/base/Component";
import { CardBasketView } from "./CardBasketView";
import { eventBus } from "../../utils/event-bus";
import { IProduct } from "../../types";

export class BasketView extends Component<{}> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement;
  private tpl: HTMLTemplateElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.listEl = container.querySelector(".basket__list") as HTMLElement;
    this.totalEl = container.querySelector(".basket__price") as HTMLElement;
    this.orderBtn = container.querySelector(
      ".basket__button"
    ) as HTMLButtonElement;
    this.tpl = document.getElementById(
      "card-basket"
    ) as HTMLTemplateElement | null;

    this.onOrderClick = this.onOrderClick.bind(this);
    this.orderBtn.addEventListener("click", this.onOrderClick);
  }

  renderItems(items: IProduct[]) {
    this.listEl.replaceChildren();
    if (!items.length) {
      this.listEl.textContent = "Корзина пуста";
      this.totalEl.textContent = "0 синапсов";
      this.orderBtn.disabled = true;
      return;
    }

    const nodes = items.map((p, idx) => {
      const node = this.tpl!.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;
      const card = new CardBasketView(node);
      card.render(p);
      return node;
    });

    this.listEl.replaceChildren(...nodes);
    this.totalEl.textContent = `${items.reduce(
      (s, p) => s + (p.price ?? 0),
      0
    )} синапсов`;
    this.orderBtn.disabled = false;
  }

  private onOrderClick() {
    eventBus.emit("view:order:open", undefined);
  }
}

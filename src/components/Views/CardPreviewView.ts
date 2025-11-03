import { CardBase } from "./CardBase";
import { IProduct } from "../../types";
import { eventBus } from "../../utils/event-bus";

interface CardPreviewData extends Partial<IProduct> {
  inCart?: boolean;
}

export class CardPreviewView extends CardBase {
  private imgEl: HTMLImageElement | null;
  private titleEl: HTMLElement | null;
  private textEl: HTMLElement | null;
  private priceEl: HTMLElement | null;
  private buyBtn: HTMLButtonElement | null;
  private currentProductId: string | null = null;
  private currentInCart: boolean = false;

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
    this.onCartChanged = this.onCartChanged.bind(this);
    
    this.buyBtn?.addEventListener("click", this.onBuyClick);
    
    // Подписываемся на изменения корзины
    eventBus.on('model:cart:changed', this.onCartChanged);
  }

  render(data?: CardPreviewData): HTMLElement {
    if (!data) return this.root;

    if (this.titleEl) this.titleEl.textContent = data.title || '';
    if (this.textEl) this.textEl.textContent = data.description || '';
    if (this.priceEl) 
      this.priceEl.textContent = data.price 
        ? `${data.price} синапсов` 
        : "Бесценно";
    
    this.setImage(this.imgEl, data.image, data.title);
    this.setCategory(
      this.root.querySelector(".card__category") as HTMLElement,
      data.category || ''
    );

    this.currentProductId = data.id || null;
    this.currentInCart = data.inCart || false;

    this.updateButtonState();

    return this.root;
  }

  private updateButtonState() {
    if (!this.buyBtn) return;

    if (!this.currentProductPrice()) {
      this.buyBtn.setAttribute("disabled", "true");
      this.buyBtn.textContent = "Недоступно";
    } else {
      this.buyBtn.removeAttribute("disabled");
      this.buyBtn.textContent = this.currentInCart ? "Удалить из корзины" : "В корзину";
    }
  }

  private currentProductPrice(): number | null {
    // Простая проверка - если у нас есть данные о продукте, используем их
    // В реальном приложении здесь можно получить продукт из модели
    return this.currentProductId ? 100 : null; // Заглушка
  }

  private onCartChanged(items: any) {
    // Обновляем состояние кнопки при изменении корзины
    if (this.currentProductId && Array.isArray(items)) {
      const wasInCart = this.currentInCart;
      this.currentInCart = items.some((item: any) => item.id === this.currentProductId);
      
      // Обновляем кнопку только если состояние изменилось
      if (wasInCart !== this.currentInCart) {
        this.updateButtonState();
      }
    }
  }

  private onBuyClick(e: Event) {
    e.stopPropagation();
    if (this.currentProductId) {
      eventBus.emit("view:product:toggle-cart", { id: this.currentProductId });
      // Не закрываем модальное окно сразу, чтобы пользователь видел изменение
    }
  }

  // Очистка подписки при уничтожении
  destroy() {
    eventBus.off('model:cart:changed', this.onCartChanged);
  }
}
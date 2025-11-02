// src/components/Models/Cart.ts
import { IProduct } from '../../types';
import { eventBus } from '../../utils/event-bus';

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (!this.items.some(p => p.id === item.id)) {
      this.items.push(item);
      eventBus.emit('model:cart:changed', this.items);
    }
  }

  removeItemById(id: string): void {
    this.items = this.items.filter(p => p.id !== id);
    eventBus.emit('model:cart:changed', this.items);
  }

  clear(): void {
    this.items = [];
    eventBus.emit('model:cart:changed', this.items);
  }

  hasItem(id: string): boolean {
    return this.items.some(p => p.id === id);
  }

  getCount(): number {
    return this.items.length;
  }

  getTotal(): number {
    return this.items.reduce((s, p) => s + (p.price ?? 0), 0);
  }
}

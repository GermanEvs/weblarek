import { IProduct } from '../../types';
import { eventBus } from '../../utils/event-bus';

export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
    eventBus.emit('model:products:changed', this.items);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | null {
    return this.items.find(p => p.id === id) || null;
  }

  setSelectedItemById(id: string): void {
    const it = this.getItemById(id);
    this.setSelectedItem(it);
  }

  setSelectedItem(item: IProduct | null): void {
    this.selectedItem = item;
    eventBus.emit('model:product:selected', this.selectedItem ?? undefined);
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
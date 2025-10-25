
import { IProduct } from "../../types"; // путь к файлу index.ts

export class Cart {
  private items: IProduct[] = [];

  addItem(item: IProduct): void {
    if (!this.items.find(p => p.id === item.id)) this.items.push(item);
  }

  removeItem(item: IProduct): void {
    this.items = this.items.filter(p => p.id !== item.id);
  }

  clear(): void { this.items = []; }

  getItems(): IProduct[] { return this.items; }

  getTotal(): number {
    return this.items.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getCount(): number { return this.items.length; }

  hasItem(id: string): boolean {
    return this.items.some(p => p.id === id);
  }
}


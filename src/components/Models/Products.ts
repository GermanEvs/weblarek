import { IProduct } from "../../types"; // путь к файлу index.ts
export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  // Сохраняем массив товаров
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  // Получаем массив товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Устанавливаем выбранный товар по объекту
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  
  setSelectedItemById(id: string): void {
    const item = this.items.find(p => p.id === id) || null;
    this.selectedItem = item;
  }

  // Получаем выбранный товар
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}


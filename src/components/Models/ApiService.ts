import { IProduct, IBuyer, IOrder, IApi } from "../../types";

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Метод для получения товаров с сервера
  async fetchProducts(): Promise<IProduct[]> {
    const data = await this.api.get<{ items: IProduct[] }>("/product"); // без слеша
    return data.items;
  }

  // Метод для отправки заказа
  async sendOrder(buyer: IBuyer, items: IProduct[]): Promise<{ id: string }> {
    const order: IOrder = {
      payment: buyer.payment,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      total: items.reduce((sum, item) => sum + (item.price || 0), 0),
      items: items.map(item => item.id)
    };
    return await this.api.post<{ id: string }>("/order", order);
  }
}

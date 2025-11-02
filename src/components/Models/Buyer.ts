// src/components/Models/Buyer.ts
import { IBuyer } from '../../types';
import { eventBus } from '../../utils/event-bus';

export class Buyer {
  private data: Partial<IBuyer> = {};

  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    eventBus.emit('model:buyer:changed', this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.data.payment,
      email: this.data.email ?? '',
      phone: this.data.phone ?? '',
      address: this.data.address ?? '',
    };
  }

  clear(): void {
    this.data = {};
    eventBus.emit('model:buyer:changed', this.getData());
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    const d = this.getData();
    if (!d.payment) errors.payment = 'Не выбран вид оплаты';
    if (!d.address) errors.address = 'Укажите адрес';
    if (!d.email) errors.email = 'Укажите емэйл';
    if (!d.phone) errors.phone = 'Укажите телефон';
    return errors;
  }
}

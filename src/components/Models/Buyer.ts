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

  validateOrder(): Record<string, string> {
    const errors: Record<string, string> = {};
    const d = this.getData();
    
    if (!d.payment) errors.payment = 'Не выбран вид оплаты';
    if (!d.address?.trim()) errors.address = 'Укажите адрес';
    
    return errors;
  }

  validateContacts(): Record<string, string> {
    const errors: Record<string, string> = {};
    const d = this.getData();
    
    if (!d.payment) errors.payment = 'Не выбран вид оплаты';
    if (!d.address?.trim()) errors.address = 'Укажите адрес';
    if (!d.email?.trim()) errors.email = 'Укажите емэйл';
    if (!d.phone?.trim()) errors.phone = 'Укажите телефон';
    
    return errors;
  }

  validate(): Record<string, string> {
    return this.validateContacts();
  }
}
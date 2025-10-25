import { IBuyer, TPayment } from "../../types"; // путь к файлу index.ts
// Buyer.ts

export class Buyer {
  private data: IBuyer = {
    payment: 'card', // или null/'' если TPayment позволяет
    email: '',
    phone: '',
    address: ''
  };

  // Сохраняем одно поле
  setPayment(payment: TPayment) {
    this.data.payment = payment;
  }

  setEmail(email: string) {
    this.data.email = email;
  }

  setPhone(phone: string) {
    this.data.phone = phone;
  }

  setAddress(address: string) {
    this.data.address = address;
  }

  // Можно сохранить сразу весь объект
  setData(data: Partial<IBuyer>) {
    this.data = { ...this.data, ...data };
  }

  // Получение всех данных
  getData(): IBuyer {
    return this.data;
  }

  // Очистка
  clear() {
    this.data = { payment: 'card', email: '', phone: '', address: '' };
  }

  // Валидация
  validate() {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.email) errors.email = 'Укажите емэйл';
    if (!this.data.phone) errors.phone = 'Укажите телефон';
    if (!this.data.address) errors.address = 'Укажите адрес';
    return errors;
  }
}


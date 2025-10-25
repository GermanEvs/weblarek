import './scss/styles.scss';
// main.ts
import { apiProducts } from './utils/data';
import { IProduct, IBuyer } from './types';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ApiService } from './components/Models/ApiService';
import { Api } from './components/base/Api'; // предполагаем, что класс Api есть в стартере


// 1️⃣ Создаём экземпляры моделей данных
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// 2️⃣ Настраиваем API
const baseUrl = import.meta.env.VITE_API_ORIGIN || 'https://larek-api.nomoreparties.co';
const apiInstance = new Api(baseUrl);

// 3️⃣ Создаём сервис для работы с сервером
const apiService = new ApiService(apiInstance);

// 4️⃣ Тестируем модели данных (локальные данные)
const testProduct: IProduct = {
  id: '1',
  title: 'JS Handbook',
  description: 'Книга по JavaScript',
  image: 'js-book.jpg',
  category: 'books',
  price: 500
};

productsModel.setItems([testProduct]);
productsModel.setSelectedItemById(testProduct.id); // ✅ Используем новый метод по id

console.log('Каталог товаров:', productsModel.getItems());
console.log('Выбранный товар:', productsModel.getSelectedItem());

// Работа с корзиной
cartModel.addItem(testProduct);
console.log('Корзина после добавления:', cartModel.getItems());
console.log('Общая стоимость:', cartModel.getTotal());
cartModel.removeItem(testProduct);
console.log('Корзина после удаления:', cartModel.getItems());

// Работа с покупателем
buyerModel.setEmail('test@mail.com');
buyerModel.setPhone('+123456789');
buyerModel.setAddress('ул. Ленина, 1');
buyerModel.setPayment('card');

console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки в данных покупателя:', buyerModel.validate());

// 5️⃣ Получаем товары с сервера и сохраняем в модель
// Получаем товары с сервера через ApiService
apiService.fetchProducts()
  .then((items) => {
    // Сохраняем товары в модель
    productsModel.setItems(items);

    // Выводим товары в консоль
    console.log('Товары с сервера:', productsModel.getItems());
  })
  .catch((err: unknown) => {
    // Безопасная обработка ошибок
    if (err instanceof Error) {
      console.error('Ошибка получения товаров:', err.message);
    } else {
      console.error('Неизвестная ошибка при получении товаров:', err);
    }
  });
  

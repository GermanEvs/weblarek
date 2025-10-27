import './scss/styles.scss';
import { IProduct, IBuyer } from './types';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ApiService } from './components/Models/ApiService';
import { Api } from './components/base/Api'; 
import { API_URL } from './utils/constants'; //

// 1️⃣ Создаём экземпляры моделей данных
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// 2️⃣ Настраиваем API используя константу из проекта
const apiInstance = new Api(API_URL);

// 3️⃣ Создаём сервис для работы с сервером
const apiService = new ApiService(apiInstance);

// 4️⃣ Тестируем модели данных (локальные данные)
console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===');

const testProduct: IProduct = {
  id: '1',
  title: 'JS Handbook',
  description: 'Книга по JavaScript',
  image: 'js-book.jpg',
  category: 'books',
  price: 500
};

const testProduct2: IProduct = {
  id: '2',
  title: 'TypeScript Guide',
  description: 'Руководство по TypeScript',
  image: 'ts-book.jpg',
  category: 'books',
  price: 700
};

// Тестируем Products
console.log('\n--- Тестирование Products ---');
productsModel.setItems([testProduct, testProduct2]);
console.log('Каталог товаров:', productsModel.getItems());

productsModel.setSelectedItemById('1');
console.log('Выбранный товар по ID:', productsModel.getSelectedItem());

productsModel.setSelectedItem(testProduct2);
console.log('Выбранный товар по объекту:', productsModel.getSelectedItem());

// Тестируем Cart
console.log('\n--- Тестирование Cart ---');
cartModel.addItem(testProduct);
console.log('Корзина после добавления:', cartModel.getItems());
console.log('Общая стоимость:', cartModel.getTotal());
console.log('Количество товаров:', cartModel.getCount());
console.log('Есть ли товар с ID "1":', cartModel.hasItem('1'));
console.log('Есть ли товар с ID "3":', cartModel.hasItem('3'));

cartModel.removeItem(testProduct);
console.log('Корзина после удаления:', cartModel.getItems());

// Добавляем оба товара для дальнейшего тестирования
cartModel.addItem(testProduct);
cartModel.addItem(testProduct2);
console.log('Корзина после добавления двух товаров:', cartModel.getItems());
console.log('Итоговая стоимость:', cartModel.getTotal());

// Тестируем Buyer
console.log('\n--- Тестирование Buyer ---');
buyerModel.setEmail('test@mail.com');
buyerModel.setPhone('+123456789');
buyerModel.setAddress('ул. Ленина, 1');
buyerModel.setPayment('card');

console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки в данных покупателя:', buyerModel.validate());

// Тестируем частичное обновление данных
buyerModel.setData({ email: 'new@mail.com', phone: '+987654321' });
console.log('Данные после частичного обновления:', buyerModel.getData());

// Тестируем валидацию с неполными данными
const tempBuyer = new Buyer();
tempBuyer.setData({ payment: 'cash' });
console.log('Валидация неполных данных:', tempBuyer.validate());

// 5️⃣ Получаем товары с сервера и сохраняем в модель
console.log('\n--- Загрузка данных с сервера ---');

apiService.fetchProducts()
  .then((items) => {
    // Сохраняем товары в модель
    productsModel.setItems(items);
    
    // Выводим товары в консоль
    console.log('Товары с сервера:', productsModel.getItems());
    console.log('Количество загруженных товаров:', items.length);
    
    // Тестируем работу с загруженными данными
    if (items.length > 0) {
      const firstProduct = items[0];
      productsModel.setSelectedItem(firstProduct);
      console.log('Первый товар из загруженных:', productsModel.getSelectedItem());
      
      // Добавляем в корзину для демонстрации
      cartModel.addItem(firstProduct);
      console.log('Корзина после добавления товара с сервера:', cartModel.getItems().length, 'товаров');
    }
  })
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('Ошибка получения товаров:', err.message);
    } else {
      console.error('Неизвестная ошибка при получении товаров:', err);
    }
  });

// 6️⃣ Тестируем очистку данных
console.log('\n--- Тестирование очистки данных ---');
cartModel.clear();
console.log('Корзина после clear():', cartModel.getItems());

buyerModel.clear();
console.log('Данные покупателя после clear():', buyerModel.getData());

console.log('=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
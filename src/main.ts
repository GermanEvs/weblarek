// src/main.ts
import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { Api } from './components/base/Api'; // оставляю как есть
import { ApiService } from './components/Models/ApiService';

import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { eventBus } from './utils/event-bus';

import { HeaderView } from './components/Views/HeaderView';
import { GalleryView } from './components/Views/GalleryView';
import { ModalView } from './components/Views/ModalView';
import { CardCatalogView } from './components/Views/CardCatalogView';
import { CardPreviewView } from './components/Views/CardPreviewView';
import { BasketView } from './components/Views/BasketView';
import { OrderFormView } from './components/Views/OrderFormView';
import { ContactsFormView } from './components/Views/ContactsFormView';


// Init services/models
const api = new Api(API_URL);
const apiService = new ApiService(api);

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// Init views
const headerContainer = document.querySelector('.header__container') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;

const headerView = new HeaderView(headerContainer);
const galleryView = new GalleryView(galleryContainer);
const modalView = new ModalView(modalContainer);

// --- Model -> View handlers ---
// products loaded -> render catalog
eventBus.on('model:products:changed', (items: any) => {
  const tpl = document.getElementById('card-catalog') as HTMLTemplateElement;
  const nodes: HTMLElement[] = (items || []).map((p: any) => {
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardCatalogView(node);
    card.render(p);
    return node;
  });
  galleryView.catalog = nodes;
});

// selected product -> show preview in modal
eventBus.on('model:product:selected', (product: any) => {
  if (!product) return;
  const tpl = document.getElementById('card-preview') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const preview = new CardPreviewView(node);
  preview.render(product);
  modalView.content = node;
  modalView.open();
});

// cart changed -> update header counter
eventBus.on('model:cart:changed', (items: any) => {
  headerView.setCounter(Array.isArray(items) ? items.length : 0);
});

// buyer change (optional)
eventBus.on('model:buyer:changed', () => {
  // can update visible forms or log
});

// --- View -> Presenter handlers ---
// open card preview
eventBus.on('view:card:open', (payload: any) => {
  const id = payload?.id;
  if (typeof id === 'string') productsModel.setSelectedItemById(id);
});

// toggle cart for product
eventBus.on('view:product:toggle-cart', (payload: any) => {
  const id = payload?.id;
  if (!id || typeof id !== 'string') return;
  const product = productsModel.getItemById(id);
  if (!product) return;
  if (cartModel.hasItem(id)) cartModel.removeItemById(id);
  else cartModel.addItem(product);
});

// remove from cart
eventBus.on('view:cart:remove', (payload: any) => {
  const id = payload?.id;
  if (!id) return;
  cartModel.removeItemById(id);
});

// open basket modal
eventBus.on('view:open:cart', () => {
  const tpl = document.getElementById('basket') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const basketView = new BasketView(node);
  basketView.renderItems(cartModel.getItems());
  modalView.content = node;
  modalView.open();

  const onCartUpdated = (items: any) => basketView.renderItems(items);
  eventBus.on('model:cart:changed', onCartUpdated);

  // unsubscribe when modal closed
  const onModalClosed = () => {
    eventBus.off('model:cart:changed', onCartUpdated);
    eventBus.off('view:modal:closed', onModalClosed);
  };
  eventBus.on('view:modal:closed', onModalClosed);
});

// open order form
eventBus.on('view:order:open', () => {
  const tpl = document.getElementById('order') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const order = new OrderFormView(node);
  modalView.content = node;
  modalView.open();

  // when going to next, open contacts form with saved buyer data
  const onNext = (payload: any) => {
    buyerModel.setData({ payment: payload.payment, address: payload.address });
    const tpl2 = document.getElementById('contacts') as HTMLTemplateElement;
    const node2 = tpl2.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const contacts = new ContactsFormView(node2);
    modalView.content = node2;
  };
  eventBus.on('view:order:next', onNext);

  // unsubscribe when modal closes
  const onModalClosed = () => {
    eventBus.off('view:order:next', onNext);
    eventBus.off('view:modal:closed', onModalClosed);
  };
  eventBus.on('view:modal:closed', onModalClosed);
});

// submit order (contacts form)
eventBus.on('view:order:submit', async (payload: any) => {
  buyerModel.setData({ email: payload.email, phone: payload.phone });
  const errors = buyerModel.validate();
  if (Object.keys(errors).length) {
    console.warn('Validation errors', errors);
    return;
  }

  const items = cartModel.getItems();
  try {
    await apiService.sendOrder(buyerModel.getData(), items);
    cartModel.clear();
    buyerModel.clear();

    const tpl = document.getElementById('success') as HTMLTemplateElement;
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    modalView.content = node;
  } catch (err) {
    console.error('Order send error', err);
  }
});

// --- initial load ---
(async function init() {
  try {
    const items = await apiService.fetchProducts();
    productsModel.setItems(items);
  } catch (err) {
    console.error('Ошибка загрузки каталога', err);
  }
})();

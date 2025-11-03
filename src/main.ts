// src/main.ts
import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
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
import { CardBasketView } from './components/Views/CardBasketView';
import { OrderFormView } from './components/Views/OrderFormView';
import { ContactsFormView } from './components/Views/ContactsFormView';

import { IProduct, TPayment, IBuyer, IOrder } from './types';

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

// Reusable views
let basketView: BasketView;
let orderFormView: OrderFormView;
let contactsFormView: ContactsFormView;

// --- Model -> View handlers ---
// products loaded -> render catalog
eventBus.on('model:products:changed', (items: IProduct[]) => {
  const tpl = document.getElementById('card-catalog') as HTMLTemplateElement;
  const nodes: HTMLElement[] = items.map((p: IProduct) => {
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardCatalogView(node);
    card.render(p);
    return node;
  });
  galleryView.catalog = nodes;
});

// selected product -> show preview in modal
eventBus.on('model:product:selected', (product: IProduct) => {
  if (!product) return;
  
  const tpl = document.getElementById('card-preview') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const preview = new CardPreviewView(node);
  
  const inCart = cartModel.hasItem(product.id);
  preview.render({ ...product, inCart });
  
  modalView.content = node;
  modalView.open();

  const onModalClosed = () => {
    if (preview.destroy) {
      preview.destroy();
    }
    eventBus.off('view:modal:closed', onModalClosed);
  };
  eventBus.on('view:modal:closed', onModalClosed);
});

// cart changed -> update header counter
eventBus.on('model:cart:changed', (items: IProduct[]) => {
  headerView.setCounter(items.length);
});

// buyer change (optional)
eventBus.on('model:buyer:changed', (data: IBuyer) => {
  // can update visible forms or log
});

// --- View -> Presenter handlers ---
// open card preview
eventBus.on('view:card:open', (payload: { id: string }) => {
  const id = payload?.id;
  if (id) productsModel.setSelectedItemById(id);
});

// toggle cart for product
eventBus.on('view:product:toggle-cart', (payload: { id: string }) => {
  const id = payload?.id;
  if (!id) return;
  const product = productsModel.getItemById(id);
  if (!product) return;
  if (cartModel.hasItem(id)) cartModel.removeItemById(id);
  else cartModel.addItem(product);
});

// remove from cart
eventBus.on('view:cart:remove', (payload: { id: string }) => {
  const id = payload?.id;
  if (!id) return;
  cartModel.removeItemById(id);
});

// open basket modal
eventBus.on('view:open:cart', () => {
  if (!basketView) {
    const tpl = document.getElementById('basket') as HTMLTemplateElement;
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    basketView = new BasketView(node);
  }

  const items = cartModel.getItems();
  const total = cartModel.getTotal();
  const basketItemTpl = document.getElementById('card-basket') as HTMLTemplateElement;
  
  const itemNodes = items.map((item: IProduct, index: number) => {
    const itemNode = basketItemTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const cardBasketView = new CardBasketView(itemNode);
    cardBasketView.render({ ...item, index });
    return itemNode;
  });

  basketView.render({ items: itemNodes, total });
  modalView.content = basketView.getContainer();
  modalView.open();

  const onCartUpdated = (items: IProduct[]) => {
    const updatedTotal = cartModel.getTotal();
    const updatedItemNodes = items.map((item: IProduct, index: number) => {
      const itemNode = basketItemTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const cardBasketView = new CardBasketView(itemNode);
      cardBasketView.render({ ...item, index });
      return itemNode;
    });
    basketView.render({ items: updatedItemNodes, total: updatedTotal });
  };
  
  eventBus.on('model:cart:changed', onCartUpdated);

  const onModalClosed = () => {
    eventBus.off('model:cart:changed', onCartUpdated);
    eventBus.off('view:modal:closed', onModalClosed);
  };
  eventBus.on('view:modal:closed', onModalClosed);
});

// Handle form changes
eventBus.on('view:form:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
  
  const currentContent = modalView.getContainer().querySelector('.modal__content')?.firstElementChild;
  
  const isOrderForm = currentContent?.querySelector('.order') !== null;
  const isContactsForm = currentContent?.querySelector('.contacts') !== null;
  
  if (isOrderForm && orderFormView) {
    const errors = buyerModel.validateOrder();
    orderFormView.setErrors(Object.values(errors));
    orderFormView.setValid(Object.keys(errors).length === 0);
  }
  
  if (isContactsForm && contactsFormView) {
    const errors = buyerModel.validateContacts();
    contactsFormView.setErrors(Object.values(errors));
    contactsFormView.setValid(Object.keys(errors).length === 0);
  }
});

// open order form
eventBus.on('view:order:open', () => {
  if (!orderFormView) {
    const tpl = document.getElementById('order') as HTMLTemplateElement;
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    orderFormView = new OrderFormView(node);
  }

  const buyerData = buyerModel.getData();
  orderFormView.setData(buyerData.payment, buyerData.address);
  
  const errors = buyerModel.validateOrder();
  orderFormView.setErrors(Object.values(errors));
  orderFormView.setValid(Object.keys(errors).length === 0);

  modalView.content = orderFormView.getContainer();
  modalView.open();

  const onNext = (payload: { payment: TPayment; address: string }) => {
    buyerModel.setData(payload);
    
    if (!contactsFormView) {
      const contactsTpl = document.getElementById('contacts') as HTMLTemplateElement;
      const contactsNode = contactsTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
      contactsFormView = new ContactsFormView(contactsNode);
    }

    const contactsData = buyerModel.getData();
    contactsFormView.setData(contactsData.email, contactsData.phone);
    
    // ✅ Принудительно вызываем валидацию и обновление состояния
    const forceValidation = () => {
      const currentErrors = buyerModel.validateContacts();
      contactsFormView.setErrors(Object.values(currentErrors));
      contactsFormView.setValid(Object.keys(currentErrors).length === 0);
    };
    
    // Вызываем сразу
    forceValidation();
    
    // ✅ И подписываемся на дальнейшие изменения
    eventBus.on('view:form:change', forceValidation);
    
    modalView.content = contactsFormView.getContainer();
  };

  eventBus.on('view:order:next', onNext);

  const onModalClosed = () => {
    eventBus.off('view:order:next', onNext);
    eventBus.off('view:form:change', () => {}); // ✅ Очищаем все подписки form:change
    eventBus.off('view:modal:closed', onModalClosed);
  };
  eventBus.on('view:modal:closed', onModalClosed);
});

// submit order (contacts form)
eventBus.on('view:order:submit', async (payload: { email: string; phone: string }) => {
  buyerModel.setData(payload);
  const errors = buyerModel.validateContacts();
  
  if (Object.keys(errors).length) {
    console.warn('Validation errors', errors);
    return;
  }

  const items = cartModel.getItems();
  const total = cartModel.getTotal();
  
  try {
    const buyerData = buyerModel.getData();
    const orderData: IOrder = {
      payment: buyerData.payment!,
      email: buyerData.email!,
      phone: buyerData.phone!,
      address: buyerData.address!,
      total,
      items: items.map(item => item.id)
    };
    
    await apiService.sendOrder(orderData, items);
    
    cartModel.clear();
    buyerModel.clear();

    const tpl = document.getElementById('success') as HTMLTemplateElement;
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    
    const descriptionEl = node.querySelector('.order-success__description');
    if (descriptionEl) {
      descriptionEl.textContent = `Списано ${total} синапсов`;
    }
    
    const closeBtn = node.querySelector('.order-success__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalView.close());
    }
    
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
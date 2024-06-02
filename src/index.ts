import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import  { Modal } from './components/modal/Modal';

import { AppState, CatalogChange } from './components/parts/AppState';
import { Basket, BasketItem } from './components/parts/Basket';
import { Product } from './components/parts/Product';
import { Contacts } from './components/parts/Form';
import { AppApi } from './components/parts/AppApi';
import { Order } from './components/parts/Order';
import { Page } from './components/parts/Page';
import { Success } from './components/parts/Success';

import { IForm, IOrderForm, IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

const productCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appState = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactTemplate), events);

events.on<CatalogChange>('items:changed', () => {
  page.catalog = appState.catalog.map(item => {
    const product = new Product('product', cloneTemplate(productCatalogTemplate), {
      onClick: () => events.emit('product:select', item)
    });
    return product.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category
    })
  })
  page.counter = appState.getDeleteFromBasket().length
});

events.on('product:select', (item: IProduct) => {
  appState.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
  if(item) {
    api
      .getProduct(item.id)
      .then((res: IProduct) => {
        item.id = res.id;
        item.category = res.category;
        item.title = res.title;
        item.description = res.description;
        item.image = res.image;
        item.price = res.price;
        const product = new Product('product', cloneTemplate(productPreviewTemplate), {
          onClick: () => {
            if(appState.getBasketProduct(item)) {
              appState.removeToBasket(item.id);
              modal.close();
            } else {
              events.emit('product:add', item);
            }
          }
        });
        const buttonTitle: string = appState.getBasketProduct(item) ? 'Убрать из корзины' : 'Купить';
        product.button = buttonTitle;
        console.log('Button title:', buttonTitle);
        modal.render({
          content: product.render({
            title: item.title,
            description: item.description,
            image: item.image,
            price: item.price,
            category: item.category,
            button: buttonTitle,
          })
        });
      });
    }
});

events.on('basket:open', () => {
  modal.render({
    content: basket.render({})
  })
});

events.on('basket:changed', () => {
  page.counter = appState.getDeleteFromBasket().length
  let total = 0
  basket.items = appState.getDeleteFromBasket().map((item, index) => {
    const product = new BasketItem(cloneTemplate(productBasketTemplate), index, {
        onClick: () => {
          appState.removeToBasket(item.id)
          basket.total = appState.getTotalPriceBasket();  
          basket.total = appState.getTotal()     
        },
    });
    total = total + item.price;
    return product.render({
      title: item.title,
      price: item.price,
    })
  })
  basket.total = total; 
  appState.order.total = total;
});

events.on('counter:changed', () => {
  page.counter = appState.getDeleteFromBasket().length
});

events.on('product:add', (item: IProduct) => {
  appState.addToBasket(item);
  modal.close();
});

events.on('product:delete', (item: IProduct) => {
  appState.removeToBasket(item.id)
});

events.on('order:open', () => {
  appState.setPaymentWay('');
  order.setToggleClass('');
  modal.render({
    content: order.render({
      payment: '',
      address: '',
      valid: false,
      errors: [],
    })
  })
  appState.order.items = appState.basket.map((item) => item.id);
});

events.on('order:submit', () => {
  modal.render({
    content: contacts.render({
      phone: '',
      email: '',
      valid: false,
      errors: [],
    })
  })
}); 

events.on('contacts:submit', () => {
  api.orderProduct(appState.order)
    .then((result) => {
      appState.clearBasket() 
      appState.clearForm() 
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close()
        }
      })
      modal.render({
        content: success.render({
          total: result.total,
        })
      })
    })
    .catch(err => {
      console.error(err);
    });
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false; 
});

events.on('orderFormError:change', (errors: Partial<IOrderForm>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

events.on('contactFormError:change', (errors: Partial<IForm>) => {
  const { email, phone } = errors
  contacts.valid = !email && !phone
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ')
}); 

events.on('order.payment:change', (data: { target: string }) => {
	appState.setPaymentWay(data.target);
});

events.on('order.address:change', (data: { value: string }) => {
	appState.setOrderAdress(data.value);
});

events.on(/^contacts\..*:change/, (data: {field: keyof IForm, value: string}) => {
  appState.setOrderContact(data.field, data.value)
});

api.getProductList()
  .then(appState.catalogProduct.bind(appState))
  .catch(err => {
    console.log(err);
  });
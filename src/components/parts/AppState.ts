import { IEvents } from '../base/events';
import { IAppState, IProduct, IOrder, FormErrors, IForm, Payment } from '../../types';

export const isModel = (obj: unknown): obj is Model<any> => {
  return obj instanceof Model;
}

abstract class Model<T> {
  constructor(data: Partial<T>, protected events: IEvents) {
      Object.assign(this, data);
  }

  emitChanges(event: string, payload?: object) {
      this.events.emit(event, payload ?? {});
  }
}

export type CatalogChange = {
  catalog: IProduct[];
}

export class AppState extends Model<IAppState> {
  catalog: IProduct[];
  basket: IProduct[] = [];
  order: IOrder = {
    payment: "card",
    items: [],
    total: 0,
    email: "",
    phone: "",
    address: ""
  }
  preview: string | null;
  formErrors: FormErrors = {};

  catalogProduct(items: IProduct[]) {
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: IProduct) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  addToBasket(item: IProduct) {
    if(this.basket.indexOf(item) < 0) {
      this.basket.push(item)
      this.stateBasket();
    }
  }

  removeToBasket(id: string) {
    this.basket = this.basket.filter((it) => it.id != id)
    this.emitChanges('basket:changed');
  }

  getDeleteFromBasket(): IProduct[] {
		return this.basket;
	}

  getBasketProduct(item: IProduct): boolean {
    return this.basket.includes(item);
  }


  getTotalPriceBasket(): number {
    return this.order.items.reduce((total, item) => total + this.catalog.find(it => it.id === item).price, 0)
  }

  getTotal(){
    return  this.basket.reduce((summ, IProductItem)=> 
      summ+IProductItem.price,0);
}

  stateBasket() {
    this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  clearBasket() {
    this.basket = [];
    this.stateBasket();
  }

  clearForm() {
    this.order = {
      payment: "card",
      items: [],
      total: 0,
      email: "",
      phone: "",
      address: ""
    }
  }

  setPaymentWay(method: string) {
    this.order.payment = method as Payment;
    this.validateOrder();
  }

  setOrderAdress(value: string) {
    this.order.address = value;
    this.validateOrder();
  };

  setOrderContact(field: keyof IForm, value: string) {
    this.order[field] = value;
    this.validateContact();
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if(!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты'
		}
    if(!this.order.address) {
      errors.address = 'Необходимо указать адрес'
    }
    this.formErrors = errors;
    this.events.emit('orderFormError:change', this.formErrors)
    return Object.keys(errors).length === 0
  }

  validateContact() {
    const errors: typeof this.formErrors = {};
    if(!this.order.email) {
      errors.email = 'Необходимо указать email'
    }
    if(!this.order.phone) {
      errors.phone = 'Необходимо указать телефон'
    }
    this.formErrors = errors;
    this.events.emit('contactFormError:change', this.formErrors)
    return Object.keys(errors).length === 0
  }
}
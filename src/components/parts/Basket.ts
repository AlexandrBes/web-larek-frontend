import { Component } from '../base/component';
import { EventEmitter } from '../base/events';
import { ensureElement, createElement } from '../../utils/utils';
import { IBasketItem, IBasketView, IProductAction } from '../../types';

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container)

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

    if(this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }
      this.items = [];
    }

    disableButton( value: string) {
      this._button.setAttribute('disabled', value)
    }

    set items(items: HTMLElement[]) {
      if(items.length) {
        this._list.replaceChildren(...items);
        this.setDisable(this._button, false);
      } else {
        this._list.replaceChildren(
          createElement<HTMLParagraphElement>('p', {
            textContent: 'Корзина пуста'
          }));
          this.disableButton('true');
      }
    }

    set total(price: number) {
      if (this._total) {
      this.setText(this._total, `${price} синапсов`);
    }
  }
}

export class BasketItem extends Component<IBasketItem> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  set index(value: number) {
    this.setText(this._index, value)
  }

  set title(value: string) {
    this.setText(this._title, value)
  }

  set price(value: number) {
    this.setText(this._price, `${value} синапсов`);
  }

  constructor(container: HTMLElement, index: number, action?: IProductAction) {
    super(container);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this.setText(this._index, index + 1);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._button = container.querySelector('.card__button');
    if(action?.onClick) {
      if(this._button) {
        this._button.addEventListener('click', (action.onClick));
      }
    }
  }
}
import { Form } from '../modal/Form';
import { IForm } from '../../types';
import { IEvents } from '../../components/base/events';

export class Contacts extends Form<IForm> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
    this._phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  };

  set email(value: string) {
    this._emailInput.value = value;
  };
}
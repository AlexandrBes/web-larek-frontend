export type Payment = 'card' | 'cash' | '';

export interface IAppApi {
  getProductList: () => Promise<IProduct[]>
  getProduct: (id: string) => Promise<IProduct>
  orderProduct: (order: IOrder) => Promise<IOrderSuccess>
}

export interface IModal {
  content: HTMLElement;
}

export interface IFormState {
  valid: boolean;
  errors: string[];
}

//Описывает страницу сайта
export interface IPage {
  counter: number;  //счётчик товаров в корзине
  store: HTMLElement[];  //массив товаров
  locked: boolean;  //блокировка действий при открытом модальном окне
}

//Описывает саму карточку товара
export interface IProduct {
  id: string;  //айди карточки товара
  title: string;  //наименование товара
  category: string;  //категория товара
  description?: string;  //описание товара
  image: string;  //изображение товара
  price: number | null;  //цена товара
  selected: boolean;  //был ли товар добавлен в корзину
  button: string;  //кнопка корзины
}

export interface IProductAction {
  onClick: (event: MouseEvent) => void;
}

//Хранения карточек, корзины, заказа пользователя
export interface IAppState {
  catalog: IProduct[];  //массив товаров
  basket: IProduct[] | null;  //корзина с товарами
  order: IOrder | null;   //информация о заказе
  preview: string | null; //предосмотр товара
  loading: boolean; //загрузка товара, логическое значение
}

export interface IBasketItem {
  title: string;
  price: number;
}

export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

//Экран для ввода телефона и email
export interface IForm {
  email: string;  //почта покупателя
  phone: string;  //телефон покупателя
}

//Экран для ввода адреса и способа оплаты заказа
export interface IOrderForm {
  payment: Payment;  //способы оплаты заказа
  address: string;  //адрес доставки
}

//Объединение полей оформления заказа 
export interface IOrder extends IOrderFormError {
  items: string[],  //позиции
  total: number;  //сумма заказа
  payment: Payment;  //оплата
}

//Интерфейс форм ошибки валидации с формой контактов и формы для ввода телефона и адреса доставки
export interface IOrderFormError extends IForm, IOrderForm {}

//Экран успеха 
export interface IOrderSuccess {
  id: string[];   //ID купленных товаров
  total: number;  //полная сумма
}

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

//Ошибки валидации
export type FormErrors = Partial<Record<keyof IOrder, string>>
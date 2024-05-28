# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура
Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.
Компоненты архитектуры образуют шаблон проектирования Model-View-Presenter(MVP):
- Базовый код: отвечает за связь данных и представления.
- Компонент модели данных: отвечает за хранение и изменение данных.
- Компоненты представления: отвечает за отображение данных на странице.

### Базовый код 

#### Класс `Api` 
Отправляет запросы HTTP серверу. Содержит методы для отправки данных и обработки ответов сервера.

Конструктор принимает такие аргументы:
1. `baseUrl: string` - получает и хранит базовый url.
2. `options: RequestInit` - опции запроса.

Класс имеет такие методы:
1. `protected handleResponse(response: Response): Promise` - обработывает ответ сервера.
2. `get(url: string)` - забирает данные c сервера.
3. `post(url: string, data: object, method: ApiPostMethods = 'POST')` - отправляет данные на сервер.

#### Класс `EventEmitter`
Он позволяет объектам подписываться на события и реагировать.

Основные методы описаные интерфейсом `IEvents`:
1. `on` - подписка на событие.
2. `emit` - инициализация события.
3. `trigger` - возвращает функции, при вызове инициализирует событие.

---

### Компоненты модели данных(бизнес-логика)
Хранилище с набором данных для контроля работы приложения.

#### Класс `AppState`
Устанавливает связь между товарами, корзиной, заказом и ошибок ввода.

Поля класса:
1. `catalog: IProduct[]` - массив товаров.
2. `basket: IProduct[]` - корзина с товарами.
3. `order: IOrder` - информация о заказе.
4. `preview: string` - предосмотр товара.
5. `loading: boolean` - загрузка товара.
6. `formErrors: FormErrors` - ошибки ввода данных в форме заказа.
7. `priceBasket: number` - общая стоимость товара в корзине.
    
Методы класса:
1. `pushToBasket(id: string)` - добавление товара в список заказаных.
2. `deleteFromBasket(id: string)` - удаление товара из списка заказных.
3. `basketProduct(id: string): boolean` - проверяет есть ли товар в списке заказаных.
4. `addToBasket(item: IProduct)` - добавление товара в корзину.
5. `clearBasket()` - очистить корзину. 
6. `getTotalPriceBasket(): number` - сумма товара в корзине.
7. `setCatalogProduct(item: IProduct[])` - вывод товара в каталог.
8. `getCurrentOrder()` - введеные в форме данные заказа проверяет на валидность, если есть ошибка сработает событие formError и вернет false, иначе true
9. `setOrderField(field: keyof IOrderForm, value: string)` - Проверяет валидность данных и устанавливает значение в поле формы заказа, если ошибки нет сработает событие order: true.

---

### Компоненты представления

#### Класс `Component` 
Базовый компонент который принимает родительские элементы.
Класс является абстрактным и предназначен для наследования.
Обобщенный тип `<T>` позволяет определить тип данных, используемых при рендеринге компонента.

Конструктор:
`protected constructor(protected readonly _container: HTMLElement)` - принимает DOM-элемент, который служит контейнером для компонента.

Методы:
1. `public render(data?: Partial<T>): HTMLElement` - предоставляем корневой DOM-элемент компонента, опционально позволяя обновить его состояние с помощью переданных данных. Возвращает контейнер компонента.
2. `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливаем источник изображения и альтернативный текст для элемента `<img>`.
3. `public toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключаем класс для указанного элемента. Добавляет и удаляет класс
4. `public addClass(element: HTMLElement, className: string)` - добавляем класс указанному элементу.
5. `public setClass(element: HTMLElement, className: string)` - устанавливаем/заменяем указанный класс для элемента.
6. `protected setText(element: HTMLElement, value: unknown)` - устанавливаем текстовое содержимое для элемента.
7. `public setDisabled(element: HTMLElement, state: boolean)` - изменяем состояние блокировки элемента в зависимости от значения `state`.
8. `protected setHidden(element: HTMLElement)` - скрываем элемент, изменяя его стиль `display` на `none`.
9. `protected setVisible(element: HTMLElement)` - показываем элемент, удаляя его стиль `display`.


#### Класс `ProductCard`
Выводит товар и информацию о нем.

Конструктор принимает такие аргументы:
Инициализирует карточку, настраивает элементы и добавляет слушатель событий, если необходимо.
1. `blockName: string` - имя блока.
2. `container: HTMLElement` - контейнер карточки. 
3. `actions?: ICardActions` - опциональное действие, необязательный парамет.

Поля класса:
1. `image: HTMLImageElement` - изображения карточки.
2. `title: HTMLElement` -  заголовка товара.
3. `description: HTMLElement` - описания товара.
4. `category: HTMLElement` - категории товара.
5. `price: HTMLElement` - цены товара.
6. `button: HTMLButtonElement` - кнопка на карточке товара.

Методы класса:
1. `setImage(image: HTMLImageElement, src: string, alt: string)` - устанавливаем изображение карточки с альтер. текстом.
2. `set image(value: string)` - устанавливаем изображение карточки.
3. `set title(value: string)` - устанавливаем заголовок карточки.
4. `get title(): string` - возвращаем заголовок карточки.
5. `set description(value: string | string[])` - устанавливаем описание карточки.
6. `setPriceText(price: HTMLElement, value: number | null)` - устанавливаем текст цены карточки.
7. `set price(value: number | null)` - устанавливаем цену товара.
8. `get price(): number | string` - возвращаем цену товара.
9. `set button(value: HTMLButtonElement)` - устанавливаем кнопку карточки.
10. `toggleButtonState(button: HTMLButtonElement, isEnabled: boolean)` - устанавливаем состояние кнопки.
11. `setTextCategory(element: HTMLElement, text: string)` - устанавливаем текст категории карточки.
12. `set id(value: string)` - устанавливаем идентификатор карточки.
13. `get id(): string` - возвращаем идентификатор карточки.

#### Класс `Page`
Отображает главную страницу сайта, каталог товаров и счетчик сайта.

Конструктор принимает такие аргументы:
Инициализирует поля класса и устанавливает слушатель события клика на элементе корзины для открытия корзины.
1. `container: HTMLElement` - контейнер страницы.
2. `events: IEvents` - объект событий для взаимодействия с другими компонентами.

Поля класса: 
1. `counter: HTMLElement` - счетчик товаров в корзине.
2. `catalog: HTMLElement` - отображения каталога товаров.
3. `wrapper: HTMLElement` - обертка страницы.
4. `basket: HTMLElement` - корзина.

Методы класса:
1. `set counter(value: number)` - значение счетчика товаров в корзине.
2. `set catalog(items: HTMLElement[])` - содержимое каталога товаров.
3. `set locked(value: boolean)` - состояние блокировки страницы. Если значение true, добавляет класс page__wrapper_locked к обертке страницы, иначе удаляет этот класс.

#### Класс `Basket`
Отображает информацию по заказу и отвечает за работу корзины.

Конструктор принимает такие аргументы:
1. `container: HTMLElement` - принимает контейнер.
2. `events: EventEmitter` - для инициации событий.
3. `actions?: IBasketActions` - дополнительные действия.

Поля класса:
1. `list: HTMLElement` - список товаров в корзине.
2. `total: HTMLElement` - отображение общей стоимости товаров в корзине.
3. `button: HTMLElement` - кнопка оформления заказ
4. `delete: HTMLElement` - кнопка удаления товара из корзины.

Методы класс:
1. `get list(): HTMLElement` - получения списка товаров в корзине.
2. `set item(item: HTMLElement): void` - добавления отдельного товара в корзину.
3. `set items(items: HTMLElement[]): void` - для замены списка товаров в корзине новым списком. Если переданный массив товаров не пуст, он заменяет текущий список товаров в корзине. Если массив пуст, в списке отображается сообщение о том, что корзина пуста.
4. `get button(): HTMLElement` - получения кнопки оформления заказа.
5. `set total(total: number): void` - отображения общей стоимости товаров в корзине.

#### Класс `Modal`
Открытие и закрытие модульных окон и вывод в них контента.

Конструктор принимает такие аргументы:
1. `selector: string` - принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно.
2. `events: IEvents` - экземпляр класса EventEmitter для возможности инициации событий.

Поля класса:
1. `closeButton: HTMLButtonElement` - кнопка закрытия модального окна.
2. `content: HTMLElement` - содержимое модального окна.

Методы класса:
1. `set content(value: HTMLElement)` - содержимое модального окна.
2. `open()` - открывает модальное окно.
3. `close()` - закрывает модальное окно.
4. `render(data: IModalData): HTMLElement` - рендерит модальное окно с переданными данными.

#### Класс `Form`
Форма оформления заказа.

Конструктор принимает такие аргументы:
Инициализирует форму, добавляет слушатель событий ввода данных для обработки изменений в полях формы.
1. `container: HTMLFormElement` - контейнер формы.
2. `events: IEvents` - брокера событий.

Поля класса:
1. `submit: HTMLButtonElement` - кнопки отправки формы.
2. `errors: HTMLElement` - отображениe ошибок формы.

Методы класса:
1. `onInputChange(field: keyof T, value: string)` - обрабатывает изменения значения в поле формы и инициирует соответствующее событие.
2. `render(state: Partial<T> & IFormState)` - рендерит состояние формы, включая валидность, ошибки и значения полей.

#### Класс `Order`
Форма со способом оплаты и адресом доставки.

Конструктор принимает такие аргументы:
Инициализирует форму, добавляет слушатели на события клика по кнопкам оплаты и кнопке "Далее".
1. `container: HTMLFormElement` - контейнер формы.
2. `events: IEvents` - брокера событий.

Поля класса:
1. `cash: HTMLButtonElement` - кнопка для оплаты наличными.
2. `card: HTMLButtonElement` - кнопка для оплаты картой.
3. `activeButton: HTMLButtonElement | null` - кнопка оплаты.
4. `next: HTMLButtonElement` - кнопка "Далее".

Методы класс: 
1. `cash(value: string)` - значение поля "оплата наличными".
2. `card(value: string)` - значение поля "оплата картой".
3. `address(value: string)` - значение поля "адрес доставки".
4. `validNextBtn(value: boolean)` - доступность кнопки "Далее".
5. `errors(value: string)` - текст ошибки для отображения пользователю.

#### Класс `ContactForm`
Форма с номером телефона и почтой.

Конструктор принимает такие аргументы:
Инициализирует форму, добавляет слушатель на событие отправки формы для предотвращения ее дефолтного поведения, инициирует событие при отправке формы.
1. `container: HTMLFormElement` - контейнер формы.
2. `events: IEvents` - брокера событий.

Методы класс: 
1. `phone(value: string)` - значение поля "телефон" формы.
2. `email(value: string)` - значение поля "email" формы.
3. `validSubmitBtn: HTMLButtonElement` - кнопка для отправки формы.
4. `errors(value: string)` - текст ошибки для отображения пользователю.

#### Класс `Succes`
Сообщение об успешном оформление заказа.

Конструктор принимает такие аргументы:
Инициализирует поля класса и устанавливает слушатель события клика на кнопке закрытия сообщения.
1. `container: HTMLElement` - контейнер для отображения сообщения.
2. `actions: ISuccessActions` - объект действий.

Поля класса: 
1. `close: HTMLElement` - кнопка закрытия сообщения об успешном заказе.
2. `successDescription: HTMLElement` -  отображения описания успешного заказа.

Методы класса:
1. `setTotal(value: string)` - текстовое описание успешного заказа.

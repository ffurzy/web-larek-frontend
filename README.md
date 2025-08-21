//ооооочень плохо понял 8-9 курс из-за нехватки времени, подумывал отчислиться и заного все пройти 

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/view/ — папка с компонентами представления UI
- src/components/model/ — папка с моделями приложения

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

## Архитектура (MVP)

Model — доменные данные и правила: каталог товаров, корзина, оформление заказа.
View — чистое отображение: рендер DOM, сбор пользовательских событий (клики/ввод).
Не содержит бизнес-логики и сетевых запросов.
Presenter — слушает события View, дергает Api, обновляет Model и инициирует перерисовку View.

Компоненты и роли.

Base
Component — базовый класс для UI: setText, toggleClass, setDisabled, setHidden/Visible, setImage, render.
EventEmitter — брокер событий: on/off/emit, onAll/offAll, trigger.
Api — базовый клиент: get, post, обработка ответа/ошибок.

Model
AppState — единая модель приложения: хранит каталог (товары), корзину (позиции, total), состояние оформления (шаг/поля/валидность).

View
Page — хедер (счетчик корзины) + контейнер каталога.
Card — карточка товара (картинка, название, цена, категория).
Modal — общее модальное окно (open/close, оверлей/крестик).
Basket / BasketItem — список корзины и строки корзины.
Order — форма шага 1 (способ оплаты + адрес).
Contacts — форма шага 2 (email + телефон).
Success — окно успешной оплаты.

## События приложения

```ts
export enum AppEvent {
  ProductsLoaded = 'products:loaded',
  ProductOpen   = 'product:open',
  CartAdd    = 'cart:add',
  CartRemove = 'cart:remove',
  CartOpen   = 'cart:open',
  CartClear  = 'cart:clear',
  CheckoutStep1Valid = 'checkout:step1:valid',
  CheckoutStep2Valid = 'checkout:step2:valid',
  Paid               = 'checkout:paid',
  FormError = 'form:error',
  ModalOpen  = 'modal:open',
  ModalClose = 'modal:close',
}



## Ключевые сценарии
1. **Детали товара:** клик по карточке → `product:open` → `Modal` показывает информацию.
2. **Купить:** клик по «Купить» → `cart:add` → `AppState` пересчитывает total → `Basket` и счётчик перерисовываются.
3. **Удаление из корзины:** клик по «Удалить из корзины» → `cart:remove` → `AppState` пересчитывает total → `Basket` и счётчик перерисовываются.
4. **Оформление - шаг 1 (валидно):** выбран `payment` и введён `address` → `checkout:step1:valid` → «Далее» активна.
5. **Оформление - шаг 1 (ошибка):** выбран `payment`, но адрес пустой → `form:error` → «Далее» неактивна.
6. **Оформление - шаг 2 (валидно):** корректные `email` и `phone` → `checkout:step2:valid` → «Оплатить» активна.
7. **Оформление - шаг 2 (ошибка):** `email` и/или `phone` не заполнены → `form:error` → «Оплатить» неактивна.
8. **Оплата:** клик «Оплатить» → запрос в API → `checkout:paid` → окно `Success` → `cart:clear`.




//Данные товаров
export interface IProductItem {
  id?: string;
  title: string;
  price: number;
  description?: string;
  category: string;
  image: string;
  index?: number;
};

//список товаров
export interface IProductList {
  items: IProductItem[];
};

//интерфейс корзины
export interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[]
}

//интерфейс оформления заказа
export interface IOrder extends IOrderForm, IContactsForm {
  items: string[];
  total: number;
}

//форма оформления заказа шаг 1
export interface IOrderForm {
  payment: PaymentMethod;
  address: string;
}

//форма оформления заказа шаг 2
export interface IContactsForm {
  email: string;
  phone: string;
}

//интерфейс элемента корзины
export interface IBasketItem {
  id: string;
  title: string;
  price: number;
  index: number;
}

//действия для элемента корзины
export interface IBasketItemActions {
  onClick: (event: MouseEvent) => void;
}

//изменение каталога
export type CatalogChangeEvent = {
  catalog: IProductItem[]
};

//главная страница
export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

//окно успеха
export interface ISuccess {
  description: string;
}

//api магазина
export interface ILarekAPI {
	getItems: () => Promise<IProductItem[]>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}

//модальное окно
export interface IModalData {
  content: HTMLElement;
}

//состояние формы
export interface IFormState {
  valid: boolean;
  errors: string;
}

// способ оплаты
export type PaymentMethod = 'card' | 'cash';

// результат заказа от API
export interface IOrderResult {
  id: string;
  total: number;
}

```

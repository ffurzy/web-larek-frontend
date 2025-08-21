// Свод типов и интерфейсов приложения магазина

// Каталог: набор карточек товаров
export interface IProductList {
	items: IProductItem[];
}

// Модель единицы товара
export interface IProductItem {
	index?: number;
	id?: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Представление корзины при рендере
export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

// Позиция в корзине (для списка внутри корзины)
export interface IBasketItem {
	index: number;
	title: string;
	price: number;
	id: string;
}

// Действия по элементу корзины (например, удалить по клику)
export interface IBasketItemActions {
	onClick: (event: MouseEvent) => void;
}

// Заказ: объединяет товары и данные форм
export interface IOrder extends IOrderForm, IContactsForm {
	items: string[];
	total: number;
}

// Первый шаг заказа: способ оплаты и адрес
export interface IOrderForm {
	payment: string;
	address: string;
}

// Второй шаг заказа: контакты
export interface IContactsForm {
	email: string;
	phone: string;
}

// Результат успешного оформления
export interface IOrderResult {
	id: string;
	total: number;
}

// Кнопка закрытия модалки «успех»
export interface ISuccessActions {
	onClick: () => void;
}

// Сигнал изменения каталога
export type CatalogChangeEvent = {
	catalog: IProductItem[];
};

// Состояние главной страницы для рендера
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Обёртка над API магазина
export interface ILarekAPI {
	getItems: () => Promise<IProductItem[]>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}

export interface INotFoundGet {
	error: string;
}
export interface ISuccess {
	description: string;
}
export interface INotFoundPost {
	error: string;
}
export interface IWrongTotal {
	error: string;
}
export interface INoAddress {
	error: string;
}

// Действия для карточки (клик по кнопке «в корзину» и т.д.)
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Данные для модального окна: внутренняя начинка
export interface IModalData {
	content: HTMLElement;
}

// Состояние любой формы: валидна ли и текст ошибок
export interface IFormState {
	valid: boolean;
	errors: string;
}

// Поля с ошибками для заказа по шагам
export interface FormErrors {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
}

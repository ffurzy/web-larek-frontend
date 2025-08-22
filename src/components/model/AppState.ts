// Глобальное состояние приложения: каталог, корзина, заказ, валидация

import { EventEmitter } from '../base/events';
import {
	CatalogChangeEvent,
	FormErrors,
	IOrder,
	IProductItem,
} from '../../types';

export class AppState {
	private catalog: IProductItem[] = [];
	private basket: string[] = JSON.parse(localStorage.getItem('basket') || '[]');
	private order: IOrder = {
		items: [],
		total: 0,
		payment: 'card',
		address: '',
		email: '',
		phone: '',
	};
	public formErrors: FormErrors = {};

	constructor(private events: EventEmitter) {}

	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.events.emit('catalog:update', { items });
	}

	getCatalog() {
		return this.catalog;
	}

	addToBasketById(id?: string) {
		if (!id || this.basket.includes(id)) return;
		const item = this.catalog.find((x) => x.id === id);
		if (!item || item.price == null) return;
		this.basket.push(id);
		this.syncOrderFromBasket();
	}

	removeFromBasket(id: string) {
		this.basket = this.basket.filter((x) => x !== id);
		this.syncOrderFromBasket();
	}

	clearBasket() {
		this.basket = [];
		this.syncOrderFromBasket();
	}

	getBasketItems(): IProductItem[] {
		return this.basket
			.map((id) => this.catalog.find((x) => x.id === id))
			.filter(Boolean) as IProductItem[];
	}

	getBasketCount() {
		return this.basket.length;
	}

	getTotal() {
		return this.getBasketItems().reduce((s, x) => s + (x.price ?? 0), 0);
	}

	setOrderField<K extends keyof IOrder>(key: K, val: IOrder[K]) {
		this.order[key] = val as any;
	}

	getOrder(): IOrder {
		return { ...this.order };
	}

	setOrderPayment(payment: 'card' | 'cash') {
		this.order.payment = payment;
		this.validateOrderStep1();
	}

	setOrderAddress(address: string) {
		this.order.address = address;
		this.validateOrderStep1();
	}

	validateOrderStep1(): boolean {
		const errors: FormErrors = {};
		if (!this.order.payment) errors.payment = 'выберите оплату';
		if (!this.order.address?.trim())
			errors.address = 'Необходимо указать адрес';

		this.formErrors = errors;
		const ok = Object.keys(errors).length === 0;

		this.events.emit('form:errors', errors);
		this.events.emit('order:valid', ok);
		return ok;
	}

	validateOrder() {
		const errs: FormErrors = {};
		if (!this.order.payment) errs.payment = 'выберите оплату';
		if (!this.order.address?.trim()) errs.address = 'Необходимо указать адрес';
		if (!this.order.email?.includes('@')) errs.email = 'нужна почта';
		if (!this.order.phone?.trim()) errs.phone = 'нужен телефон';

		this.formErrors = errs;
		const ok = Object.keys(errs).length === 0;
		this.events.emit('form:errors', errs);
		return { valid: ok, errors: ok ? '' : 'есть ошибки' };
	}

	private syncOrderFromBasket() {
		this.order.items = [...this.basket];
		this.order.total = this.getTotal();
		localStorage.setItem('basket', JSON.stringify(this.basket));
	}
}

// Точка входа приложения: подключаем стили, собираем слои и вьюшки

import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { FormErrors, IContactsForm, IOrderForm, IProductItem } from './types';
import { LarekAPI } from './components/model/LarekApi';
import { Success } from './components/view/Success';
import { Order } from './components/view/Order';
import { Card } from './components/view/Card';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { BasketItem } from './components/view/BasketItem';
import { Contacts } from './components/view/Contacts';
import { AppState } from './components/model/AppState';

const events = new EventEmitter();
const app = new AppState(events);
const api = new LarekAPI(CDN_URL, API_URL);
const tplCard = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const tplBasket = ensureElement<HTMLTemplateElement>('#basket');
const tplBasketItem = ensureElement<HTMLTemplateElement>('#card-basket');
const tplOrder = ensureElement<HTMLTemplateElement>('#order');
const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess = ensureElement<HTMLTemplateElement>('#success');
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new Basket(tplBasket, events);

const isInBasket = (id?: string) =>
	typeof (app as any).isInBasket === 'function'
		? (app as any).isInBasket(id)
		: app.getBasketItems().some((p) => p.id === id);

const makeCard = (data: IProductItem, inCatalog = true) => {
	const tpl = inCatalog ? tplCard : tplPreview;
	const node = cloneTemplate(tpl);

	const view = new Card(inCatalog ? 'card' : 'preview', node, {
		onOpen: () => {
			const content = makeCard(data, false);
			modal.render({ content });
		},
		onBuy: (e: MouseEvent) => {
			e.preventDefault();
			if (data.price == null || !data.id) return;

			if (isInBasket(data.id)) {
				events.emit('basket:remove', { id: data.id });
			} else {
				events.emit('basket:add', { id: data.id });
			}
			page.counter = app.getBasketCount();

			if (!inCatalog) {
				const content = makeCard(data, false);
				modal.render({ content });
			}
		},
	});

	let buttonText: string | undefined;

	if (inCatalog) {
		buttonText = undefined;
	} else if (data.price === null) {
		buttonText = 'Скоро';
	} else if (isInBasket(data.id)) {
		buttonText = 'Удалить из корзины';
	} else {
		buttonText = 'Купить';
	}

	return view.render({
		...data,
		buttonText,
	});
};


const renderCatalog = (items: IProductItem[]) => {
	const widgets = items.map((it) => makeCard(it, true));
	events.emit('page:catalog', { widgets });
};

const renderBasket = () => {
	const items = app.getBasketItems().map((item, i) => {
		const row = new BasketItem(cloneTemplate(tplBasketItem), events);
		const el = row.render({
			index: i + 1,
			title: item.title,
			price: item.price!,
			id: item.id!,
		});
		(el as HTMLElement).dataset.id = item.id!;
		return el;
	});

	basketView.items = items;
	basketView.total = app.getTotal();
	basketView.buttonText = app.getTotal() ? 'Оформить' : 'Корзина пуста';
};

events.on<{ items: IProductItem[] }>('catalog:update', ({ items }) => {
	renderCatalog(items);
});

events.on('basket:open', () => {
	renderBasket();
	modal.render({ content: basketView.render() });
});

events.on<{ id: string }>('basket:add', ({ id }) => {
	app.addToBasketById(id);
	page.counter = app.getBasketCount();
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
	app.removeFromBasket(id);
	page.counter = app.getBasketCount();
	renderBasket();
});

events.on('order:start', () => {
	const order = new Order(cloneTemplate(tplOrder), events);
	modal.render({ content: order.render({ payment: 'card', address: '' }) });
});

events.on<IOrderForm>('order:to-contacts', (form) => {
	app.setOrderField('payment', form.payment);
	app.setOrderField('address', form.address);

	const contacts = new Contacts(cloneTemplate(tplContacts), events);

	modal.render({
		content: contacts.render({
			email: app.getOrder().email ?? '',
			phone: app.getOrder().phone ?? '',
		}),
	});
});

events.on<IContactsForm>('contacts:submit', async (contacts) => {
	app.setOrderField('email', contacts.email);
	app.setOrderField('phone', contacts.phone);
	const validity = app.validateOrder();
	if (!validity.valid) {
		events.emit<FormErrors>('form:errors', { ...app.formErrors });
		return;
	}

	const total = app.getTotal();
	try {
		const result = await api.orderItems(app.getOrder());
		const success = new Success(cloneTemplate(tplSuccess), {
			onClick: () => modal.close(),
		});
		modal.render({ content: success.render({ total }) });
		app.clearBasket();
		page.counter = 0;
	} catch (e) {
		console.error('Ошибка API:', e);
	}
});

events.on<{ locked: boolean }>('page:lock', ({ locked }) => {
	page.locked = locked;
});


(async () => {
	try {
		const items = await api.getItems();
		app.setCatalog(items);
		events.emit('catalog:update', { items });
		page.counter = app.getBasketCount();
	} catch (e) {
		console.error('Не удалось получить каталог', e);
	}
})();
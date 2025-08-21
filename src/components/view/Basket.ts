// Окно корзины: список позиций, сумма, кнопка оформления

import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class Basket extends Component {
	private itemsList = this.container.querySelector('.basket__list') as HTMLElement;
	private totalPriceElement = this.container.querySelector('.basket__price') as HTMLElement;
	private checkoutButton = this.container.querySelector(
		'.basket__button'
	) as HTMLButtonElement;

	constructor(container: HTMLTemplateElement, private events: EventEmitter) {
		super(container.content.firstElementChild as HTMLElement);
		this.checkoutButton?.addEventListener('click', () => this.events.emit('order:start'));
	}

	// помещаем товары в корзину
	set items(nodes: HTMLElement[]) {
		this.itemsList.replaceChildren(...nodes);
	}

	// общая сумма
	set total(totalPrice: number) {
		this.totalPriceElement.textContent = `${totalPrice} синапсов`;
		this.setDisabled(this.checkoutButton, totalPrice <= 0);
	}

	// текст на кнопке оформления
	set buttonText(text: string) {
		if (this.checkoutButton) this.checkoutButton.textContent = text;
	}
}

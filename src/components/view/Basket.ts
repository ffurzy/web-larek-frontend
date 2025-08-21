// Окно корзины: список позиций, сумма, кнопка оформления

import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class Basket extends Component {
	private list = this.container.querySelector('.basket__list') as HTMLElement;
	private sum = this.container.querySelector('.basket__price') as HTMLElement;
	private btn = this.container.querySelector(
		'.basket__button'
	) as HTMLButtonElement;

	constructor(container: HTMLTemplateElement, private events: EventEmitter) {
		super(container.content.firstElementChild as HTMLElement);
		this.btn?.addEventListener('click', () => this.events.emit('order:start'));
	}

	// помещаем товар в корзину
	set items(nodes: HTMLElement[]) {
		this.list.replaceChildren(...nodes);
	}

	set total(v: number) {
		// показываем сумму
		this.sum.textContent = `${v} синапсов`;
		this.setDisabled(this.btn, v <= 0);
	}

	// текст на кнопку
	set buttonText(t: string) {
		if (this.btn) this.btn.textContent = t;
	}
}

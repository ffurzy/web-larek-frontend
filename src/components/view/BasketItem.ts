import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { IBasketItem } from '../../types';

export class BasketItem extends Component<IBasketItem> {
	private index = this.container.querySelector('.basket__item-index');
	private title = this.container.querySelector('.card__title');
	private price = this.container.querySelector('.card__price');
	private del = this.container.querySelector(
		'.basket__item-delete'
	) as HTMLButtonElement;

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);
	}

	render(data: IBasketItem) {
		this.setText(this.index, String(data.index));
		this.setText(this.title, data.title);
		this.setText(this.price, `${data.price} синапсов`);
		this.del?.addEventListener('click', () => {
			this.events.emit('basket:remove', {
				id: (this.container as any).dataset.id,
			});
		});
		return this.container;
	}
}

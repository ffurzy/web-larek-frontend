import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { IBasketItem } from '../../types';

export class BasketItem extends Component<IBasketItem> {
	private itemIndexElement = this.container.querySelector('.basket__item-index');
	private itemTitleElement = this.container.querySelector('.card__title');
	private itemPriceElement = this.container.querySelector('.card__price');
	private deleteButton = this.container.querySelector(
		'.basket__item-delete'
	) as HTMLButtonElement;

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);
	}

	render(data: IBasketItem) {
		this.setText(this.itemIndexElement, String(data.index));
		this.setText(this.itemTitleElement, data.title);
		this.setText(this.itemPriceElement, `${data.price} синапсов`);

		this.deleteButton?.addEventListener('click', () => {
			this.events.emit('basket:remove', {
				id: (this.container as HTMLElement).dataset.id,
			});
		});

		return this.container;
	}
}

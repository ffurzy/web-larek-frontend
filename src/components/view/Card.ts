import { Component } from '../base/Component';
import { IProductItem } from '../../types';

type CardHandlers = {
	onOpen?: () => void;
	onBuy?: (e: MouseEvent) => void;
};

export class Card extends Component<IProductItem> {
	private titleElement = this.container.querySelector('.card__title');
	private imageElement = this.container.querySelector(
		'.card__image'
	) as HTMLImageElement;
	private priceElement = this.container.querySelector('.card__price');
	private categoryElement = this.container.querySelector('.card__category');
	private descriptionElement = this.container.querySelector('.card__text');
	private buttonElement = this.container.querySelector(
		'.card__button'
	) as HTMLButtonElement;

	constructor(
		private mode: 'card' | 'preview',
		container: HTMLElement,
		handlers?: CardHandlers
	) {
		super(container);

		if (this.mode === 'card') {
			this.container.addEventListener('click', (e) => {
				e.preventDefault();
				if ((e.target as HTMLElement)?.closest('.card__button')) return;
				handlers?.onOpen?.();
			});
		}

		if (this.mode === 'preview' && this.buttonElement) {
			this.buttonElement.addEventListener('click', (e) => handlers?.onBuy?.(e));
		}
	}

	render(data: IProductItem & { buttonText?: string }) {
		this.setText(this.titleElement, data.title);
		this.setImage(this.imageElement, data.image, data.title);
		this.setText(
			this.priceElement,
			data.price == null ? 'Бесценно' : `${data.price} синапсов`
		);
		this.setText(this.categoryElement, data.category);
		if (this.descriptionElement) {
			this.setText(this.descriptionElement, data.description ?? '');
		}

		if (this.mode === 'preview' && this.buttonElement) {
			this.buttonElement.textContent = data.buttonText ?? 'Купить';
			this.buttonElement.disabled = data.price == null;
		}
		return this.container;
	}
}

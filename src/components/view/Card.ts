import { Component } from '../base/Component';
import { IProductItem } from '../../types';

type CardHandlers = {
	onOpen?: () => void;
	onBuy?: (e: MouseEvent) => void;
};

export class Card extends Component<IProductItem> {
	private title = this.container.querySelector('.card__title');
	private img = this.container.querySelector(
		'.card__image'
	) as HTMLImageElement;
	private price = this.container.querySelector('.card__price');
	private category = this.container.querySelector('.card__category');
	private desc = this.container.querySelector('.card__text');
	private btn = this.container.querySelector(
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

		if (this.mode === 'preview' && this.btn) {
			this.btn.addEventListener('click', (e) => handlers?.onBuy?.(e));
		}
	}

	render(data: IProductItem & { buttonText?: string }) {
		this.setText(this.title, data.title);
		this.setImage(this.img, data.image, data.title);
		this.setText(
			this.price,
			data.price == null ? 'Скоро' : `${data.price} синапсов`
		);
		this.setText(this.category, data.category);
		if (this.desc) this.setText(this.desc, data.description ?? '');

		if (this.mode === 'preview' && this.btn) {
			this.btn.textContent = data.buttonText ?? 'Купить';
			this.btn.disabled = data.price == null;
		}

		return this.container;
	}
}

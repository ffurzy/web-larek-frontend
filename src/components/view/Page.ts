// Управление общими элементами страницы

import { Component } from '../base/Component';

export class Page extends Component {
	private catalogElement = document.querySelector('.gallery') as HTMLElement;
	private basketCounterElement = document.querySelector(
		'.header__basket-counter'
	) as HTMLElement;
	private bodyElement = document.body;

	constructor(container: HTMLElement) {
		super(container);

		// клик по иконке корзины
		document.querySelector('.header__basket')?.addEventListener('click', () => {
			this.onBasketClick?.();
		});
	}

	public onBasketClick?: () => void;

	// обновляем счётчик корзины
	set counter(value: number) {
		this.setText(this.basketCounterElement, String(value));
	}

	// блокировка прокрутки страницы при открытом модальном окне
	set locked(isLocked: boolean) {
		this.toggleClass(this.bodyElement, 'page--locked', isLocked);
	}

	// перерисовываем каталог
	set catalogContent(nodes: HTMLElement[]) {
		if (!this.catalogElement) return;
		this.catalogElement.replaceChildren(...nodes);
	}
}

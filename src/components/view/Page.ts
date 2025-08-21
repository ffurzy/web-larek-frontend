// Управление общими элементами страницы

import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class Page extends Component {
	private catalog = document.querySelector('.gallery') as HTMLElement;
	private counterEl = document.querySelector(
		'.header__basket-counter'
	) as HTMLElement;
	private body = document.body;

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);
		document.querySelector('.header__basket')?.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
		this.events.on<{ widgets: HTMLElement[] }>(
			'page:catalog',
			({ widgets }) => {
				this.catalogContent = widgets;
			}
		);
	}

	set counter(v: number) {
		this.setText(this.counterEl, String(v));
	}

	set locked(v: boolean) {
		this.toggleClass(this.body, 'page--locked', v);
	}

	set catalogContent(nodes: HTMLElement[]) {
		if (!this.catalog) return;
		this.catalog.replaceChildren(...nodes);
	}
}

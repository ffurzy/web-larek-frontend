// components/view/Modal.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { IModalData } from '../../types';

export class Modal extends Component<IModalData> {
	private contentElement = this.container.querySelector(
		'.modal__content'
	) as HTMLElement;
	private closeButton = this.container.querySelector(
		'.modal__close'
	) as HTMLButtonElement;

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this.closeButton?.addEventListener('click', () => this.close());
		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) this.close();
		});
	}

	open() {
		this.setHidden(this.container, false);
		this.container.classList.add('modal_active');
		this.events.emit('page:lock', { locked: true });
	}

	close() {
		this.container.classList.remove('modal_active');
		this.setHidden(this.container, true);
		this.events.emit('page:lock', { locked: false });
		if (this.contentElement) this.contentElement.innerHTML = '';
	}

	render(data: IModalData) {
		if (this.contentElement) {
			this.contentElement.innerHTML = '';
			if (data?.content) this.contentElement.append(data.content);
		}
		this.open();
		return this.container;
	}
}

// Шаблон успешного оформления

import { Component } from '../base/Component';
import { ISuccessActions } from '../../types';

interface ISuccessData {
	total: number;
}

export class Success extends Component<ISuccessData> {
	private descriptionElement = this.container.querySelector(
		'.order-success__description'
	) as HTMLElement;

	private closeButton = this.container.querySelector(
		'.order-success__close'
	) as HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		// обработчик закрытия окна успеха
		this.closeButton?.addEventListener('click', () => actions.onClick());
	}

	render(data: ISuccessData) {
		this.setText(this.descriptionElement, `Списано ${data.total} синапсов`);
		return this.container;
	}
}

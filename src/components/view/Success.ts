// Шаблон успешного оформления

import { Component } from '../base/Component';
import { ISuccessActions } from '../../types';

export class Success extends Component<{ total: number }> {
	private description = this.container.querySelector(
		'.order-success__description'
	);

	private btn = this.container.querySelector(
		'.order-success__close'
	) as HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);
		this.btn?.addEventListener('click', () => actions.onClick());
	}

	render(data: { total: number }) {
		this.setText(this.description, `Списано ${data.total} синапсов`);

		return this.container;
	}
}

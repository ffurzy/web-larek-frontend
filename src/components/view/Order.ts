// components/view/Order.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { FormErrors, IOrderForm } from '../../types';

export class Order extends Component<IOrderForm> {
	private formElement = this.container as HTMLFormElement;
	private addressInput = this.container.querySelector(
		'input[name="address"]'
	) as HTMLInputElement;
	private cashButton = this.container.querySelector(
		'button[name="cash"]'
	) as HTMLButtonElement;
	private cardButton = this.container.querySelector(
		'button[name="card"]'
	) as HTMLButtonElement;
	private errorElement = this.container.querySelector(
		'.form__errors'
	) as HTMLElement;
	private nextButton = this.container.querySelector(
		'.order__button'
	) as HTMLButtonElement;
	private selectedPayment: 'card' | 'cash' = 'card';

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this.cashButton?.addEventListener('click', (event) => {
			event.preventDefault();
			this.setPayment('cash');
			this.events.emit('order:payment', { payment: 'cash' });
		});

		this.cardButton?.addEventListener('click', (event) => {
			event.preventDefault();
			this.setPayment('card');
			this.events.emit('order:payment', { payment: 'card' });
		});

		this.addressInput?.addEventListener('input', () => {
			this.events.emit('order:address', { address: this.addressInput.value });
		});

		this.formElement?.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('order:submit');
		});

		this.events.on<FormErrors>('form:errors', (formErrors) =>
			this.showErrors(formErrors)
		);
		this.events.on<boolean>('order:valid', (ok) => this.setValid(ok));
	}

	private setPayment(type: 'card' | 'cash') {
		this.selectedPayment = type;
		const activeClass = 'button_alt-active';
		this.cardButton?.classList.toggle(activeClass, type === 'card');
		this.cashButton?.classList.toggle(activeClass, type === 'cash');
	}

	private setValid(ok: boolean) {
		if (this.nextButton) this.nextButton.disabled = !ok;
	}

	private showErrors(formErrors: FormErrors) {
		const errorMessage = [formErrors.payment, formErrors.address]
			.filter(Boolean)
			.join('; ');
		this.setText(this.errorElement, errorMessage);
	}

	private setError(message: string) {
		if (this.errorElement) this.errorElement.textContent = message;
	}

	private clearError() {
		if (this.errorElement) this.errorElement.textContent = '';
	}

	render(data: IOrderForm) {
		this.setPayment((data.payment as any) || 'card');
		if (this.addressInput) this.addressInput.value = data.address ?? '';
		return this.container;
	}
}

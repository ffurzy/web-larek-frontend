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
	private errorElement = this.container.querySelector('.form__errors') as HTMLElement;
	private nextButton = this.container.querySelector(
		'.order__button'
	) as HTMLButtonElement;
	private selectedPayment: 'card' | 'cash' = 'card';

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this.cashButton?.addEventListener('click', (event) => {
			event.preventDefault();
			this.setPayment('cash');
			this.validate();
		});

		this.cardButton?.addEventListener('click', (event) => {
			event.preventDefault();
			this.setPayment('card');
			this.validate();
		});

		this.addressInput?.addEventListener('input', () => {
			this.clearError();
			this.validate();
		});

		this.formElement?.addEventListener('submit', (event) => {
			event.preventDefault();
			if (this.validate()) {
				this.events.emit<IOrderForm>('order:to-contacts', {
					payment: this.selectedPayment,
					address: this.addressInput.value.trim(),
				});
			}
		});

		this.events.on<FormErrors>('form:errors', (formErrors) => this.showErrors(formErrors));
	}

	private setPayment(type: 'card' | 'cash') {
		this.selectedPayment = type;
		const activeClass = 'button_alt-active';
		this.cardButton?.classList.toggle(activeClass, type === 'card');
		this.cashButton?.classList.toggle(activeClass, type === 'cash');
	}

	private validate(): boolean {
		const isAddressValid = !!this.addressInput?.value.trim();
		const isPaymentValid = this.selectedPayment === 'card' || this.selectedPayment === 'cash';
		const isValid = isAddressValid && isPaymentValid;

		if (this.nextButton) this.nextButton.disabled = !isValid;

		if (!isAddressValid) {
			this.setError('Необходимо указать адрес');
		} else {
			this.clearError();
		}

		return isValid;
	}

	private showErrors(formErrors: FormErrors) {
		const errorMessage = [formErrors.payment, formErrors.address].filter(Boolean).join('; ');
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
		this.validate();
		return this.container;
	}
}

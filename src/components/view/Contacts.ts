// components/view/Contacts.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { FormErrors, IContactsForm } from '../../types';

export class Contacts extends Component<IContactsForm> {
	private formElement = this.container as HTMLFormElement;
	private emailInput = this.container.querySelector(
		'input[name="email"]'
	) as HTMLInputElement;
	private phoneInput = this.container.querySelector(
		'input[name="phone"]'
	) as HTMLInputElement;
	private errorContainer = this.container.querySelector('.form__errors') as HTMLElement;
	private payButton = this.container.querySelector(
		'button[type="submit"]'
	) as HTMLButtonElement;

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this.emailInput?.addEventListener('input', () => this.validate());
		this.phoneInput?.addEventListener('input', () => this.validate());

		this.formElement?.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit<IContactsForm>('contacts:submit', {
				email: this.emailInput.value,
				phone: this.phoneInput.value,
			});
		});

		this.events.on<FormErrors>('form:errors', (formErrors) => this.showErrors(formErrors));
	}

	private validate() {
		const isEmailValid = this.emailInput?.value.includes('@');
		const isPhoneValid = this.phoneInput?.value.replace(/\D/g, '').length >= 11;
		if (this.payButton) this.payButton.disabled = !(isEmailValid && isPhoneValid);
	}

	private showErrors(formErrors: FormErrors) {
		const errorMessage = [formErrors.email, formErrors.phone].filter(Boolean).join('; ');
		this.setText(this.errorContainer, errorMessage);
	}

	render(data: IContactsForm) {
		if (this.emailInput) this.emailInput.value = data.email ?? '';
		if (this.phoneInput) this.phoneInput.value = data.phone ?? '';
		this.validate();
		return this.container;
	}
}

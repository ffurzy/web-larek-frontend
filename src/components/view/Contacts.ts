// components/view/Contacts.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { FormErrors, IContactsForm } from '../../types';

export class Contacts extends Component<IContactsForm> {
	private form = this.container as HTMLFormElement;
	private email = this.container.querySelector(
		'input[name="email"]'
	) as HTMLInputElement;
	private phone = this.container.querySelector(
		'input[name="phone"]'
	) as HTMLInputElement;
	private err = this.container.querySelector('.form__errors') as HTMLElement;
	private payBtn = this.container.querySelector(
		'button[type="submit"]'
	) as HTMLButtonElement;

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this.email?.addEventListener('input', () => this.validate());
		this.phone?.addEventListener('input', () => this.validate());

		this.form?.addEventListener('submit', (e) => {
			e.preventDefault();
			console.log('contacts submit caught!');
			this.events.emit<IContactsForm>('contacts:submit', {
				email: this.email.value,
				phone: this.phone.value,
			});
		});

		this.events.on<FormErrors>('form:errors', (f) => this.showErrors(f));
	}

	private validate() {
		const emailOk = this.email?.value.includes('@');
		const phoneOk = this.phone?.value.replace(/\D/g, '').length >= 11;
		if (this.payBtn) this.payBtn.disabled = !(emailOk && phoneOk);
	}

	private showErrors(f: FormErrors) {
		const m = [f.email, f.phone].filter(Boolean).join('; ');
		this.setText(this.err, m);
	}

	render(data: IContactsForm) {
		if (this.email) this.email.value = data.email ?? '';
		if (this.phone) this.phone.value = data.phone ?? '';
		this.validate();
		return this.container;
	}
}

// components/view/Order.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { FormErrors, IOrderForm } from '../../types';

export class Order extends Component<IOrderForm> {
	private form = this.container as HTMLFormElement;
	private address = this.container.querySelector(
		'input[name="address"]'
	) as HTMLInputElement;
	private cash = this.container.querySelector(
		'button[name="cash"]'
	) as HTMLButtonElement;
	private card = this.container.querySelector(
		'button[name="card"]'
	) as HTMLButtonElement;
	private err = this.container.querySelector('.form__errors') as HTMLElement;
	private nextBtn = this.container.querySelector(
		'.order__button'
	) as HTMLButtonElement;
	private pay: 'card' | 'cash' = 'card';

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this.cash?.addEventListener('click', (e) => {
			e.preventDefault();
			this.setPay('cash');
			this.validate();
		});

		this.card?.addEventListener('click', (e) => {
			e.preventDefault();
			this.setPay('card');
			this.validate();
		});

		this.address?.addEventListener('input', () => {
			this.clearError();
			this.validate();
		});

		this.form?.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this.validate()) {
				this.events.emit<IOrderForm>('order:to-contacts', {
					payment: this.pay,
					address: this.address.value.trim(),
				});
			}
		});

		this.events.on<FormErrors>('form:errors', (f) => this.showErrors(f));
	}

	private setPay(kind: 'card' | 'cash') {
		this.pay = kind;
		const ACTIVE = 'button_alt-active';
		this.card?.classList.toggle(ACTIVE, kind === 'card');
		this.cash?.classList.toggle(ACTIVE, kind === 'cash');
	}

	private validate(): boolean {
		const addressOk = !!this.address?.value.trim();
		const payOk = this.pay === 'card' || this.pay === 'cash';
		const valid = addressOk && payOk;

		if (this.nextBtn) this.nextBtn.disabled = !valid;

		if (!addressOk) {
			this.setError('Необходимо указать адрес');
		} else {
			this.clearError();
		}

		return valid;
	}

	private showErrors(f: FormErrors) {
		const m = [f.payment, f.address].filter(Boolean).join('; ');
		this.setText(this.err, m);
	}

	private setError(message: string) {
		if (this.err) this.err.textContent = message;
	}

	private clearError() {
		if (this.err) this.err.textContent = '';
	}

	render(data: IOrderForm) {
		this.setPay((data.payment as any) || 'card');
		if (this.address) this.address.value = data.address ?? '';
		this.validate();
		return this.container;
	}
}

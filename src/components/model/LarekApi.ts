// Клиент API магазина

import { ILarekAPI, IOrder, IOrderResult, IProductItem } from '../../types';

export class LarekAPI implements ILarekAPI {
	constructor(private cdn: string, private base: string) {}

	async getItems() {
		const res = await fetch(`${this.base}/product/`);
		if (!res.ok) throw new Error('catalog failed');

		const raw = await res.json();
		const data = Array.isArray(raw) ? raw : raw?.items;

		if (!Array.isArray(data)) {
			throw new Error('catalog: not an array');
		}

		return data.map((x: any) => ({
			...x,
			image: x.image?.startsWith('http') ? x.image : this.cdn + x.image,
		}));
	}

	async orderItems(order: IOrder): Promise<IOrderResult> {
		const res = await fetch(`${this.base}/order/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(order),
		});
		if (!res.ok) throw new Error('order failed');
		return (await res.json()) as IOrderResult;
	}
}

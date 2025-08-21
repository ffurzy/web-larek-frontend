// Простейшая шина событий с типами

type Handler<T = any> = (payload: T) => void;

export class EventEmitter {
	private map = new Map<string, Set<Handler>>();

	on<T = any>(event: string, fn: Handler<T>) {
		if (!this.map.has(event)) this.map.set(event, new Set());
		this.map.get(event)!.add(fn as Handler);
	}

	off<T = any>(event: string, fn: Handler<T>) {
		this.map.get(event)?.delete(fn as Handler);
	}

	emit<T = any>(event: string, payload?: T) {
		this.map.get(event)?.forEach((fn) => fn(payload as T));
	}

	clear(event?: string) {
		if (event) this.map.delete(event);
		else this.map.clear();
	}
}

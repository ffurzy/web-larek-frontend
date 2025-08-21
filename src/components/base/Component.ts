// Базовый класс для вьюшек
export abstract class Component<T = any> {
	constructor(protected readonly container: HTMLElement) {}

	// подстановка текста в узел
	protected setText(el: Element | null, text?: string) {
		if (el) el.textContent = String(text ?? '');
	}

	// установка изоображения с альтернативным текстом
	protected setImage(img: HTMLImageElement | null, src?: string, alt?: string) {
		if (!img) return;
		if (src) img.src = src;
		if (alt) img.alt = alt;
	}

	// вкл/выкл класс
	protected toggleClass(el: Element | null, cls: string, force?: boolean) {
		if (!el) return;
		el.classList.toggle(cls, force);
	}

	// дизейбл для кнопок/полей
	protected setDisabled(
		el: HTMLButtonElement | HTMLInputElement | null,
		v: boolean
	) {
		if (el) el.disabled = v;
	}

	// скрыть/показать
	protected setHidden(el: Element | null, v: boolean) {
		if (!el) return;
		this.toggleClass(el, 'hidden', v);
		(el as HTMLElement).style.display = v ? 'none' : '';
	}

	// общий паттерн рендера
	render(data?: T) {
		return this.container;
	}
}

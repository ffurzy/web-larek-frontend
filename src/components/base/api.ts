export type ApiListResponse<T> = { total: number; items: T[] };
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            ...options,
        };
    }

    protected async handleResponse(res: Response) {
        if (!res.ok) {
            const msg = await res.text().catch(() => res.statusText);
            throw new Error(`${res.status} ${res.statusText}: ${msg}`);
        }
        const ct = res.headers.get('content-type') || '';
        return ct.includes('application/json') ? res.json() : res.text();
    }

    get<T = unknown>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, { ...this.options, method: 'GET' }).then(
            this.handleResponse
        ) as Promise<T>;
    }

    post<T = unknown>(
        uri: string,
        data: object,
        method: ApiPostMethods = 'POST'
    ): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data),
        }).then(this.handleResponse) as Promise<T>;
    }
}

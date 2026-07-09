export interface ListParams {
    search?: string;
    page?: number;
    perPage?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    perPage: number;
}

type ResourceWithId = { id: number };

export function createResourceStore<T extends ResourceWithId>(initialRows: T[]) {
    let rows = [...initialRows];

    function delay<R>(result: R): Promise<R> {
        return new Promise((resolve) => {
            window.setTimeout(() => resolve(result), 180);
        });
    }

    return {
        async list(params: ListParams = {}): Promise<PaginatedResponse<T>> {
            const page = params.page ?? 1;
            const perPage = params.perPage ?? 10;
            const normalizedSearch = params.search?.trim().toLowerCase();
            const filteredRows = normalizedSearch
                ? rows.filter((row) =>
                      Object.values(row).some((value) =>
                          String(value).toLowerCase().includes(normalizedSearch)
                      )
                  )
                : rows;

            const start = (page - 1) * perPage;

            return delay({
                data: filteredRows.slice(start, start + perPage),
                total: filteredRows.length,
                page,
                perPage,
            });
        },

        async all(): Promise<T[]> {
            return delay([...rows]);
        },

        async get(id: number): Promise<T> {
            const row = rows.find((item) => item.id === id);

            if (!row) {
                throw new Error('Record not found');
            }

            return delay(row);
        },

        async create(payload: Omit<T, 'id'>): Promise<T> {
            const nextId = Math.max(0, ...rows.map((row) => row.id)) + 1;
            const row = { id: nextId, ...payload } as T;
            rows = [row, ...rows];

            return delay(row);
        },

        async update(id: number, payload: Omit<T, 'id'>): Promise<T> {
            const row = { id, ...payload } as T;
            rows = rows.map((item) => (item.id === id ? row : item));

            return delay(row);
        },

        async remove(id: number): Promise<void> {
            rows = rows.filter((item) => item.id !== id);

            return delay(undefined);
        },
    };
}

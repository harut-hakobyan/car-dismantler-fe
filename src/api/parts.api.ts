import api from './axios';
import type { ListParams } from './resourceStore';
import type { PartResource } from '../types/resources';
import type {
    CarOption,
    PartFormValues,
    PartSaleOption,
    SellPartFormValues,
} from '../pages/Parts/parts.types';

export const partsApi = {
    async list(params?: ListParams) {
        const response = await api.get<{
            data: PartResource[];
            total: number;
            page: number;
            perPage: number;
        }>('/parts', {
            params: {
                search: params?.search,
                page: params?.page,
                per_page: params?.perPage,
            },
        });

        return response.data;
    },

    async create(payload: PartFormValues) {
        return (await api.post<PartResource>('/parts', payload)).data;
    },

    async update(id: number, payload: PartFormValues) {
        return (await api.put<PartResource>(`/parts/${id}`, payload)).data;
    },

    async remove(id: number) {
        await api.delete(`/parts/${id}`);
    },

    async sell(payload: SellPartFormValues) {
        return (await api.post<PartResource>(`/parts/${payload.part_id}/sell`, payload)).data;
    },

    async carOptions(): Promise<CarOption[]> {
        return (await api.get<CarOption[]>('/cars/options')).data;
    },

    async saleOptions(): Promise<PartSaleOption[]> {
        return (await api.get<PartSaleOption[]>('/parts/options', {
            params: { sellable: true },
        })).data;
    },
};

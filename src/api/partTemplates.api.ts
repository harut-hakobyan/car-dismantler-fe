import api from './axios';
import type { ListParams, PaginatedResponse } from './resourceStore';
import type { PartTemplateResource } from '../types/resources';

function toQuery(params?: ListParams) {
    return {
        search: params?.search,
        page: params?.page,
        per_page: params?.perPage,
    };
}

export const partTemplatesApi = {
    async list(params?: ListParams): Promise<PaginatedResponse<PartTemplateResource>> {
        const response = await api.get<PaginatedResponse<PartTemplateResource>>('/part-templates', {
            params: toQuery(params),
        });

        return response.data;
    },
    async create(payload: Omit<PartTemplateResource, 'id' | 'make' | 'model' | 'fitment'>) {
        return (await api.post<PartTemplateResource>('/part-templates', payload)).data;
    },
    async update(id: number, payload: Omit<PartTemplateResource, 'id' | 'make' | 'model' | 'fitment'>) {
        return (await api.put<PartTemplateResource>(`/part-templates/${id}`, payload)).data;
    },
    async remove(id: number) {
        await api.delete(`/part-templates/${id}`);
    },
};

import type { ListParams } from './resourceStore';
import api from './axios';
import type {
    ActivityItem,
    CarResource,
    CustomerResource,
    DashboardDetails,
    DashboardSummary,
    CarMakeResource,
    CarModelResource,
    CatalogPartResource,
    OrderResource,
    PartResource,
    PermissionResource,
    RoleResource,
    UserResource,
} from '../types/resources';
import type { PaginatedResponse } from './resourceStore';

function toQuery(params?: ListParams) {
    return {
        search: params?.search,
        page: params?.page,
        per_page: params?.perPage,
    };
}

async function listResource<T>(url: string, params?: ListParams) {
    const response = await api.get<PaginatedResponse<T>>(url, {
        params: toQuery(params),
    });

    return response.data;
}

export const dashboardApi = {
    async summary() {
        return (await api.get<DashboardSummary>('/dashboard/summary')).data;
    },
    async details() {
        return (await api.get<DashboardDetails>('/dashboard/details')).data;
    },
    async activity() {
        return (await api.get<ActivityItem[]>('/dashboard/activity')).data;
    },
    async recentOrders() {
        return (await api.get<OrderResource[]>('/orders/recent')).data;
    },
};

export const usersApi = {
    list: (params?: ListParams) => listResource<UserResource>('/users', params),
    async create(payload: Omit<UserResource, 'id'>) {
        return (await api.post<{ user: UserResource }>('/users', payload)).data.user;
    },
    async update(id: number, payload: Omit<UserResource, 'id'>) {
        return (await api.put<{ user: UserResource }>(`/users/${id}`, payload)).data.user;
    },
    async remove(id: number) {
        await api.delete(`/users/${id}`);
    },
};

export const rolesApi = {
    async list(params?: ListParams) {
        const roles = (await api.get<RoleResource[]>('/roles')).data;

        return {
            data: roles,
            total: roles.length,
            page: params?.page ?? 1,
            perPage: params?.perPage ?? roles.length,
        };
    },
    async all() {
        return (await api.get<RoleResource[]>('/roles')).data;
    },
    async update(id: number, payload: Omit<RoleResource, 'id'>) {
        return (await api.put<{ role: RoleResource }>(`/roles/${id}`, payload)).data.role;
    },
};

export const permissionsApi = {
    async all() {
        return (await api.get<PermissionResource[]>('/permissions')).data;
    },
};

export const carsApi = {
    list: (params?: ListParams) => listResource<CarResource>('/cars', params),
    async makes() {
        return (await api.get<CarMakeResource[]>('/car-makes')).data;
    },
    async models(makeId: number) {
        return (await api.get<CarModelResource[]>(`/car-makes/${makeId}/models`)).data;
    },
    async catalogPreview(payload: { car_make_id: number; car_model_id: number; year: number }) {
        return (await api.get<CatalogPartResource[]>('/cars/catalog-preview', { params: payload })).data;
    },
    async create(payload: Omit<CarResource, 'id'>) {
        return (await api.post<CarResource>('/cars', payload)).data;
    },
    async update(id: number, payload: Omit<CarResource, 'id'>) {
        return (await api.put<CarResource>(`/cars/${id}`, payload)).data;
    },
    async remove(id: number) {
        await api.delete(`/cars/${id}`);
    },
};

export const partsApi = {
    list: (params?: ListParams) => listResource<PartResource>('/parts', params),
    async create(payload: Omit<PartResource, 'id'>) {
        return (await api.post<PartResource>('/parts', payload)).data;
    },
    async update(id: number, payload: Omit<PartResource, 'id'>) {
        return (await api.put<PartResource>(`/parts/${id}`, payload)).data;
    },
    async remove(id: number) {
        await api.delete(`/parts/${id}`);
    },
};

export const ordersApi = {
    list: (params?: ListParams) => listResource<OrderResource>('/orders', params),
    async get(id: number) {
        return (await api.get<OrderResource>(`/orders/${id}`)).data;
    },
    async update(id: number, payload: Omit<OrderResource, 'id'>) {
        return (await api.put<OrderResource>(`/orders/${id}`, payload)).data;
    },
};

export const customersApi = {
    list: (params?: ListParams) => listResource<CustomerResource>('/customers', params),
    async create(payload: Omit<CustomerResource, 'id'>) {
        return (await api.post<CustomerResource>('/customers', payload)).data;
    },
    async update(id: number, payload: Omit<CustomerResource, 'id'>) {
        return (await api.put<CustomerResource>(`/customers/${id}`, payload)).data;
    },
    async remove(id: number) {
        await api.delete(`/customers/${id}`);
    },
};

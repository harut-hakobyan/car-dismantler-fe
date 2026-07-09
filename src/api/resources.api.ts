import {
    activity,
    cars,
    customers,
    dashboardSummary,
    orders,
    parts,
    permissions,
    roles,
    users,
} from './mockData';
import { createResourceStore } from './resourceStore';
import type { ListParams } from './resourceStore';

const usersStore = createResourceStore(users);
const rolesStore = createResourceStore(roles);
const carsStore = createResourceStore(cars);
const partsStore = createResourceStore(parts);
const ordersStore = createResourceStore(orders);
const customersStore = createResourceStore(customers);

export const dashboardApi = {
    async summary() {
        // TODO: GET /api/dashboard/summary
        return dashboardSummary;
    },
    async activity() {
        // TODO: GET /api/dashboard/activity
        return activity;
    },
    async recentOrders() {
        // TODO: GET /api/orders?sort=-created_at&limit=5
        return orders.slice(0, 5);
    },
};

export const usersApi = {
    list: (params?: ListParams) => usersStore.list(params),
    create: usersStore.create,
    update: usersStore.update,
    remove: usersStore.remove,
    // TODO: connect list/create/update/remove to /api/users
};

export const rolesApi = {
    list: (params?: ListParams) => rolesStore.list(params),
    all: rolesStore.all,
    update: rolesStore.update,
    // TODO: connect list/all/update to /api/roles and /api/roles/{id}/permissions
};

export const permissionsApi = {
    async all() {
        // TODO: GET /api/permissions
        return permissions;
    },
};

export const carsApi = {
    list: (params?: ListParams) => carsStore.list(params),
    create: carsStore.create,
    update: carsStore.update,
    remove: carsStore.remove,
    // TODO: connect list/create/update/remove to /api/cars
};

export const partsApi = {
    list: (params?: ListParams) => partsStore.list(params),
    create: partsStore.create,
    update: partsStore.update,
    remove: partsStore.remove,
    // TODO: connect list/create/update/remove to /api/parts
};

export const ordersApi = {
    list: (params?: ListParams) => ordersStore.list(params),
    get: ordersStore.get,
    update: ordersStore.update,
    // TODO: connect list/get/update to /api/orders
};

export const customersApi = {
    list: (params?: ListParams) => customersStore.list(params),
    create: customersStore.create,
    update: customersStore.update,
    remove: customersStore.remove,
    // TODO: connect list/create/update/remove to /api/customers
};

import { cars, parts } from './mockData';
import { createResourceStore } from './resourceStore';
import type { ListParams } from './resourceStore';
import type { PartResource } from '../types/resources';
import type {
    CarOption,
    PartFormValues,
    PartSaleOption,
    SellPartFormValues,
} from '../pages/Parts/parts.types';

const partsStore = createResourceStore<PartResource>(parts);

export const partsApi = {
    async list(params?: ListParams) {
        // TODO: GET /api/parts?search=&page=&per_page=
        return partsStore.list(params);
    },

    async create(payload: PartFormValues) {
        // TODO: POST /api/parts
        return partsStore.create(payload);
    },

    async update(id: number, payload: PartFormValues) {
        // TODO: PUT /api/parts/{id}
        return partsStore.update(id, payload);
    },

    async remove(id: number) {
        // TODO: DELETE /api/parts/{id}
        return partsStore.remove(id);
    },

    async sell(payload: SellPartFormValues) {
        // TODO: POST /api/parts/{id}/sell
        const part = await partsStore.get(payload.part_id);

        if (payload.quantity > part.quantity) {
            throw new Error('Not enough quantity available');
        }

        const updatedQuantity = part.quantity - payload.quantity;
        const { id, ...partPayload } = part;

        return partsStore.update(id, {
            ...partPayload,
            quantity: updatedQuantity,
            status: updatedQuantity === 0 ? 'inactive' : part.status,
        });
    },

    async carOptions(): Promise<CarOption[]> {
        // TODO: GET /api/cars/options
        return cars.map((car) => ({
            id: car.id,
            label: `${car.year} ${car.make} ${car.model} - ${car.vin}`,
        }));
    },

    async saleOptions(): Promise<PartSaleOption[]> {
        // TODO: GET /api/parts/options?sellable=true
        const allParts = await partsStore.all();

        return allParts
            .filter((part) => part.quantity > 0)
            .map((part) => ({
                id: part.id,
                label: `${part.name} - ${part.sku}`,
                sku: part.sku,
                price: part.price,
                quantity: part.quantity,
            }));
    },
};

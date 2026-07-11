import type { CarMakeResource, CarModelResource } from '../../types/resources';

export const carStatuses = ['active', 'inactive', 'pending'] as const;
export const carColors = [
    'Black',
    'White',
    'Gray',
    'Silver',
    'Blue',
    'Red',
    'Green',
    'Yellow',
    'Orange',
    'Brown',
    'Beige',
    'Gold',
    'Purple',
    'Maroon',
    'Navy',
] as const;

export interface CarFormValues {
    vin: string;
    car_make_id: number;
    car_model_id: number;
    year: number;
    color: string;
    mileage: number;
    status: (typeof carStatuses)[number];
    purchase_price: number;
    sale_price: number;
}

export type CarMakeOption = CarMakeResource;
export type CarModelOption = CarModelResource;

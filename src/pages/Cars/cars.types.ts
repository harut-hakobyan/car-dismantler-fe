import type { TranslationKey } from '../../i18n/translations';
import type { CarMakeResource, CarModelResource } from '../../types/resources';

export const carStatuses = ['active', 'inactive', 'pending'] as const;
export type CarStatus = (typeof carStatuses)[number];

export const carStatusTranslationKeys: Record<CarStatus, TranslationKey> = {
    active: 'status.active',
    inactive: 'status.inactive',
    pending: 'status.pending',
} as const;

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

export type CarColor = (typeof carColors)[number];

export const carColorTranslationKeys: Record<CarColor, TranslationKey> = {
    Black: 'cars.color.black',
    White: 'cars.color.white',
    Gray: 'cars.color.gray',
    Silver: 'cars.color.silver',
    Blue: 'cars.color.blue',
    Red: 'cars.color.red',
    Green: 'cars.color.green',
    Yellow: 'cars.color.yellow',
    Orange: 'cars.color.orange',
    Brown: 'cars.color.brown',
    Beige: 'cars.color.beige',
    Gold: 'cars.color.gold',
    Purple: 'cars.color.purple',
    Maroon: 'cars.color.maroon',
    Navy: 'cars.color.navy',
} as const;

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
    excluded_parts: string[];
}

export interface CarCatalogPart {
    id: number;
    name: string;
    category: string;
    path: string;
    sku: string;
    url: string;
    image_url?: string | null;
}

export type CarMakeOption = CarMakeResource;
export type CarModelOption = CarModelResource;

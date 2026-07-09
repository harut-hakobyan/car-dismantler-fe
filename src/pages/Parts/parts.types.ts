import type { CarResource, Status } from '../../types/resources';

export const partCategories = [
    'Engine',
    'Transmission',
    'Suspension',
    'Brake System',
    'Electrical',
    'Body Parts',
    'Interior',
    'Exterior',
    'Wheels & Tires',
    'Lights',
    'Cooling System',
    'Exhaust',
    'Fuel System',
    'Other',
] as const;

export const partConditions = [
    'New',
    'Like New',
    'Good',
    'Used',
    'Needs Repair',
] as const;

export const partStatuses = ['active', 'inactive', 'pending'] as const satisfies readonly Status[];

export type PartCategory = (typeof partCategories)[number];
export type PartCondition = (typeof partConditions)[number];
export type PartStatus = (typeof partStatuses)[number];

export interface PartFormValues {
    car_id: number;
    name: string;
    sku: string;
    category: PartCategory;
    condition: PartCondition;
    description: string;
    price: number;
    quantity: number;
    status: PartStatus;
    image_url?: string;
}

export interface CarOption {
    id: CarResource['id'];
    label: string;
}

export interface PartSaleOption {
    id: number;
    label: string;
    sku: string;
    price: number;
    quantity: number;
}

export interface SellPartFormValues {
    part_id: number;
    customer_name: string;
    quantity: number;
    sale_price: number;
    notes: string;
}

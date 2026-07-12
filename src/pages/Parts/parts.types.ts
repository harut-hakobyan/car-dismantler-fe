import type { CarResource, Status } from '../../types/resources';
import type { TranslationKey } from '../../i18n/translations';

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

export const partCategoryTranslationKeys: Record<PartCategory, TranslationKey> = {
    Engine: 'parts.category.engine',
    Transmission: 'parts.category.transmission',
    Suspension: 'parts.category.suspension',
    'Brake System': 'parts.category.brakeSystem',
    Electrical: 'parts.category.electrical',
    'Body Parts': 'parts.category.bodyParts',
    Interior: 'parts.category.interior',
    Exterior: 'parts.category.exterior',
    'Wheels & Tires': 'parts.category.wheelsTires',
    Lights: 'parts.category.lights',
    'Cooling System': 'parts.category.coolingSystem',
    Exhaust: 'parts.category.exhaust',
    'Fuel System': 'parts.category.fuelSystem',
    Other: 'parts.category.other',
};

export const partConditionTranslationKeys: Record<PartCondition, TranslationKey> = {
    New: 'parts.condition.new',
    'Like New': 'parts.condition.likeNew',
    Good: 'parts.condition.good',
    Used: 'parts.condition.used',
    'Needs Repair': 'parts.condition.needsRepair',
};

export const partStatusTranslationKeys: Record<PartStatus, TranslationKey> = {
    active: 'status.active',
    inactive: 'status.inactive',
    pending: 'status.pending',
};

export function getPartCategoryLabelKey(category: PartCategory): TranslationKey {
    return partCategoryTranslationKeys[category];
}

export function getPartCategoryLabelKeyByValue(category: string): TranslationKey {
    return partCategoryTranslationKeys[category as PartCategory] ?? 'parts.category.other';
}

export function getPartConditionLabelKey(condition: PartCondition): TranslationKey {
    return partConditionTranslationKeys[condition];
}

export function getPartConditionLabelKeyByValue(condition: string): TranslationKey {
    return partConditionTranslationKeys[condition as PartCondition] ?? 'parts.condition.good';
}

export function getPartStatusLabelKey(status: PartStatus): TranslationKey {
    return partStatusTranslationKeys[status];
}

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

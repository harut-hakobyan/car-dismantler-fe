import { z } from 'zod';
import type { TranslationKey } from '../../i18n/translations';
import { carStatuses } from './cars.types';

export function createCarSchema(t: (key: TranslationKey) => string) {
    return z.object({
        vin: z.string().min(5, t('cars.validation.vinRequired')).max(120),
        car_make_id: z.number().int().positive(t('cars.validation.selectMake')),
        car_model_id: z.number().int().positive(t('cars.validation.selectModel')),
        year: z.number().int().min(1900).max(2100),
        color: z.string().min(1, t('cars.validation.colorRequired')).max(120),
        mileage: z.number().int().min(0),
        status: z.enum(carStatuses),
        purchase_price: z.number().min(0),
        sale_price: z.number().min(0),
        excluded_parts: z.array(z.string()),
    });
}

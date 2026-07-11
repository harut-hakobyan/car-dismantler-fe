import { z } from 'zod';
import { carStatuses } from './cars.types';

export const carSchema = z.object({
    vin: z.string().min(5, 'VIN is required').max(120),
    car_make_id: z.number().int().positive('Select a make'),
    car_model_id: z.number().int().positive('Select a model'),
    year: z.number().int().min(1900).max(2100),
    color: z.string().min(1, 'Color is required').max(120),
    mileage: z.number().int().min(0),
    status: z.enum(carStatuses),
    purchase_price: z.number().min(0),
    sale_price: z.number().min(0),
});

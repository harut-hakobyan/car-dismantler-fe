import { z } from 'zod';

export const createPartTemplateSchema = () =>
    z.object({
        car_make_id: z.number().int().positive('Select a make'),
        car_model_id: z.number().int().positive('Select a model'),
        start_year: z.number().int().min(1900).max(2100).nullable(),
        end_year: z.number().int().min(1900).max(2100).nullable(),
        name: z.string().min(2, 'Template name is required').max(120),
        name_ru: z.string().max(120),
        name_hy: z.string().max(120),
        sku: z.string().min(2, 'SKU is required').max(60),
        category: z.string().min(2, 'Category is required').max(120),
        path: z.string().min(2, 'Path is required').max(255),
        url: z.string().min(2, 'URL is required').max(2048),
        image_url: z.string().max(2048),
        sort_order: z.number().int().min(0),
    });

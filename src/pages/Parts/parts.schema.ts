import { z } from 'zod';
import { partCategories, partConditions, partStatuses } from './parts.types';

export const partSchema = z.object({
    car_id: z.number().int().positive('Select a source car'),
    name: z.string().min(2, 'Part name is required').max(120),
    sku: z.string().min(2, 'SKU is required').max(60),
    category: z.enum(partCategories),
    condition: z.enum(partConditions),
    description: z.string().max(500),
    price: z.number().min(0, 'Price cannot be negative'),
    quantity: z.number().int().min(0, 'Quantity cannot be negative'),
    status: z.enum(partStatuses),
    image_url: z.string().optional(),
});

export const sellPartSchema = z.object({
    part_id: z.number().int().positive('Select a part to sell'),
    customer_name: z.string().min(2, 'Customer name is required').max(120),
    quantity: z.number().int().positive('Quantity must be at least 1'),
    sale_price: z.number().min(0, 'Sale price cannot be negative'),
    notes: z.string().max(300),
});

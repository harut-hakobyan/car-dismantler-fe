import type { CarMakeOption, CarModelOption } from '../Cars/cars.types';

export interface PartTemplateFormValues {
    car_make_id: number;
    car_model_id: number;
    start_year: number | null;
    end_year: number | null;
    name: string;
    name_ru: string;
    name_hy: string;
    sku: string;
    category: string;
    path: string;
    url: string;
    image_url: string;
    sort_order: number;
}

export interface PartTemplateMakeOption extends CarMakeOption {}

export interface PartTemplateModelOption extends CarModelOption {}

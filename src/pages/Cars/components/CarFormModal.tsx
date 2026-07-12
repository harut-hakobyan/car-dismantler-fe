import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Checkbox,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CarMakeOption, CarModelOption, CarFormValues } from '../cars.types';
import { carColorTranslationKeys, carColors, carStatusTranslationKeys, carStatuses } from '../cars.types';
import { createCarSchema } from '../cars.schema';
import { useTranslation } from '../../../hooks/useTranslation';
import { carsApi } from '../../../api/resources.api';
import type { CatalogPartResource } from '../../../types/resources';
import type { TranslationKey } from '../../../i18n/translations';
import { getLocalizedPartName } from '../../../utils/partLocalization';

function translateCatalogCategory(category: string, translate: (key: TranslationKey) => string): string {
    const normalized = category.trim().toLowerCase();
    const segments = normalized.split('/').map((segment) => segment.trim()).filter(Boolean);

    if (segments.length === 0) {
        return translate('cars.catalog.uncategorized');
    }

    return segments.map((segment) => {
        switch (segment) {
            case 'engine':
                return translate('cars.catalog.category.engine');
            case 'engine block':
                return translate('cars.catalog.category.engineBlock');
            case 'body':
                return translate('cars.catalog.category.body');
            case 'front section':
                return translate('cars.catalog.category.frontSection');
            case 'rear section':
                return translate('cars.catalog.category.rearSection');
            case 'lighting':
            case 'lights':
                return translate('cars.catalog.category.lighting');
            case 'transmission':
                return translate('cars.catalog.category.transmission');
            case 'steering':
                return translate('cars.catalog.category.steering');
            case 'suspension':
                return translate('cars.catalog.category.suspension');
            case 'brakes':
                return translate('cars.catalog.category.brakes');
            case 'cooling':
                return translate('cars.catalog.category.cooling');
            case 'fuel':
            case 'fuel system':
                return translate('cars.catalog.category.fuel');
            case 'exhaust':
                return translate('cars.catalog.category.exhaust');
            case 'electrical':
            case 'electrical system':
                return translate('cars.catalog.category.electrical');
            case 'interior':
                return translate('cars.catalog.category.interior');
            case 'glass':
                return translate('cars.catalog.category.glass');
            case 'doors':
                return translate('cars.catalog.category.doors');
            case 'mirrors':
                return translate('cars.catalog.category.mirrors');
            case 'wheels':
                return translate('cars.catalog.category.wheels');
            case 'air conditioning':
                return translate('cars.catalog.category.airConditioning');
            case 'safety':
                return translate('cars.catalog.category.safety');
            case 'trim':
                return translate('cars.catalog.category.trim');
            default:
                return segment;
        }
    }).join(' / ');
}

interface Props {
    open: boolean;
    mode: 'create' | 'edit';
    makes: CarMakeOption[];
    models: CarModelOption[];
    defaultValues?: CarFormValues;
    isSaving: boolean;
    onClose: () => void;
    onMakeChange: (makeId: number) => void;
    onSubmit: (values: CarFormValues) => Promise<void>;
}

const emptyValues: CarFormValues = {
    vin: '',
    car_make_id: 0,
    car_model_id: 0,
    year: new Date().getFullYear(),
    color: '',
    mileage: 0,
    status: 'active',
    purchase_price: 0,
    sale_price: 0,
    excluded_parts: [],
};

export default function CarFormModal({
    open,
    mode,
    makes,
    models,
    defaultValues,
    isSaving,
    onClose,
    onMakeChange,
    onSubmit,
}: Props) {
    const { t, language } = useTranslation();
    const carSchema = useMemo(() => createCarSchema(t), [t]);
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CarFormValues>({
        resolver: zodResolver(carSchema),
        defaultValues: defaultValues ?? {
            ...emptyValues,
            excluded_parts: [],
        },
    });

    const selectedMakeId = watch('car_make_id');
    const selectedModelId = watch('car_model_id');
    const selectedYear = watch('year');
    const excludedParts = watch('excluded_parts') ?? [];
    const [partFilter, setPartFilter] = useState('');

    const catalogPreviewQuery = useQuery({
        queryKey: ['car-catalog-preview', selectedMakeId, selectedModelId, selectedYear],
        queryFn: () =>
            carsApi.catalogPreview({
                car_make_id: selectedMakeId,
                car_model_id: selectedModelId,
                year: selectedYear,
            }),
        enabled: open && mode === 'create' && selectedMakeId > 0 && selectedModelId > 0 && selectedYear > 0,
    });

    useEffect(() => {
        const fallbackValues = makes.length > 0
            ? {
                ...emptyValues,
                car_make_id: makes[0].id,
                excluded_parts: [],
            }
            : {
                ...emptyValues,
                excluded_parts: [],
            };

        reset(defaultValues ?? fallbackValues);
    }, [defaultValues, makes, reset, open]);

    useEffect(() => {
        if (selectedMakeId) {
            onMakeChange(selectedMakeId);
        }
    }, [onMakeChange, selectedMakeId]);

    useEffect(() => {
        if (mode === 'create') {
            setValue('excluded_parts', []);
        }
    }, [mode, selectedMakeId, selectedModelId, selectedYear, setValue]);

    const filteredModels = useMemo(
        () => models.filter((model) => model.car_make_id === selectedMakeId),
        [models, selectedMakeId]
    );

    async function submit(values: CarFormValues) {
        await onSubmit(values);
        reset({
            ...emptyValues,
            excluded_parts: [],
        });
        setPartFilter('');
    }

    function closeModal() {
        reset({
            ...emptyValues,
            excluded_parts: [],
        });
        setPartFilter('');
        onClose();
    }

    const catalogParts: CatalogPartResource[] = catalogPreviewQuery.data ?? [];
    const filteredCatalogParts = catalogParts.filter((part) => {
        const search = partFilter.trim().toLowerCase();
        if (!search) {
            return true;
        }

        const localizedName = getLocalizedPartName(part, language);

        return [localizedName, part.name, part.category, translateCatalogCategory(part.category, t), part.path, part.sku]
            .some((value) => value.toLowerCase().includes(search));
    });

    const groupedCatalogParts = useMemo(() => {
        const groups = new Map<string, CatalogPartResource[]>();

        filteredCatalogParts.forEach((part) => {
            const key = part.category?.trim() || t('cars.catalog.uncategorized');
            const existing = groups.get(key);

            if (existing) {
                existing.push(part);
                return;
            }

            groups.set(key, [part]);
        });

        return Array.from(groups.entries()).map(([category, parts]) => ({
            category,
            label: category === t('cars.catalog.uncategorized') ? category : translateCatalogCategory(category, t),
            parts,
        }));
    }, [filteredCatalogParts, t]);

    return (
        <Dialog open={open} onClose={isSaving ? undefined : closeModal} fullWidth maxWidth="md">
            <DialogTitle>{mode === 'edit' ? t('cars.edit') : t('cars.add')}</DialogTitle>
            <DialogContent>
                <Stack component="form" id="car-form" spacing={2} sx={{ mt: 1 }} onSubmit={handleSubmit(submit)}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="vin"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('cars.vin')}
                                        fullWidth
                                        error={!!errors.vin}
                                        helperText={errors.vin?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="car_make_id"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        select
                                        {...field}
                                        label={t('cars.make')}
                                        fullWidth
                                        value={field.value || ''}
                                        onChange={(event) => {
                                            const makeId = Number(event.target.value);
                                            field.onChange(makeId);
                                            setValue('car_model_id', 0);
                                            onMakeChange(makeId);
                                        }}
                                        error={!!errors.car_make_id}
                                        helperText={errors.car_make_id?.message}
                                    >
                                        <MenuItem value={0}>{t('cars.selectMake')}</MenuItem>
                                        {makes.map((make) => (
                                            <MenuItem key={make.id} value={make.id}>
                                                {make.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="car_model_id"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        select
                                        {...field}
                                        label={t('cars.model')}
                                        fullWidth
                                        value={field.value || ''}
                                        disabled={!selectedMakeId}
                                        error={!!errors.car_model_id}
                                        helperText={errors.car_model_id?.message}
                                    >
                                        <MenuItem value={0}>{t('cars.selectModel')}</MenuItem>
                                        {filteredModels.map((model) => (
                                            <MenuItem key={model.id} value={model.id}>
                                                {model.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="year"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('cars.year')}
                                        type="number"
                                        fullWidth
                                        onChange={(event) => field.onChange(Number(event.target.value))}
                                        error={!!errors.year}
                                        helperText={errors.year?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="color"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        select
                                        {...field}
                                        label={t('cars.color')}
                                        fullWidth
                                        value={field.value || ''}
                                        error={!!errors.color}
                                        helperText={errors.color?.message}
                                    >
                                        <MenuItem value="">
                                            <em>{t('cars.selectColor')}</em>
                                        </MenuItem>
                                        {carColors.map((color) => (
                                            <MenuItem key={color} value={color}>
                                                <Box
                                                    sx={{
                                                        width: 14,
                                                        height: 14,
                                                        borderRadius: 0.75,
                                                        bgcolor: color.toLowerCase(),
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        mr: 1,
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                {t(carColorTranslationKeys[color])}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="mileage"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('cars.mileage')}
                                        type="number"
                                        fullWidth
                                        onChange={(event) => field.onChange(Number(event.target.value))}
                                        error={!!errors.mileage}
                                        helperText={errors.mileage?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label={t('cars.status')} fullWidth>
                                        {carStatuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {t(carStatusTranslationKeys[status])}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="purchase_price"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('cars.purchase')}
                                        type="number"
                                        fullWidth
                                        onChange={(event) => field.onChange(Number(event.target.value))}
                                        error={!!errors.purchase_price}
                                        helperText={errors.purchase_price?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="sale_price"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('cars.sale')}
                                        type="number"
                                        fullWidth
                                        onChange={(event) => field.onChange(Number(event.target.value))}
                                        error={!!errors.sale_price}
                                        helperText={errors.sale_price?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Stack>

                {selectedMakeId > 0 && selectedModelId > 0 && selectedYear > 0 ? (
                    <Paper variant="outlined" sx={{ mt: 3, p: 2, borderRadius: 2 }}>
                        <Stack spacing={1.5}>
                            <Typography variant="subtitle1">
                                {t('cars.catalog.title')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('cars.catalog.subtitle')}
                            </Typography>
                            <TextField
                                size="small"
                                placeholder={t('cars.catalog.search')}
                                value={partFilter}
                                onChange={(event) => setPartFilter(event.target.value)}
                            />
                            <Box sx={{ maxHeight: 340, overflow: 'auto', pr: 1 }}>
                                {catalogPreviewQuery.isLoading ? (
                                    <Typography variant="body2" color="text.secondary">
                                        {t('cars.catalog.loading')}
                                    </Typography>
                                ) : filteredCatalogParts.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        {t('cars.catalog.empty')}
                                    </Typography>
                                ) : (
                                    <Stack spacing={1}>
                                        {groupedCatalogParts.map((group) => (
                                            <Accordion
                                                key={group.category}
                                                variant="outlined"
                                                disableGutters
                                                sx={{ borderRadius: 2, '&:before': { display: 'none' } }}
                                            >
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant="subtitle2">
                                                        {group.label}
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack spacing={0.5}>
                                                        {group.parts.map((part) => {
                                                            const checked = !excludedParts.includes(part.sku);
                                                            const partName = getLocalizedPartName(part, language);

                                                            return (
                                                                <FormControlLabel
                                                                    key={part.id}
                                                                    sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}
                                                                    control={
                                                                        <Checkbox
                                                                            checked={checked}
                                                                            onChange={(_, isChecked) => {
                                                                                const next = isChecked
                                                                                    ? excludedParts.filter((sku) => sku !== part.sku)
                                                                                    : [...excludedParts, part.sku];
                                                                                setValue('excluded_parts', next, { shouldDirty: true });
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Stack spacing={0.25}>
                                                                            <Typography variant="body2">{partName}</Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {group.label} · {part.path}
                                                                            </Typography>
                                                                        </Stack>
                                                                    }
                                                                />
                                                            );
                                                        })}
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Stack>
                    </Paper>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal}>{t('common.cancel')}</Button>
                <Button
                    type="submit"
                    form="car-form"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
                >
                    {t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

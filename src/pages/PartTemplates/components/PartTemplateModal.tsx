import { useEffect, useMemo } from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '../../../hooks/useTranslation';
import { createPartTemplateSchema } from '../partTemplates.schema';
import type { PartTemplateFormValues, PartTemplateMakeOption, PartTemplateModelOption } from '../partTemplates.types';

interface Props {
    open: boolean;
    mode: 'create' | 'edit';
    makes: PartTemplateMakeOption[];
    models: PartTemplateModelOption[];
    defaultValues?: PartTemplateFormValues;
    isSaving: boolean;
    onClose: () => void;
    onMakeChange: (makeId: number) => void;
    onSubmit: (values: PartTemplateFormValues) => Promise<void>;
}

const emptyValues: PartTemplateFormValues = {
    car_make_id: 0,
    car_model_id: 0,
    start_year: null,
    end_year: null,
    name: '',
    name_ru: '',
    name_hy: '',
    sku: '',
    category: '',
    path: '',
    url: '',
    image_url: '',
    sort_order: 0,
};

export default function PartTemplateModal({
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
    const { t } = useTranslation();
    const schema = useMemo(() => createPartTemplateSchema(), []);
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<PartTemplateFormValues>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues ?? emptyValues,
    });

    const selectedMakeId = watch('car_make_id');

    useEffect(() => {
        const fallbackValues = makes.length > 0
            ? {
                ...emptyValues,
                car_make_id: makes[0].id,
            }
            : emptyValues;

        reset(defaultValues ?? fallbackValues);
    }, [defaultValues, makes, reset, open]);

    useEffect(() => {
        if (selectedMakeId) {
            onMakeChange(selectedMakeId);
        }
    }, [onMakeChange, selectedMakeId]);

    const filteredModels = useMemo(
        () => models.filter((model) => model.car_make_id === selectedMakeId),
        [models, selectedMakeId]
    );

    async function submit(values: PartTemplateFormValues) {
        await onSubmit(values);
        reset(emptyValues);
    }

    function closeModal() {
        reset(emptyValues);
        onClose();
    }

    return (
        <Dialog open={open} onClose={isSaving ? undefined : closeModal} fullWidth maxWidth="md">
            <DialogTitle>
                {mode === 'edit' ? t('parts.templates.editTitle') : t('parts.templates.addTitle')}
            </DialogTitle>
            <DialogContent>
                <Stack component="form" id="part-template-form" spacing={2} sx={{ mt: 1 }} onSubmit={handleSubmit(submit)}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('parts.templates.fitment')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="car_make_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            select
                                            {...field}
                                            label={t('parts.templates.make')}
                                            fullWidth
                                            value={field.value || ''}
                                            onChange={(event) => {
                                                const makeId = Number(event.target.value);
                                                field.onChange(makeId);
                                                setValue('car_model_id', 0);
                                            }}
                                            error={!!errors.car_make_id}
                                            helperText={errors.car_make_id?.message}
                                        >
                                            <MenuItem value={0}>{t('parts.templates.selectMake')}</MenuItem>
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
                                            label={t('parts.templates.model')}
                                            fullWidth
                                            value={field.value || ''}
                                            disabled={!selectedMakeId}
                                            error={!!errors.car_model_id}
                                            helperText={errors.car_model_id?.message}
                                        >
                                            <MenuItem value={0}>{t('parts.templates.selectModel')}</MenuItem>
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
                                    name="start_year"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.startYear')}
                                            type="number"
                                            fullWidth
                                            value={field.value ?? ''}
                                            onChange={(event) => {
                                                const value = event.target.value.trim();
                                                field.onChange(value === '' ? null : Number(value));
                                            }}
                                            error={!!errors.start_year}
                                            helperText={errors.start_year?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="end_year"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.endYear')}
                                            type="number"
                                            fullWidth
                                            value={field.value ?? ''}
                                            onChange={(event) => {
                                                const value = event.target.value.trim();
                                                field.onChange(value === '' ? null : Number(value));
                                            }}
                                            error={!!errors.end_year}
                                            helperText={errors.end_year?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('parts.templates.translation')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.nameEn')}
                                            fullWidth
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Controller
                                    name="name_ru"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.nameRu')}
                                            fullWidth
                                            error={!!errors.name_ru}
                                            helperText={errors.name_ru?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Controller
                                    name="name_hy"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.nameHy')}
                                            fullWidth
                                            error={!!errors.name_hy}
                                            helperText={errors.name_hy?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('parts.templates.details')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="sku"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.sku')}
                                            fullWidth
                                            error={!!errors.sku}
                                            helperText={errors.sku?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.category')}
                                            fullWidth
                                            error={!!errors.category}
                                            helperText={errors.category?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Controller
                                    name="path"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.path')}
                                            fullWidth
                                            error={!!errors.path}
                                            helperText={errors.path?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Controller
                                    name="sort_order"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.sortOrder')}
                                            type="number"
                                            fullWidth
                                            onChange={(event) => field.onChange(Number(event.target.value))}
                                            error={!!errors.sort_order}
                                            helperText={errors.sort_order?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="url"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.url')}
                                            fullWidth
                                            error={!!errors.url}
                                            helperText={errors.url?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="image_url"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.templates.imageUrl')}
                                            fullWidth
                                            error={!!errors.image_url}
                                            helperText={errors.image_url?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={closeModal} disabled={isSaving}>
                    {t('common.cancel')}
                </Button>
                <Button
                    type="submit"
                    form="part-template-form"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
                >
                    {isSaving
                        ? t('common.saving')
                        : mode === 'edit'
                            ? t('parts.templates.updateTemplate')
                            : t('parts.templates.saveTemplate')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

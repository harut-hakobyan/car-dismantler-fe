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
    Stack,
    TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CarMakeOption, CarModelOption, CarFormValues } from '../cars.types';
import { carSchema } from '../cars.schema';

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
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CarFormValues>({
        resolver: zodResolver(carSchema),
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

    async function submit(values: CarFormValues) {
        await onSubmit(values);
        reset(emptyValues);
    }

    function closeModal() {
        reset(emptyValues);
        onClose();
    }

    return (
        <Dialog open={open} onClose={isSaving ? undefined : closeModal} fullWidth maxWidth="md">
            <DialogTitle>{mode === 'edit' ? 'Edit Car' : 'Add Car'}</DialogTitle>
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
                                        label="VIN"
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
                                        label="Make"
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
                                        <MenuItem value={0}>Select make</MenuItem>
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
                                        label="Model"
                                        fullWidth
                                        value={field.value || ''}
                                        disabled={!selectedMakeId}
                                        error={!!errors.car_model_id}
                                        helperText={errors.car_model_id?.message}
                                    >
                                        <MenuItem value={0}>Select model</MenuItem>
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
                                        label="Year"
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
                                        {...field}
                                        label="Color"
                                        fullWidth
                                        error={!!errors.color}
                                        helperText={errors.color?.message}
                                    />
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
                                        label="Mileage"
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
                                    <TextField {...field} select label="Status" fullWidth>
                                        {['active', 'inactive', 'pending'].map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
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
                                        label="Purchase price"
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
                                        label="Sale price"
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
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal}>Cancel</Button>
                <Button
                    type="submit"
                    form="car-form"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PartCategorySelect from './PartCategorySelect';
import { partSchema } from '../parts.schema';
import {
    getPartConditionLabelKey,
    getPartStatusLabelKey,
    partConditions,
    partStatuses,
    type CarOption,
    type PartFormValues,
} from '../parts.types';
import { useTranslation } from '../../../hooks/useTranslation';
import { AMD_CURRENCY_SYMBOL } from '../../../utils/currency';

interface PartFormProps {
    formId: string;
    cars: CarOption[];
    defaultValues?: PartFormValues;
    onSubmit: (values: PartFormValues) => Promise<void>;
}

const defaultValues: PartFormValues = {
    car_id: 0,
    name: '',
    sku: '',
    category: 'Engine',
    condition: 'Good',
    description: '',
    price: 0,
    quantity: 1,
    status: 'active',
    image_url: '',
};

export default function PartForm({
    formId,
    cars,
    defaultValues: initialValues = defaultValues,
    onSubmit,
}: PartFormProps) {
    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PartFormValues>({
        resolver: zodResolver(partSchema),
        defaultValues: initialValues,
    });

    return (
        <Stack
            component="form"
            id={formId}
            spacing={3}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    {t('parts.partDetails')}
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t('parts.partName')}
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="sku"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t('parts.sku')}
                                    fullWidth
                                    error={!!errors.sku}
                                    helperText={errors.sku?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="car_id"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    select
                                    label={t('parts.sourceCar')}
                                    fullWidth
                                    value={field.value}
                                    onChange={(event) =>
                                        field.onChange(Number(event.target.value))
                                    }
                                    error={!!errors.car_id}
                                    helperText={errors.car_id?.message}
                                >
                                    <MenuItem value={0}>{t('parts.selectCar')}</MenuItem>
                                    {cars.map((car) => (
                                        <MenuItem key={car.id} value={car.id}>
                                            {car.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <PartCategorySelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.category}
                                    helperText={errors.category?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="condition"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label={t('parts.condition')}
                                    fullWidth
                                    error={!!errors.condition}
                                    helperText={errors.condition?.message}
                                >
                                    {partConditions.map((condition) => (
                                        <MenuItem key={condition} value={condition}>
                                            {t(getPartConditionLabelKey(condition))}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label={t('parts.status')}
                                    fullWidth
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    {partStatuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {t(getPartStatusLabelKey(status))}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    {t('parts.pricingInventory')}
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.price}>
                                    <InputLabel>{t('parts.price')}</InputLabel>
                                    <OutlinedInput
                                        {...field}
                                        label={t('parts.price')}
                                        type="number"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                {AMD_CURRENCY_SYMBOL}
                                            </InputAdornment>
                                        }
                                        onChange={(event) =>
                                            field.onChange(Number(event.target.value))
                                        }
                                    />
                                    <FormHelperText>
                                        {errors.price?.message}
                                    </FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="quantity"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t('parts.quantity')}
                                    type="number"
                                    fullWidth
                                    onChange={(event) =>
                                        field.onChange(Number(event.target.value))
                                    }
                                    error={!!errors.quantity}
                                    helperText={errors.quantity?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    {t('parts.descriptionMedia')}
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t('parts.descriptionField')}
                                    multiline
                                    minRows={5}
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={
                                        errors.description?.message ??
                                        t('parts.descriptionHelp')
                                    }
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box
                            sx={{
                                minHeight: 168,
                                height: '100%',
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 2,
                                textAlign: 'center',
                                bgcolor: 'background.default',
                            }}
                        >
                            <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
                                <ImageIcon color="disabled" sx={{ fontSize: 42 }} />
                                <Typography sx={{ fontWeight: 700 }}>
                                    {t('parts.imageUpload')}
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    {t('parts.imageUploadHelp')}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    disabled
                                >
                                    {t('parts.uploadLater')}
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Stack>
    );
}

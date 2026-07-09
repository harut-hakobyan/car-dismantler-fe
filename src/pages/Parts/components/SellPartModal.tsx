import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sellPartSchema } from '../parts.schema';
import type { PartSaleOption, SellPartFormValues } from '../parts.types';
import { useTranslation } from '../../../hooks/useTranslation';

interface SellPartModalProps {
    open: boolean;
    parts: PartSaleOption[];
    isSaving: boolean;
    onClose: () => void;
    onSubmit: (values: SellPartFormValues) => Promise<void>;
}

const defaultValues: SellPartFormValues = {
    part_id: 0,
    customer_name: '',
    quantity: 1,
    sale_price: 0,
    notes: '',
};

export default function SellPartModal({
    open,
    parts,
    isSaving,
    onClose,
    onSubmit,
}: SellPartModalProps) {
    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors },
    } = useForm<SellPartFormValues>({
        resolver: zodResolver(sellPartSchema),
        defaultValues,
    });
    const selectedPartId = useWatch({
        control,
        name: 'part_id',
    });
    const selectedPart = parts.find((part) => part.id === selectedPartId);

    async function submit(values: SellPartFormValues) {
        const part = parts.find((item) => item.id === values.part_id);

        if (!part) {
            setError('part_id', { message: t('parts.selectPart') });
            return;
        }

        if (values.quantity > part.quantity) {
            setError('quantity', {
                message: `${part.quantity} ${t('parts.available')}`,
            });
            return;
        }

        await onSubmit(values);
        reset(defaultValues);
    }

    function closeModal() {
        reset(defaultValues);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={isSaving ? undefined : closeModal}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <SmartToyIcon color="primary" />
                    <Stack>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {t('parts.quickSellTitle')}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            {t('parts.quickSellSubtitle')}
                        </Typography>
                    </Stack>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ bgcolor: 'background.default' }}>
                <Stack
                    id="sell-part-form"
                    component="form"
                    spacing={2}
                    onSubmit={handleSubmit(submit)}
                >
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="part_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            select
                                            label={t('parts.part')}
                                            fullWidth
                                            value={field.value}
                                            onChange={(event) => {
                                                const partId = Number(event.target.value);
                                                const part = parts.find(
                                                    (item) => item.id === partId
                                                );

                                                field.onChange(partId);

                                                if (part) {
                                                    setValue('sale_price', part.price);
                                                }
                                            }}
                                            error={!!errors.part_id}
                                            helperText={errors.part_id?.message}
                                        >
                                            <MenuItem value={0}>{t('parts.selectPart')}</MenuItem>
                                            {parts.map((part) => (
                                                <MenuItem key={part.id} value={part.id}>
                                                    {part.label} ({part.quantity} {t('parts.available')})
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="customer_name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.customer')}
                                            fullWidth
                                            error={!!errors.customer_name}
                                            helperText={errors.customer_name?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                            helperText={
                                                errors.quantity?.message ??
                                                (selectedPart
                                                    ? `${selectedPart.quantity} ${t('parts.available')}`
                                                    : t('parts.selectPartFirst'))
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="sale_price"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.salePrice')}
                                            type="number"
                                            fullWidth
                                            onChange={(event) =>
                                                field.onChange(Number(event.target.value))
                                            }
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                    <InputAdornment position="start">
                                                        $
                                                    </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            error={!!errors.sale_price}
                                            helperText={errors.sale_price?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="notes"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('parts.notes')}
                                            multiline
                                            minRows={3}
                                            fullWidth
                                            error={!!errors.notes}
                                            helperText={
                                                errors.notes?.message ??
                                                t('parts.notesHelp')
                                            }
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
                    form="sell-part-form"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={
                        isSaving ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <PointOfSaleIcon />
                        )
                    }
                >
                    {isSaving ? t('parts.selling') : t('parts.sellPart')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

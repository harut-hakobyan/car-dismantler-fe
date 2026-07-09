import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PartForm from './PartForm';
import type { CarOption, PartFormValues } from '../parts.types';
import { useTranslation } from '../../../hooks/useTranslation';

interface AddPartModalProps {
    open: boolean;
    mode?: 'create' | 'edit';
    cars: CarOption[];
    defaultValues?: PartFormValues;
    isSaving: boolean;
    onClose: () => void;
    onSubmit: (values: PartFormValues) => Promise<void>;
}

const formId = 'add-part-form';

export default function AddPartModal({
    open,
    mode = 'create',
    cars,
    defaultValues,
    isSaving,
    onClose,
    onSubmit,
}: AddPartModalProps) {
    const { t } = useTranslation();
    const isEdit = mode === 'edit';

    return (
        <Dialog
            open={open}
            onClose={isSaving ? undefined : onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Inventory2Icon color="primary" />
                    <Stack>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {isEdit ? t('parts.editTitle') : t('parts.addTitle')}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            {isEdit
                                ? t('parts.editSubtitle')
                                : t('parts.addSubtitle')}
                        </Typography>
                    </Stack>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ bgcolor: 'background.default' }}>
                {open && (
                    <PartForm
                        formId={formId}
                        cars={cars}
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={isSaving}>
                    {t('common.cancel')}
                </Button>
                <Button
                    type="submit"
                    form={formId}
                    variant="contained"
                    disabled={isSaving}
                    startIcon={
                        isSaving ? <CircularProgress size={16} color="inherit" /> : undefined
                    }
                >
                    {isSaving
                        ? t('common.saving')
                        : isEdit
                          ? t('parts.updatePart')
                          : t('parts.savePart')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

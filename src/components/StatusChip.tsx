import { Chip } from '@mui/material';
import type { Status } from '../types/resources';
import { useTranslation } from '../hooks/useTranslation';
import type { TranslationKey } from '../i18n/translations';

const colorByStatus: Record<Status, 'success' | 'default' | 'warning' | 'info' | 'error'> = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
    completed: 'info',
    cancelled: 'error',
};

const labelKeyByStatus: Record<Status, TranslationKey> = {
    active: 'status.active',
    inactive: 'status.inactive',
    pending: 'status.pending',
    completed: 'status.completed',
    cancelled: 'status.cancelled',
};

export default function StatusChip({ status }: { status: Status }) {
    const { t } = useTranslation();
    const label = t(labelKeyByStatus[status]);

    return (
        <Chip
            label={label}
            color={colorByStatus[status]}
            size="small"
            variant="outlined"
        />
    );
}

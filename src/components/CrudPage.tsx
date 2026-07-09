import { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Pagination,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';
import PageHeader from './PageHeader';
import StatusChip from './StatusChip';
import type { ResourceRecord, Status } from '../types/resources';
import { useTranslation } from '../hooks/useTranslation';

export interface Column<T> {
    key: keyof T;
    label: string;
    type?: 'text' | 'number' | 'currency' | 'date' | 'status';
}

interface CrudPageProps<T extends ResourceRecord> {
    title: string;
    description: string;
    actionLabel: string;
    rows: T[];
    total: number;
    page: number;
    perPage: number;
    search: string;
    isLoading?: boolean;
    columns: Column<T>[];
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onCreate?: (payload: Omit<T, 'id'>) => Promise<unknown>;
    onUpdate?: (id: number, payload: Omit<T, 'id'>) => Promise<unknown>;
    onDelete?: (id: number) => Promise<void>;
}

const statuses: Status[] = ['active', 'inactive', 'pending', 'completed', 'cancelled'];

function createEmptyRow<T extends ResourceRecord>(columns: Column<T>[], nextId: number): T {
    const row: Record<string, string | number> = { id: nextId };

    columns.forEach((column) => {
        if (column.key === 'id') {
            return;
        }

        if (column.type === 'number' || column.type === 'currency') {
            row[String(column.key)] = 0;
            return;
        }

        if (column.type === 'status') {
            row[String(column.key)] = 'Active';
            return;
        }

        row[String(column.key)] = '';
    });

    return row as unknown as T;
}

function formatValue<T extends ResourceRecord>(row: T, column: Column<T>) {
    const value = row[column.key];

    if (column.type === 'currency' && typeof value === 'number') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    }

    if (column.type === 'status') {
        return <StatusChip status={value as Status} />;
    }

    return String(value);
}

export default function CrudPage<T extends ResourceRecord>({
    title,
    description,
    actionLabel,
    rows,
    total,
    page,
    perPage,
    search,
    isLoading = false,
    columns,
    onSearchChange,
    onPageChange,
    onCreate,
    onUpdate,
    onDelete,
}: CrudPageProps<T>) {
    const { t } = useTranslation();
    const [editingRow, setEditingRow] = useState<T | null>(null);
    const [deleteRow, setDeleteRow] = useState<T | null>(null);
    const pageCount = Math.max(1, Math.ceil(total / perPage));

    function openCreateDialog() {
        if (onCreate) {
            setEditingRow(createEmptyRow(columns, 0));
        }
    }

    async function saveRow() {
        if (!editingRow) {
            return;
        }

        const payload = Object.fromEntries(
            Object.entries(editingRow).filter(([key]) => key !== 'id')
        ) as Omit<T, 'id'>;
        const exists = rows.some((row) => row.id === editingRow.id);

        if (exists && onUpdate) {
            await onUpdate(editingRow.id, payload);
        } else if (!exists && onCreate) {
            await onCreate(payload);
        }

        toast.success(t('common.save'));
        setEditingRow(null);
    }

    async function confirmDelete() {
        if (!deleteRow) {
            return;
        }

        await onDelete?.(deleteRow.id);
        toast.success(t('common.delete'));
        setDeleteRow(null);
    }

    function updateEditingField(column: Column<T>, value: string) {
        if (!editingRow) {
            return;
        }

        setEditingRow({
            ...editingRow,
            [column.key]:
                column.type === 'number' || column.type === 'currency'
                    ? Number(value)
                    : value,
        });
    }

    return (
        <>
            <PageHeader
                title={title}
                description={description}
                actionLabel={actionLabel}
                onAction={openCreateDialog}
            />

            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', md: 'center' },
                        mb: 2,
                    }}
                >
                    <TextField
                        size="small"
                        placeholder={t('common.search')}
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={String(column.key)}>
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell align="right">{t('common.actions')}</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id} hover>
                                    {columns.map((column) => (
                                        <TableCell key={String(column.key)}>
                                            {formatValue(row, column)}
                                        </TableCell>
                                    ))}
                                    <TableCell align="right">
                                        <Tooltip title={t('common.edit')}>
                                            <IconButton
                                                size="small"
                                                disabled={!onUpdate}
                                                onClick={() => setEditingRow(row)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('common.delete')}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                disabled={!onDelete}
                                                onClick={() => setDeleteRow(row)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1}>
                                        {t('parts.noParts')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Stack sx={{ alignItems: 'flex-end', mt: 2 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_event, value) => onPageChange(value)}
                        color="primary"
                    />
                </Stack>
            </Paper>

            <Dialog
                open={!!editingRow}
                onClose={() => setEditingRow(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {editingRow && rows.some((row) => row.id === editingRow.id)
                        ? `${t('common.edit')} ${title}`
                        : `${t('common.save')} ${title}`}
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {editingRow &&
                            columns
                                .filter((column) => column.key !== 'id')
                                .map((column) => {
                                    const value = editingRow[column.key];

                                    if (column.type === 'status') {
                                        return (
                                            <TextField
                                                key={String(column.key)}
                                                select
                                                label={column.label}
                                                value={String(value)}
                                                onChange={(event) =>
                                                    updateEditingField(column, event.target.value)
                                                }
                                            >
                                                {statuses.map((status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        );
                                    }

                                    return (
                                        <TextField
                                            key={String(column.key)}
                                            label={column.label}
                                            type={
                                                column.type === 'number' ||
                                                column.type === 'currency'
                                                    ? 'number'
                                                    : 'text'
                                            }
                                            value={String(value)}
                                            onChange={(event) =>
                                                updateEditingField(column, event.target.value)
                                            }
                                        />
                                    );
                                })}
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setEditingRow(null)}>{t('common.cancel')}</Button>
                    <Button variant="contained" onClick={saveRow}>
                        {t('common.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!deleteRow} onClose={() => setDeleteRow(null)}>
                <DialogTitle>{t('common.delete')}?</DialogTitle>
                <DialogContent>
                    <Box color="text.secondary">
                        {t('parts.deleteBody')}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteRow(null)}>{t('common.cancel')}</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>
                        {t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

import {
    Chip,
    IconButton,
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
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import StatusChip from '../../../components/StatusChip';
import type { PartResource } from '../../../types/resources';
import { useTranslation } from '../../../hooks/useTranslation';

interface PartsTableProps {
    rows: PartResource[];
    total: number;
    page: number;
    perPage: number;
    search: string;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onEdit: (part: PartResource) => void;
    onDelete: (part: PartResource) => void;
}

export default function PartsTable({
    rows,
    total,
    page,
    perPage,
    search,
    onSearchChange,
    onPageChange,
    onEdit,
    onDelete,
}: PartsTableProps) {
    const { t } = useTranslation();
    const pageCount = Math.max(1, Math.ceil(total / perPage));

    return (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'space-between', mb: 2 }}
            >
                <TextField
                    size="small"
                    placeholder={t('common.search')}
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
                        },
                    }}
                />
                <Typography color="text.secondary" variant="body2">
                    {total} {t('parts.inventoryRecords')}
                </Typography>
            </Stack>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('parts.part')}</TableCell>
                            <TableCell>{t('parts.sku')}</TableCell>
                            <TableCell>{t('parts.category')}</TableCell>
                            <TableCell>{t('parts.carId')}</TableCell>
                            <TableCell>{t('parts.condition')}</TableCell>
                            <TableCell align="right">{t('parts.price')}</TableCell>
                            <TableCell align="right">{t('parts.quantity')}</TableCell>
                            <TableCell>{t('parts.status')}</TableCell>
                            <TableCell align="right">{t('parts.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((part) => (
                            <TableRow key={part.id} hover>
                                <TableCell>
                                    <Stack spacing={0.25}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {part.name}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="caption"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {part.description}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{part.sku}</TableCell>
                                <TableCell>
                                    <Chip label={part.category} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>{part.car_id}</TableCell>
                                <TableCell>{part.condition}</TableCell>
                                <TableCell align="right">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(part.price)}
                                </TableCell>
                                <TableCell align="right">{part.quantity}</TableCell>
                                <TableCell>
                                    <StatusChip status={part.status} />
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title={t('parts.edit')}>
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(part)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('parts.delete')}>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => onDelete(part)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9}>
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
    );
}

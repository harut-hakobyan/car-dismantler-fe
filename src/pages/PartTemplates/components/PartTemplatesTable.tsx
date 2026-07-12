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
import { useTranslation } from '../../../hooks/useTranslation';
import type { PartTemplateResource } from '../../../types/resources';
import { getLocalizedPartName } from '../../../utils/partLocalization';

interface Props {
    rows: PartTemplateResource[];
    total: number;
    page: number;
    perPage: number;
    search: string;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onEdit: (template: PartTemplateResource) => void;
    onDelete: (template: PartTemplateResource) => void;
}

export default function PartTemplatesTable({
    rows,
    total,
    page,
    perPage,
    search,
    onSearchChange,
    onPageChange,
    onEdit,
    onDelete,
}: Props) {
    const { t, language } = useTranslation();
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
                    {total} {t('parts.templates.inventoryRecords')}
                </Typography>
            </Stack>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('parts.templates.name')}</TableCell>
                            <TableCell>{t('parts.templates.fitment')}</TableCell>
                            <TableCell>{t('parts.templates.sku')}</TableCell>
                            <TableCell>{t('parts.templates.category')}</TableCell>
                            <TableCell>{t('parts.templates.sortOrder')}</TableCell>
                            <TableCell align="right">{t('common.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((template) => (
                            <TableRow key={template.id} hover>
                                <TableCell>
                                    <Stack spacing={0.25}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {getLocalizedPartName(template, language)}
                                        </Typography>
                                        <Typography color="text.secondary" variant="caption">
                                            {template.name} / {template.name_ru ?? '-'} / {template.name_hy ?? '-'}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack spacing={0.25}>
                                        <Typography variant="body2">{template.fitment}</Typography>
                                        <Typography color="text.secondary" variant="caption">
                                            {template.start_year ?? '-'} - {template.end_year ?? '-'}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{template.sku}</TableCell>
                                <TableCell>
                                    <Chip label={template.category} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>{template.sort_order}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title={t('common.edit')}>
                                        <IconButton size="small" onClick={() => onEdit(template)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('common.delete')}>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => onDelete(template)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    {t('parts.templates.noTemplates')}
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

import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCrudResource } from '../../hooks/useCrudResource';
import { ordersApi } from '../../api/resources.api';
import type { OrderResource, Status } from '../../types/resources';
import PageHeader from '../../components/PageHeader';
import StatusChip from '../../components/StatusChip';
import { useTranslation } from '../../hooks/useTranslation';

const statuses: Status[] = ['pending', 'completed', 'cancelled'];

export default function OrdersPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<OrderResource | null>(null);
    const perPage = 10;
    const { listQuery, updateMutation } = useCrudResource('orders', ordersApi, {
        search,
        page,
        perPage,
    });
    const data = listQuery.data;

    async function updateStatus(order: OrderResource, status: Status) {
        const { id, ...payload } = order;
        await updateMutation.mutateAsync({ id, payload: { ...payload, status } });
        setSelectedOrder({ ...order, status });
    }

    return (
        <>
            <PageHeader
                title={t('orders.title')}
                description={t('orders.description')}
            />

            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Stack sx={{ mb: 2 }}>
                    <TextField
                        size="small"
                        placeholder={t('orders.search')}
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                    />
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('common.id')}</TableCell>
                                <TableCell>{t('orders.customer')}</TableCell>
                                <TableCell>{t('common.total')}</TableCell>
                                <TableCell>{t('common.status')}</TableCell>
                                <TableCell>{t('common.created')}</TableCell>
                                <TableCell align="right">{t('common.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(data?.data ?? []).map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.customer_name}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(order.total)}
                                    </TableCell>
                                    <TableCell>
                                        <StatusChip status={order.status} />
                                    </TableCell>
                                    <TableCell>{order.created_at}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            {t('common.edit')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{t('orders.details')}</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField label={t('common.id')} value={selectedOrder.id} />
                            <TextField label={t('orders.customer')} value={selectedOrder.customer_name} />
                            <TextField label={t('common.total')} value={selectedOrder.total} />
                            <TextField label={t('common.created')} value={selectedOrder.created_at} />
                            <TextField
                                select
                                label={t('common.status')}
                                value={selectedOrder.status}
                                onChange={(event) =>
                                    updateStatus(selectedOrder, event.target.value as Status)
                                }
                            >
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedOrder(null)}>{t('common.close')}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

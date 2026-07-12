import {
    Box,
    Chip,
    Grid,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/PageHeader';
import StatusChip from '../../components/StatusChip';
import { dashboardApi } from '../../api/resources.api';
import { useTranslation } from '../../hooks/useTranslation';
import { formatAmdCurrency } from '../../utils/currency';
import { getPartCategoryLabelKeyByValue } from '../Parts/parts.types';

export default function DashboardPage() {
    const { t } = useTranslation();
    const summaryQuery = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: dashboardApi.summary,
    });
    const activityQuery = useQuery({
        queryKey: ['dashboard-activity'],
        queryFn: dashboardApi.activity,
    });
    const recentOrdersQuery = useQuery({
        queryKey: ['dashboard-recent-orders'],
        queryFn: dashboardApi.recentOrders,
    });
    const detailsQuery = useQuery({
        queryKey: ['dashboard-details'],
        queryFn: dashboardApi.details,
    });
    const summary = summaryQuery.data;
    const details = detailsQuery.data;
    const stats = [
        { label: t('nav.cars'), value: summary?.cars ?? 0, icon: <DirectionsCarIcon /> },
        { label: t('nav.parts'), value: summary?.parts ?? 0, icon: <Inventory2Icon /> },
        { label: t('nav.orders'), value: summary?.orders ?? 0, icon: <ShoppingCartIcon /> },
        { label: t('nav.customers'), value: summary?.customers ?? 0, icon: <PeopleIcon /> },
    ];
    const inventoryValue = summary?.inventoryValue ?? 0;
    const pendingOrders = summary?.pendingOrders ?? 0;
    const orderRevenue = details?.orderRevenue ?? 0;
    const averageOrderValue = details?.averageOrderValue ?? 0;

    function formatCurrency(value: number) {
        return formatAmdCurrency(value);
    }

    return (
        <>
            <PageHeader
                title={t('dashboard.title')}
                description={t('dashboard.description')}
            />

            <Grid container spacing={2}>
                {stats.map((stat) => (
                    <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{ alignItems: 'center' }}
                            >
                                <Box
                                    sx={{
                                        display: 'grid',
                                        placeItems: 'center',
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        bgcolor: 'primary.light',
                                        color: 'primary.contrastText',
                                    }}
                                >
                                    {stat.icon}
                                </Box>

                                <Box>
                                    <Typography color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.inventorySummary')}
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Stack
                                    direction="row"
                                    sx={{ justifyContent: 'space-between', mb: 0.5 }}
                                >
                                    <Typography color="text.secondary">{t('dashboard.inventoryValue')}</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {formatCurrency(inventoryValue)}
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(100, inventoryValue / 50)}
                                />
                            </Box>
                            <Box>
                                <Stack
                                    direction="row"
                                    sx={{ justifyContent: 'space-between', mb: 0.5 }}
                                >
                                    <Typography color="text.secondary">{t('dashboard.pendingOrders')}</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {pendingOrders}
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    color="warning"
                                    variant="determinate"
                                    value={Math.min(100, pendingOrders * 25)}
                                />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 3 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.salesSnapshot')}
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography color="text.secondary" variant="body2">
                                    {t('dashboard.completedRevenue')}
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                    {formatCurrency(orderRevenue)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography color="text.secondary" variant="body2">
                                    {t('dashboard.averageOrder')}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {formatCurrency(averageOrderValue)}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 3 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.orderStatus')}
                        </Typography>
                        <Stack spacing={2}>
                            {(details?.orderStatusCounts ?? []).map((item) => (
                                <Box key={item.status}>
                                    <Stack
                                        direction="row"
                                        sx={{ justifyContent: 'space-between', mb: 0.5 }}
                                    >
                                        <StatusChip status={item.status} />
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {item.count}
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min(100, item.count * 35)}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 3 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.carStatus')}
                        </Typography>
                        <Stack spacing={2}>
                            {(details?.carStatusCounts ?? []).map((item) => (
                                <Box key={item.status}>
                                    <Stack
                                        direction="row"
                                        sx={{ justifyContent: 'space-between', mb: 0.5 }}
                                    >
                                        <StatusChip status={item.status} />
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {item.count}
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        color="secondary"
                                        variant="determinate"
                                        value={Math.min(100, item.count * 35)}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.recentOrders')}
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('orders.customer')}</TableCell>
                                    <TableCell>{t('common.status')}</TableCell>
                                    <TableCell align="right">{t('common.total')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(recentOrdersQuery.data ?? []).map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.customer_name}</TableCell>
                                        <TableCell>
                                            <StatusChip status={order.status} />
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(order.total)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.lowStock')}
                        </Typography>
                        <Stack spacing={1.5}>
                            {(details?.lowStockParts ?? []).map((part) => (
                                <Stack
                                    key={part.id}
                                    direction="row"
                                    sx={{ justifyContent: 'space-between', gap: 2 }}
                                >
                                    <Box>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {part.name}
                                        </Typography>
                                        <Typography color="text.secondary" variant="caption">
                                            {part.sku}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${part.quantity} ${t('dashboard.stockLeft')}`}
                                        color={part.quantity <= 1 ? 'error' : 'warning'}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Stack>
                            ))}
                            {(details?.lowStockParts ?? []).length === 0 && (
                                <Typography color="text.secondary">
                                    {t('dashboard.noLowStock')}
                                </Typography>
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.recentActivity')}
                        </Typography>
                        <Stack spacing={2}>
                            {(activityQuery.data ?? []).map((item) => (
                                <Box key={item.id}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {item.label}
                                    </Typography>
                                    <Typography color="text.secondary" variant="body2">
                                        {item.description}
                                    </Typography>
                                    <Typography color="text.secondary" variant="caption">
                                        {item.created_at}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.recentCars')}
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('cars.make')}</TableCell>
                                    <TableCell>{t('cars.model')}</TableCell>
                                    <TableCell>{t('cars.year')}</TableCell>
                                    <TableCell>{t('common.status')}</TableCell>
                                    <TableCell>{t('common.created')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(details?.recentCars ?? []).map((car) => (
                                    <TableRow key={car.id}>
                                        <TableCell>{car.make}</TableCell>
                                        <TableCell>{car.model}</TableCell>
                                        <TableCell>{car.year}</TableCell>
                                        <TableCell>
                                            <StatusChip status={car.status} />
                                        </TableCell>
                                        <TableCell>{car.created_at}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('dashboard.topInventory')}
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('parts.part')}</TableCell>
                                    <TableCell>{t('parts.category')}</TableCell>
                                    <TableCell align="right">{t('parts.quantity')}</TableCell>
                                    <TableCell align="right">{t('dashboard.inventoryValue')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(details?.topParts ?? []).map((part) => (
                                    <TableRow key={part.id}>
                                        <TableCell>{part.name}</TableCell>
                                        <TableCell>{t(getPartCategoryLabelKeyByValue(part.category))}</TableCell>
                                        <TableCell align="right">{part.quantity}</TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(part.price * part.quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

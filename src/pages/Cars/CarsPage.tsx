import { useMemo, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import StatusChip from '../../components/StatusChip';
import { useCrudResource } from '../../hooks/useCrudResource';
import { carsApi } from '../../api/resources.api';
import type { CarResource } from '../../types/resources';
import CarFormModal from './components/CarFormModal';
import type { CarFormValues } from './cars.types';
import { useTranslation } from '../../hooks/useTranslation';
import { formatAmdCurrency } from '../../utils/currency';

function toFormValues(car: CarResource): CarFormValues {
    return {
        vin: car.vin,
        car_make_id: car.car_make_id ?? 0,
        car_model_id: car.car_model_id ?? 0,
        year: car.year,
        color: car.color,
        mileage: car.mileage,
        status: car.status as CarFormValues['status'],
        purchase_price: car.purchase_price,
        sale_price: car.sale_price,
        excluded_parts: car.excluded_parts ?? [],
    };
}

export default function CarsPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<CarResource | null>(null);
    const [deleteCar, setDeleteCar] = useState<CarResource | null>(null);
    const [selectedMakeId, setSelectedMakeId] = useState<number>(0);
    const perPage = 10;

    const { listQuery, createMutation, updateMutation, deleteMutation } =
        useCrudResource('cars', carsApi, { search, page, perPage });

    const makesQuery = useQuery({
        queryKey: ['car-makes'],
        queryFn: carsApi.makes,
    });

    const modelsQuery = useQuery({
        queryKey: ['car-models', selectedMakeId],
        queryFn: () => carsApi.models(selectedMakeId),
        enabled: selectedMakeId > 0,
    });

    const data = listQuery.data;
    const modalOpen = addOpen || !!editingCar;
    const modalMode = editingCar ? 'edit' : 'create';

    const defaultValues = useMemo(
        () => (editingCar ? toFormValues(editingCar) : undefined),
        [editingCar]
    );

    async function saveCar(values: CarFormValues) {
        try {
            if (editingCar) {
                await updateMutation.mutateAsync({
                    id: editingCar.id,
                    payload: values as unknown as Omit<CarResource, 'id'>,
                });
                toast.success(t('toast.carUpdated'));
            } else {
                await createMutation.mutateAsync(values as unknown as Omit<CarResource, 'id'>);
                toast.success(t('toast.carCreated'));
            }

            setAddOpen(false);
            setEditingCar(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('toast.carSaveError'));
        }
    }

    function closeModal() {
        setAddOpen(false);
        setEditingCar(null);
        setSelectedMakeId(0);
    }

    async function confirmDelete() {
        if (!deleteCar) {
            return;
        }

        await deleteMutation.mutateAsync(deleteCar.id);
        toast.success(t('toast.carDeleted'));
        setDeleteCar(null);
    }

    return (
        <>
            <PageHeader
                title={t('cars.title')}
                description={t('cars.description')}
                actionLabel={t('cars.add')}
                onAction={() => {
                    setEditingCar(null);
                    setSelectedMakeId(makesQuery.data?.[0]?.id ?? 0);
                    setAddOpen(true);
                }}
            />

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
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditingCar(null);
                            setSelectedMakeId(makesQuery.data?.[0]?.id ?? 0);
                            setAddOpen(true);
                        }}
                    >
                        {t('cars.add')}
                    </Button>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('common.id')}</TableCell>
                                <TableCell>{t('cars.vin')}</TableCell>
                                <TableCell>{t('cars.make')}</TableCell>
                                <TableCell>{t('cars.model')}</TableCell>
                                <TableCell>{t('cars.year')}</TableCell>
                                <TableCell>{t('cars.color')}</TableCell>
                                <TableCell>{t('cars.mileage')}</TableCell>
                                <TableCell>{t('common.status')}</TableCell>
                                <TableCell>{t('cars.purchase')}</TableCell>
                                <TableCell>{t('cars.sale')}</TableCell>
                                <TableCell align="right">{t('common.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(data?.data ?? []).map((car) => (
                                <TableRow key={car.id} hover>
                                    <TableCell>{car.id}</TableCell>
                                    <TableCell>{car.vin}</TableCell>
                                    <TableCell>{car.make}</TableCell>
                                    <TableCell>{car.model}</TableCell>
                                    <TableCell>{car.year}</TableCell>
                                    <TableCell>{car.color}</TableCell>
                                    <TableCell>{car.mileage}</TableCell>
                                    <TableCell>
                                        <StatusChip status={car.status} />
                                    </TableCell>
                                    <TableCell>
                                        {formatAmdCurrency(car.purchase_price)}
                                    </TableCell>
                                    <TableCell>
                                        {formatAmdCurrency(car.sale_price)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={t('common.edit')}>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setEditingCar(car);
                                                    setSelectedMakeId(car.car_make_id ?? 0);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('common.delete')}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => setDeleteCar(car)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Stack sx={{ alignItems: 'flex-end', mt: 2 }}>
                    <Pagination
                        count={Math.max(1, Math.ceil((data?.total ?? 0) / perPage))}
                        page={page}
                        onChange={(_event, value) => setPage(value)}
                        color="primary"
                    />
                </Stack>
            </Paper>

            <CarFormModal
                open={modalOpen}
                mode={modalMode}
                makes={makesQuery.data ?? []}
                models={modelsQuery.data ?? []}
                defaultValues={defaultValues}
                isSaving={createMutation.isPending || updateMutation.isPending}
                onClose={closeModal}
                onMakeChange={setSelectedMakeId}
                onSubmit={saveCar}
            />

            <Dialog open={!!deleteCar} onClose={() => setDeleteCar(null)}>
                <DialogTitle>{t('cars.deleteTitle')}</DialogTitle>
                <DialogContent>{t('cars.deleteBody')}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteCar(null)}>{t('common.cancel')}</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>
                        {t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

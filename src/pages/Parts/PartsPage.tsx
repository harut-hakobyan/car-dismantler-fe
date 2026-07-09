import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import AddPartModal from './components/AddPartModal';
import PartsTable from './components/PartsTable';
import QuickSellButton from './components/QuickSellButton';
import SellPartModal from './components/SellPartModal';
import { useParts } from './hooks/useParts';
import type { PartResource } from '../../types/resources';
import type { PartFormValues, SellPartFormValues } from './parts.types';
import { useTranslation } from '../../hooks/useTranslation';

export default function PartsPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [sellOpen, setSellOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<PartResource | null>(null);
    const [deletePart, setDeletePart] = useState<PartResource | null>(null);
    const perPage = 10;
    const {
        listQuery,
        carOptionsQuery,
        saleOptionsQuery,
        createMutation,
        updateMutation,
        deleteMutation,
        sellMutation,
    } = useParts({ search, page, perPage });
    const data = listQuery.data;
    const modalOpen = addOpen || !!editingPart;

    function closePartModal() {
        setAddOpen(false);
        setEditingPart(null);
    }

    async function savePart(values: PartFormValues) {
        try {
            if (editingPart) {
                await updateMutation.mutateAsync({
                    id: editingPart.id,
                    payload: values,
                });
                toast.success(t('toast.partUpdated'));
            } else {
                await createMutation.mutateAsync(values);
                toast.success(t('toast.partAdded'));
            }

            closePartModal();
        } catch {
            toast.error(
                editingPart ? t('toast.partUpdateError') : t('toast.partAddError')
            );
        }
    }

    function partToFormValues(part: PartResource): PartFormValues {
        return {
            car_id: part.car_id,
            name: part.name,
            sku: part.sku,
            category: part.category as PartFormValues['category'],
            condition: part.condition as PartFormValues['condition'],
            description: part.description,
            price: part.price,
            quantity: part.quantity,
            status: part.status as PartFormValues['status'],
            image_url: part.image_url,
        };
    }

    async function confirmDelete() {
        if (!deletePart) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(deletePart.id);
            toast.success(t('toast.partDeleted'));
            setDeletePart(null);
        } catch {
            toast.error(t('toast.partDeleteError'));
        }
    }

    async function sellPart(values: SellPartFormValues) {
        try {
            await sellMutation.mutateAsync(values);
            toast.success(t('toast.partSold'));
            setSellOpen(false);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : t('toast.partSellError');

            toast.error(message);
        }
    }

    return (
        <>
            <PageHeader
                title={t('parts.title')}
                description={t('parts.description')}
                actionLabel={t('parts.addPart')}
                onAction={() => setAddOpen(true)}
            />

            <PartsTable
                rows={data?.data ?? []}
                total={data?.total ?? 0}
                page={page}
                perPage={perPage}
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                onPageChange={setPage}
                onEdit={setEditingPart}
                onDelete={setDeletePart}
            />

            <AddPartModal
                open={modalOpen}
                mode={editingPart ? 'edit' : 'create'}
                cars={carOptionsQuery.data ?? []}
                defaultValues={
                    editingPart ? partToFormValues(editingPart) : undefined
                }
                isSaving={createMutation.isPending || updateMutation.isPending}
                onClose={closePartModal}
                onSubmit={savePart}
            />

            <QuickSellButton onClick={() => setSellOpen(true)} />

            <SellPartModal
                open={sellOpen}
                parts={saleOptionsQuery.data ?? []}
                isSaving={sellMutation.isPending}
                onClose={() => setSellOpen(false)}
                onSubmit={sellPart}
            />

            <Dialog open={!!deletePart} onClose={() => setDeletePart(null)}>
                <DialogTitle>{t('parts.deleteTitle')}</DialogTitle>
                <DialogContent>
                    {t('parts.deleteBody')}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletePart(null)}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        disabled={deleteMutation.isPending}
                        onClick={confirmDelete}
                    >
                        {t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

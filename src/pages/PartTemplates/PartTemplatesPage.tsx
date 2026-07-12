import { useMemo, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import { carsApi } from '../../api/resources.api';
import { partTemplatesApi } from '../../api/partTemplates.api';
import type { PartTemplateResource } from '../../types/resources';
import { useTranslation } from '../../hooks/useTranslation';
import PartTemplatesTable from './components/PartTemplatesTable';
import PartTemplateModal from './components/PartTemplateModal';
import type { PartTemplateFormValues } from './partTemplates.types';

const perPage = 10;

function toFormValues(template: PartTemplateResource): PartTemplateFormValues {
    return {
        car_make_id: template.car_make_id,
        car_model_id: template.car_model_id,
        start_year: template.start_year ?? null,
        end_year: template.end_year ?? null,
        name: template.name,
        name_ru: template.name_ru ?? '',
        name_hy: template.name_hy ?? '',
        sku: template.sku,
        category: template.category,
        path: template.path,
        url: template.url,
        image_url: template.image_url ?? '',
        sort_order: template.sort_order,
    };
}

export default function PartTemplatesPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<PartTemplateResource | null>(null);
    const [deleteTemplate, setDeleteTemplate] = useState<PartTemplateResource | null>(null);
    const [selectedMakeId, setSelectedMakeId] = useState<number>(0);

    const listQuery = useQuery({
        queryKey: ['part-templates', { search, page, perPage }],
        queryFn: () => partTemplatesApi.list({ search, page, perPage }),
    });

    const makesQuery = useQuery({
        queryKey: ['part-template-makes'],
        queryFn: carsApi.makes,
    });

    const modelsQuery = useQuery({
        queryKey: ['part-template-models', selectedMakeId],
        queryFn: () => carsApi.models(selectedMakeId),
        enabled: selectedMakeId > 0,
    });

    const modalOpen = addOpen || !!editingTemplate;
    const modalMode = editingTemplate ? 'edit' : 'create';
    const defaultValues = useMemo(
        () => (editingTemplate ? toFormValues(editingTemplate) : undefined),
        [editingTemplate]
    );

    const createMutation = useMutation({
        mutationFn: (payload: PartTemplateFormValues) => partTemplatesApi.create(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['part-templates'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: PartTemplateFormValues }) =>
            partTemplatesApi.update(id, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['part-templates'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => partTemplatesApi.remove(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['part-templates'] });
        },
    });

    async function saveTemplate(values: PartTemplateFormValues) {
        if (editingTemplate) {
            await updateMutation.mutateAsync({
                id: editingTemplate.id,
                payload: values,
            });
            toast.success(t('toast.partUpdated'));
        } else {
            await createMutation.mutateAsync(values);
            toast.success(t('toast.partAdded'));
        }

        setAddOpen(false);
        setEditingTemplate(null);
    }

    async function confirmDelete() {
        if (!deleteTemplate) {
            return;
        }

        await deleteMutation.mutateAsync(deleteTemplate.id);
        toast.success(t('toast.partDeleted'));
        setDeleteTemplate(null);
    }

    function closeModal() {
        setAddOpen(false);
        setEditingTemplate(null);
        setSelectedMakeId(0);
    }

    return (
        <>
            <PageHeader
                title={t('parts.templates.title')}
                description={t('parts.templates.description')}
                actionLabel={t('parts.templates.add')}
                onAction={() => {
                    setEditingTemplate(null);
                    setSelectedMakeId(makesQuery.data?.[0]?.id ?? 0);
                    setAddOpen(true);
                }}
            />

            <PartTemplatesTable
                rows={listQuery.data?.data ?? []}
                total={listQuery.data?.total ?? 0}
                page={page}
                perPage={perPage}
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                onPageChange={setPage}
                onEdit={(template) => {
                    setEditingTemplate(template);
                    setSelectedMakeId(template.car_make_id);
                }}
                onDelete={setDeleteTemplate}
            />

            <PartTemplateModal
                open={modalOpen}
                mode={modalMode}
                makes={makesQuery.data ?? []}
                models={modelsQuery.data ?? []}
                defaultValues={defaultValues}
                isSaving={createMutation.isPending || updateMutation.isPending}
                onClose={closeModal}
                onMakeChange={setSelectedMakeId}
                onSubmit={saveTemplate}
            />

            <Dialog open={!!deleteTemplate} onClose={() => setDeleteTemplate(null)}>
                <DialogTitle>{t('parts.templates.deleteTitle')}</DialogTitle>
                <DialogContent>{t('parts.templates.deleteBody')}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTemplate(null)}>
                        {t('common.cancel')}
                    </Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>
                        {t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

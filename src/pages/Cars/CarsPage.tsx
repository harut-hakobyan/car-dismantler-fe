import CrudPage, { type Column } from '../../components/CrudPage';
import type { CarResource } from '../../types/resources';
import { useCrudResource } from '../../hooks/useCrudResource';
import { carsApi } from '../../api/resources.api';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export default function CarsPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { listQuery, createMutation, updateMutation, deleteMutation } =
        useCrudResource('cars', carsApi, { search, page, perPage });
    const data = listQuery.data;
    const columns: Column<CarResource>[] = [
        { key: 'id', label: t('common.id'), type: 'number' },
        { key: 'vin', label: t('cars.vin') },
        { key: 'make', label: t('cars.make') },
        { key: 'model', label: t('cars.model') },
        { key: 'year', label: t('cars.year'), type: 'number' },
        { key: 'color', label: t('cars.color') },
        { key: 'mileage', label: t('cars.mileage'), type: 'number' },
        { key: 'status', label: t('common.status'), type: 'status' },
        { key: 'purchase_price', label: t('cars.purchase'), type: 'currency' },
        { key: 'sale_price', label: t('cars.sale'), type: 'currency' },
        { key: 'created_at', label: t('common.created'), type: 'date' },
    ];

    return (
        <CrudPage
            title={t('cars.title')}
            description={t('cars.description')}
            actionLabel={t('cars.add')}
            rows={data?.data ?? []}
            total={data?.total ?? 0}
            page={page}
            perPage={perPage}
            search={search}
            isLoading={listQuery.isLoading}
            columns={columns}
            onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
            }}
            onPageChange={setPage}
            onCreate={(payload) => createMutation.mutateAsync(payload)}
            onUpdate={(id, payload) => updateMutation.mutateAsync({ id, payload })}
            onDelete={(id) => deleteMutation.mutateAsync(id)}
        />
    );
}

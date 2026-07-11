import CrudPage, { type Column } from '../../components/CrudPage';
import type { CustomerResource } from '../../types/resources';
import { useCrudResource } from '../../hooks/useCrudResource';
import { customersApi } from '../../api/resources.api';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export default function CustomersPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { listQuery, createMutation, updateMutation, deleteMutation } =
        useCrudResource('customers', customersApi, { search, page, perPage });
    const data = listQuery.data;
    const columns: Column<CustomerResource>[] = [
        { key: 'id', label: t('common.id'), type: 'number' },
        { key: 'name', label: t('orders.customer') },
        { key: 'email', label: t('common.email') },
        { key: 'phone', label: t('common.phone') },
        { key: 'address', label: t('common.address') },
    ];

    return (
        <CrudPage
            title={t('customers.title')}
            description={t('customers.description')}
            actionLabel={t('customers.add')}
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

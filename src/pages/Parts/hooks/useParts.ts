import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { partsApi } from '../../../api/parts.api';
import type { ListParams } from '../../../api/resourceStore';
import type { PartFormValues, SellPartFormValues } from '../parts.types';

export function useParts(params: ListParams) {
    const queryClient = useQueryClient();

    const listQuery = useQuery({
        queryKey: ['parts', params],
        queryFn: () => partsApi.list(params),
    });

    const carOptionsQuery = useQuery({
        queryKey: ['parts-car-options'],
        queryFn: partsApi.carOptions,
    });

    const saleOptionsQuery = useQuery({
        queryKey: ['parts-sale-options'],
        queryFn: partsApi.saleOptions,
    });

    const createMutation = useMutation({
        mutationFn: (payload: PartFormValues) => partsApi.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parts'] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: PartFormValues }) =>
            partsApi.update(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parts'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => partsApi.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parts'] }),
    });

    const sellMutation = useMutation({
        mutationFn: (payload: SellPartFormValues) => partsApi.sell(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parts'] });
            queryClient.invalidateQueries({ queryKey: ['parts-sale-options'] });
        },
    });

    return {
        listQuery,
        carOptionsQuery,
        saleOptionsQuery,
        createMutation,
        updateMutation,
        deleteMutation,
        sellMutation,
    };
}

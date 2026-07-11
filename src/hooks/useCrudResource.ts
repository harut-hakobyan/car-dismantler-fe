import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import type { ListParams, PaginatedResponse } from '../api/resourceStore';

type WithId = { id: number };

interface CrudApi<T extends WithId> {
    list(params?: ListParams): Promise<PaginatedResponse<T>>;
    create?(payload: Omit<T, 'id'>): Promise<T>;
    update?(id: number, payload: Omit<T, 'id'>): Promise<T>;
    remove?(id: number): Promise<void>;
}

export function useCrudResource<T extends WithId>(
    queryKey: string,
    api: CrudApi<T>,
    params: ListParams
) {
    const queryClient = useQueryClient();

    const listQuery = useQuery({
        queryKey: [queryKey, params],
        queryFn: () => api.list(params),
    });

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: [queryKey] });

    const createMutation = useMutation({
        mutationFn: (payload: Omit<T, 'id'>) => {
            if (!api.create) {
                throw new Error('Create is not supported for this resource');
            }

            return api.create(payload);
        },
        onSuccess: invalidate,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Omit<T, 'id'> }) => {
            if (!api.update) {
                throw new Error('Update is not supported for this resource');
            }

            return api.update(id, payload);
        },
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => {
            if (!api.remove) {
                throw new Error('Delete is not supported for this resource');
            }

            return api.remove(id);
        },
        onSuccess: invalidate,
    });

    return {
        listQuery,
        createMutation,
        updateMutation,
        deleteMutation,
    };
}

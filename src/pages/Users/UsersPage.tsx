import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import StatusChip from '../../components/StatusChip';
import { useCrudResource } from '../../hooks/useCrudResource';
import { usersApi } from '../../api/resources.api';
import type { UserResource } from '../../types/resources';
import { useTranslation } from '../../hooks/useTranslation';

const userSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.email('Enter a valid email'),
    role: z.string().min(2, 'Role is required'),
    status: z.enum(['active', 'inactive', 'pending', 'completed', 'cancelled']),
});

type UserFormValues = z.infer<typeof userSchema>;

const defaultValues: UserFormValues = {
    name: '',
    email: '',
    role: 'Sales',
    status: 'active',
};

export default function UsersPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [editingUser, setEditingUser] = useState<UserResource | null>(null);
    const [deleteUser, setDeleteUser] = useState<UserResource | null>(null);
    const perPage = 10;
    const { listQuery, createMutation, updateMutation, deleteMutation } =
        useCrudResource('users', usersApi, { search, page, perPage });
    const data = listQuery.data;
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues,
    });
    const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / perPage));

    useEffect(() => {
        if (editingUser) {
            form.reset({
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                status: editingUser.status,
            });
        } else {
            form.reset(defaultValues);
        }
    }, [editingUser, form]);

    async function submit(values: UserFormValues) {
        if (editingUser) {
            await updateMutation.mutateAsync({
                id: editingUser.id,
                payload: values,
            });
        } else {
            await createMutation.mutateAsync(values);
        }

        toast.success(t('users.saved'));
        setEditingUser(null);
    }

    async function confirmDelete() {
        if (!deleteUser) {
            return;
        }

        await deleteMutation.mutateAsync(deleteUser.id);
        toast.success(t('users.deleted'));
        setDeleteUser(null);
    }

    return (
        <>
            <PageHeader
                title={t('users.title')}
                description={t('users.description')}
                actionLabel={t('users.add')}
                onAction={() => setEditingUser({ id: 0, ...defaultValues })}
            />

            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ justifyContent: 'space-between', mb: 2 }}
                >
                    <TextField
                        size="small"
                        placeholder={t('users.search')}
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setEditingUser({ id: 0, ...defaultValues })}
                    >
                        {t('users.add')}
                    </Button>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('common.id')}</TableCell>
                                <TableCell>{t('common.name')}</TableCell>
                                <TableCell>{t('common.email')}</TableCell>
                                <TableCell>{t('common.role')}</TableCell>
                                <TableCell>{t('common.status')}</TableCell>
                                <TableCell align="right">{t('common.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(data?.data ?? []).map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <StatusChip status={user.status} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={t('common.edit')}>
                                            <IconButton
                                                size="small"
                                                onClick={() => setEditingUser(user)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('common.delete')}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => setDeleteUser(user)}
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
                        count={pageCount}
                        page={page}
                        onChange={(_event, value) => setPage(value)}
                        color="primary"
                    />
                </Stack>
            </Paper>

            <Dialog
                open={!!editingUser}
                onClose={() => setEditingUser(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {editingUser?.id ? t('users.edit') : t('users.create')}
                </DialogTitle>
                <DialogContent>
                    <Stack
                        component="form"
                        id="user-form"
                        spacing={2}
                        sx={{ mt: 1 }}
                        onSubmit={form.handleSubmit(submit)}
                    >
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={t('common.name')}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={t('common.email')}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="role"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    select
                                    label={t('common.role')}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                >
                                    {['Owner', 'Manager', 'Sales'].map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field }) => (
                                <TextField {...field} select label={t('common.status')}>
                                    {['active', 'inactive'].map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingUser(null)}>{t('common.cancel')}</Button>
                    <Button type="submit" form="user-form" variant="contained">
                        {t('common.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)}>
                <DialogTitle>{t('users.deleteTitle')}</DialogTitle>
                <DialogContent>
                    {t('users.deleteBody')}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteUser(null)}>{t('common.cancel')}</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>
                        {t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

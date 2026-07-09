import { useState } from 'react';
import {
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../../components/PageHeader';
import StatusChip from '../../components/StatusChip';
import { permissionsApi, rolesApi } from '../../api/resources.api';
import type { PermissionKey, RoleResource } from '../../types/resources';
import { useTranslation } from '../../hooks/useTranslation';

export default function RolesPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedRoleId, setSelectedRoleId] = useState(1);
    const rolesQuery = useQuery({
        queryKey: ['roles-all'],
        queryFn: rolesApi.all,
    });
    const permissionsQuery = useQuery({
        queryKey: ['permissions-all'],
        queryFn: permissionsApi.all,
    });
    const updateRoleMutation = useMutation({
        mutationFn: (role: RoleResource) => {
            const { id, ...payload } = role;
            return rolesApi.update(id, payload);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles-all'] }),
    });
    const roles = rolesQuery.data ?? [];
    const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];

    function togglePermission(permission: PermissionKey) {
        if (!selectedRole) {
            return;
        }

        const exists = selectedRole.permissions.includes(permission);
        const permissions = exists
            ? selectedRole.permissions.filter((item) => item !== permission)
            : [...selectedRole.permissions, permission];

        updateRoleMutation.mutate({ ...selectedRole, permissions });
    }

    return (
        <>
            <PageHeader
                title={t('roles.title')}
                description={t('roles.description')}
            />

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('roles.roles')}
                        </Typography>
                        <Stack spacing={1}>
                            {roles.map((role) => (
                                <Paper
                                    key={role.id}
                                    variant={role.id === selectedRole?.id ? 'elevation' : 'outlined'}
                                    onClick={() => setSelectedRoleId(role.id)}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        borderColor:
                                            role.id === selectedRole?.id
                                                ? 'primary.main'
                                                : 'divider',
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                                    >
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {role.name}
                                        </Typography>
                                        <StatusChip status={role.status} />
                                    </Stack>
                                    <Typography color="text.secondary" variant="body2">
                                        {role.users} {t('roles.usersCount')}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            {t('roles.permissions')}
                        </Typography>

                        <Grid container spacing={1}>
                            {(permissionsQuery.data ?? []).map((permission) => (
                                <Grid key={permission.key} size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    selectedRole?.permissions.includes(permission.key) ??
                                                    false
                                                }
                                                onChange={() => togglePermission(permission.key)}
                                            />
                                        }
                                        label={`${permission.label} (${permission.group})`}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

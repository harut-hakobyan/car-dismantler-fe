import { Button, Paper, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProfilePage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');

    return (
        <>
            <PageHeader
                title={t('profile.title')}
                description={t('profile.description')}
            />

            <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 640 }}>
                <Stack spacing={2}>
                    <TextField
                        label={t('common.name')}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <TextField
                        label={t('common.email')}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <TextField label={t('common.role')} value="Administrator" />
                    <Button
                        variant="contained"
                        sx={{ alignSelf: 'flex-start' }}
                        onClick={() => toast.success(t('profile.saved'))}
                    >
                        {t('profile.save')}
                    </Button>
                </Stack>
            </Paper>
        </>
    );
}

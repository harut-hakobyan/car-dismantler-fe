import {
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, type LoginSchema } from './LoginSchema';

import { useAuth } from '../../hooks/useAuth';

import { useNavigate } from 'react-router-dom';

import { toast } from 'react-hot-toast';
import { useTranslation } from '../../hooks/useTranslation';

export default function LoginForm() {
    const navigate = useNavigate();

    const { login } = useAuth();
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(values: LoginSchema) {
        try {
            await login(values);

            toast.success(t('login.success'));

            navigate('/');
        } catch (error) {
            const message =
                error instanceof Error ? error.message : t('login.error');

            toast.error(message);
        }
    }

    return (
        <Paper
            sx={{
                width: 400,
                p: 4,
            }}
        >
            <Typography
                variant="h4"
                sx={{ mb: 3, fontWeight: 700 }}
            >
                {t('login.title')}
            </Typography>

            <Stack
                spacing={2}
                component="form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    label={t('login.email')}
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    label={t('login.password')}
                    type="password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {t('login.submit')}
                </Button>
            </Stack>
        </Paper>
    );
}

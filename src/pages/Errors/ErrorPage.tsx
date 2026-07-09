import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
    code: 401 | 403 | 404;
    title: string;
    description: string;
}

export default function ErrorPage({ code, title, description }: ErrorPageProps) {
    const navigate = useNavigate();

    return (
        <Stack
            sx={{
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                bgcolor: 'background.default',
            }}
        >
            <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 520, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800 }}>
                    {code}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                    {title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    {description}
                </Typography>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Go to dashboard
                </Button>
            </Paper>
        </Stack>
    );
}

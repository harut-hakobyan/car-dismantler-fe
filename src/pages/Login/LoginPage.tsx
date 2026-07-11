import {
    Box,
} from '@mui/material';

import LoginForm from './LoginForm';

export default function LoginPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <LoginForm />
        </Box>
    );
}

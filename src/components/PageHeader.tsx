import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PageHeaderProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function PageHeader({
    title,
    description,
    actionLabel,
    onAction,
}: PageHeaderProps) {
    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                mb: 3,
            }}
        >
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {description}
                </Typography>
            </Box>

            {actionLabel && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </Stack>
    );
}

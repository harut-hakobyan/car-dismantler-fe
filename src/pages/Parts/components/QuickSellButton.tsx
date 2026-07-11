import { Box, Fab, Tooltip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useTranslation } from '../../../hooks/useTranslation';

interface QuickSellButtonProps {
    onClick: () => void;
}

export default function QuickSellButton({ onClick }: QuickSellButtonProps) {
    const { t } = useTranslation();

    return (
        <Tooltip title={t('parts.quickSellTooltip')} placement="left">
            <Box
                sx={{
                    position: 'fixed',
                    right: { xs: 20, md: 32 },
                    bottom: { xs: 20, md: 32 },
                    zIndex: (theme) => theme.zIndex.speedDial,
                }}
            >
                <Fab
                    color="primary"
                    onClick={onClick}
                    sx={{
                        width: 64,
                        height: 64,
                        boxShadow: 8,
                        background:
                            'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)',
                        '&:hover': {
                            background:
                                'linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%)',
                        },
                    }}
                >
                    <Box sx={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
                        <SmartToyIcon />
                        <PointOfSaleIcon
                            sx={{
                                position: 'absolute',
                                right: -10,
                                bottom: -9,
                                fontSize: 20,
                                bgcolor: 'background.paper',
                                color: 'primary.main',
                                borderRadius: '50%',
                                p: 0.25,
                            }}
                        />
                    </Box>
                </Fab>
            </Box>
        </Tooltip>
    );
}

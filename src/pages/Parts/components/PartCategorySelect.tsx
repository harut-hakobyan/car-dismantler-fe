import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    TextField,
} from '@mui/material';
import type { ReactNode } from 'react';
import BuildIcon from '@mui/icons-material/Build';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import SettingsIcon from '@mui/icons-material/Settings';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import BoltIcon from '@mui/icons-material/Bolt';
import WeekendIcon from '@mui/icons-material/Weekend';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CompressIcon from '@mui/icons-material/Compress';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CategoryIcon from '@mui/icons-material/Category';
import {
    getPartCategoryLabelKey,
    partCategories,
    type PartCategory,
} from '../parts.types';
import { useTranslation } from '../../../hooks/useTranslation';

interface PartCategorySelectProps {
    value: PartCategory;
    error?: boolean;
    helperText?: string;
    onChange: (value: PartCategory) => void;
}

const categoryIcons: Record<PartCategory, ReactNode> = {
    Engine: <PrecisionManufacturingIcon fontSize="small" />,
    Transmission: <SettingsIcon fontSize="small" />,
    Suspension: <CarRepairIcon fontSize="small" />,
    'Brake System': <BuildIcon fontSize="small" />,
    Electrical: <BoltIcon fontSize="small" />,
    'Body Parts': <WeekendIcon fontSize="small" />,
    Interior: <AirlineSeatReclineNormalIcon fontSize="small" />,
    Exterior: <DirectionsCarIcon fontSize="small" />,
    'Wheels & Tires': <TireRepairIcon fontSize="small" />,
    Lights: <LightbulbIcon fontSize="small" />,
    'Cooling System': <AcUnitIcon fontSize="small" />,
    Exhaust: <CompressIcon fontSize="small" />,
    'Fuel System': <LocalGasStationIcon fontSize="small" />,
    Other: <CategoryIcon fontSize="small" />,
};

export default function PartCategorySelect({
    value,
    error,
    helperText,
    onChange,
}: PartCategorySelectProps) {
    const { t } = useTranslation();

    return (
        <TextField
            select
            label={t('parts.category')}
            value={value}
            error={error}
            helperText={helperText}
            onChange={(event) => onChange(event.target.value as PartCategory)}
            fullWidth
        >
            {partCategories.map((category) => (
                <MenuItem key={category} value={category}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        {categoryIcons[category]}
                    </ListItemIcon>
                    <ListItemText primary={t(getPartCategoryLabelKey(category))} />
                </MenuItem>
            ))}
        </TextField>
    );
}

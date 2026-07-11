import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from '@mui/material';
import { languages, type Language } from '../i18n/translations';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSelectProps {
    size?: 'small' | 'medium';
    label?: boolean;
}

export default function LanguageSelect({
    size = 'small',
    label = false,
}: LanguageSelectProps) {
    const { language, setLanguage, t } = useTranslation();
    const labelId = 'language-select-label';

    function handleChange(event: SelectChangeEvent) {
        setLanguage(event.target.value as Language);
    }

    return (
        <FormControl size={size} sx={{ minWidth: label ? 180 : 84 }}>
            {label && <InputLabel id={labelId}>{t('common.language')}</InputLabel>}
            <Select
                labelId={label ? labelId : undefined}
                value={language}
                label={label ? t('common.language') : undefined}
                onChange={handleChange}
            >
                {languages.map((item) => (
                    <MenuItem key={item.code} value={item.code}>
                        {label ? item.label : item.shortLabel}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

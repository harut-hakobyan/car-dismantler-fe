import {
    FormControlLabel,
    Paper,
    Stack,
    Switch,
    TextField,
} from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { useThemeMode } from '../../hooks/useThemeMode';
import LanguageSelect from '../../components/LanguageSelect';
import { useTranslation } from '../../hooks/useTranslation';

export default function SettingsPage() {
    const { mode, toggleMode } = useThemeMode();
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('settings.title')}
                description={t('settings.description')}
            />

            <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 720 }}>
                <Stack spacing={2}>
                    <LanguageSelect size="medium" label />
                    <TextField label={t('settings.companyName')} defaultValue="Car Dismantler" />
                    <TextField label={t('settings.defaultCurrency')} defaultValue="AMD" />
                    <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('settings.lowStock')}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={mode === 'dark'}
                                onChange={toggleMode}
                            />
                        }
                        label={t('settings.darkMode')}
                    />
                    <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('settings.confirmDelete')}
                    />
                </Stack>
            </Paper>
        </>
    );
}

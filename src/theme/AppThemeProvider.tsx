import {
    CssBaseline,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import {
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { ThemeModeContext, type ThemeMode } from './ThemeModeContext';

export function AppThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>(() => {
        const storedMode = localStorage.getItem('theme_mode');
        return storedMode === 'dark' ? 'dark' : 'light';
    });
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#2563eb',
                    },
                    secondary: {
                        main: '#0f766e',
                    },
                    background: {
                        default: mode === 'light' ? '#f3f6f8' : '#101827',
                        paper: mode === 'light' ? '#ffffff' : '#172033',
                    },
                },
                shape: {
                    borderRadius: 8,
                },
                typography: {
                    fontFamily:
                        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                },
                components: {
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundImage: 'none',
                            },
                        },
                    },
                    MuiButton: {
                        defaultProps: {
                            disableElevation: true,
                        },
                    },
                },
            }),
        [mode]
    );

    function toggleMode() {
        setMode((currentMode) => {
            const nextMode = currentMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme_mode', nextMode);
            return nextMode;
        });
    }

    const value = useMemo(
        () => ({
            mode,
            toggleMode,
        }),
        [mode]
    );

    return (
        <ThemeModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
}

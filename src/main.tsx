import React from 'react';
import ReactDOM from 'react-dom/client';

import { QueryClient } from '@tanstack/react-query';

import { QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './auth/AuthContext';

import AppRouter from './routes/AppRouter';
import { AppThemeProvider } from './theme/AppThemeProvider';
import { I18nProvider } from './i18n/I18nProvider';

const queryClient = new QueryClient();

ReactDOM.createRoot(
    document.getElementById('root')!
).render(

    <React.StrictMode>

        <I18nProvider>

            <AppThemeProvider>

                <QueryClientProvider client={queryClient}>

                    <AuthProvider>

                        <AppRouter />

                        <Toaster
                            position="top-right"
                        />

                    </AuthProvider>

                </QueryClientProvider>

            </AppThemeProvider>

        </I18nProvider>

    </React.StrictMode>

);

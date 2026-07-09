import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

import LoginPage from '../pages/Login';

import DashboardLayout from '../layouts/DashboardLayout';

import DashboardPage from '../pages/Dashboard/DashboardPage';

import ProtectedRoute from '../auth/ProtectedRoute';
import UsersPage from '../pages/Users/UsersPage';
import RolesPage from '../pages/Roles/RolesPage';
import CarsPage from '../pages/Cars/CarsPage';
import PartsPage from '../pages/Parts/PartsPage';
import OrdersPage from '../pages/Orders/OrdersPage';
import CustomersPage from '../pages/Customers/CustomersPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import ErrorPage from '../pages/Errors/ErrorPage';
import { useTranslation } from '../hooks/useTranslation';

export default function AppRouter() {
    const { t } = useTranslation();

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={<DashboardPage />}
                    />

                    <Route
                        path="users"
                        element={<UsersPage />}
                    />

                    <Route
                        path="roles"
                        element={<RolesPage />}
                    />

                    <Route
                        path="cars"
                        element={<CarsPage />}
                    />

                    <Route
                        path="parts"
                        element={<PartsPage />}
                    />

                    <Route
                        path="orders"
                        element={<OrdersPage />}
                    />

                    <Route
                        path="customers"
                        element={<CustomersPage />}
                    />

                    <Route
                        path="profile"
                        element={<ProfilePage />}
                    />

                    <Route
                        path="settings"
                        element={<SettingsPage />}
                    />
                </Route>

                <Route
                    path="/401"
                    element={
                        <ErrorPage
                            code={401}
                            title={t('errors.401.title')}
                            description={t('errors.401.description')}
                        />
                    }
                />

                <Route
                    path="/403"
                    element={
                        <ErrorPage
                            code={403}
                            title={t('errors.403.title')}
                            description={t('errors.403.description')}
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <ErrorPage
                            code={404}
                            title={t('errors.404.title')}
                            description={t('errors.404.description')}
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

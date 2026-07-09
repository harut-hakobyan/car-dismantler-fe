import {
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import * as authApi from '../api/auth.api';
import { authStorage } from './storage';
import type { LoginRequest, User } from './types';
import { AuthContext } from './AuthContextValue';

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initialize() {
            const token = authStorage.getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await authApi.me();
                setUser(currentUser);
            } catch {
                authStorage.removeToken();
            } finally {
                setLoading(false);
            }
        }

        initialize();
    }, []);

    async function login(data: LoginRequest) {
        const response = await authApi.login(data);

        authStorage.setToken(response.token);
        setUser(response.user);
    }

    async function logout() {
        await authApi.logout();

        authStorage.removeToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

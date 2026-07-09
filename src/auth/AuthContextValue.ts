import { createContext } from 'react';
import type { LoginRequest, User } from './types';

export interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login(data: LoginRequest): Promise<void>;
    logout(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

import type { LoginRequest, LoginResponse, User } from '../auth/types';
import api from './axios';

/*
|--------------------------------------------------------------------------
| Mock API
|--------------------------------------------------------------------------
|
| Replace these functions with Laravel endpoints later.
|
*/

export async function login(
    data: LoginRequest
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
}

export async function logout(): Promise<{ message: string }> {
    return (await api.post<{ message: string }>('/logout')).data;
}

export async function me(): Promise<User> {
    const response = await api.get<{ user: User }>('/me');
    return response.data.user;
}

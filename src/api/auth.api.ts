import type { LoginRequest, LoginResponse, User } from '../auth/types';

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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (
                data.email === 'admin@example.com' &&
                data.password === 'password'
            ) {
                resolve({
                    message: 'Login successful',
                    token: 'mock-token-123456789',
                    token_type: 'Bearer',
                    user: {
                        id: 1,
                        name: 'Administrator',
                        email: 'admin@example.com',
                    },
                });

                return;
            }

            reject(new Error('Invalid email or password'));
        }, 700);
    });

    /*
    TODO

    const response = await api.post<LoginResponse>('/login', data);

    return response.data;
    */
}

export async function logout(): Promise<{ message: string }> {
    /*
    TODO

    return (await api.post<{ message: string }>('/logout')).data;
    */

    return Promise.resolve({ message: 'Logged out successfully' });
}

export async function me(): Promise<User> {
    /*
    TODO

    const response = await api.get<{ user: User }>('/me');

    return response.data.user;
    */

    return Promise.resolve({
        id: 1,
        name: 'Administrator',
        email: 'admin@example.com',
    });
}

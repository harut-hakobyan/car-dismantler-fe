export interface User {
    id: number;
    name: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    token_type: 'Bearer';
    user: User;
}

export interface MeResponse {
    user: User;
}

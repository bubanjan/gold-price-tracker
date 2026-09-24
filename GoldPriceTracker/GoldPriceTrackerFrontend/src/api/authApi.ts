import type { CurrentUser } from "../types/CurrentUser";
import type { LoginRequest } from "../types/LoginRequest";

const url = 'https://localhost:7111/api/auth';

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
    console.log('getCurrentUser CALLED');
    const response = await fetch(`${url}/me`, { credentials: 'include' });

    if (response.status === 401) {
        return null;
    }
    console.log('ME RESPONSE:', response.status);

    if (!response.ok) {
        throw new Error('Failed to get current user');
    }

    return response.json();
}

export const login = async (request: LoginRequest): Promise<void> => {
    const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (response.status === 401) {
        throw new Error('Invalid username or password');
    }

    if (!response.ok) {
        throw new Error('Failed to log in');
    }
};

export const logout = async (): Promise<void> => {
    const response = await fetch(`${url}/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to log out');
    }
};
import api from './api';
import type { ApiResponse, User, VerifyResponse } from '@/types';

/**
 * Register a new user
 */
export async function register(
    email: string,
    password: string,
    fullName: string
): Promise<User> {
    try {
        const response = await api.post<ApiResponse<{ user: User }>>(
            '/api/auth/register',
            { email, password, fullName }
        );

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Registration failed');
        }

        return response.data.data.user;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Registration failed. Please try again.');
    }
}

/**
 * Login user with email and password
 * Sets HTTP-only cookie on success
 */
export async function login(email: string, password: string): Promise<User> {
    try {
        const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/login', {
            email,
            password,
        });

        if (response.data.success && response.data.data?.user) {
            return response.data.data.user;
        }

        throw new Error('Login failed');
    } catch (error: any) {
        // Extract error message from response
        const message = error.response?.data?.message || error.response?.data?.error || 'Invalid email or password';
        throw new Error(message);
    }
}

/**
 * Verify if user is authenticated
 * Checks if auth_token cookie is valid
 */
export async function verifyAuth(): Promise<{ authenticated: boolean; user: User | null }> {
    try {
        const response = await api.get<VerifyResponse>('/api/auth/verify');

        if (response.data.success && response.data.data.authenticated) {
            return {
                authenticated: true,
                user: response.data.data.user,
            };
        }

        return { authenticated: false, user: null };
    } catch (error) {
        return { authenticated: false, user: null };
    }
}

/**
 * Logout user
 * Clears auth_token cookie
 */
export async function logout(): Promise<void> {
    try {
        await api.post('/api/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
        // Even if logout fails, we'll redirect to login
    }
}

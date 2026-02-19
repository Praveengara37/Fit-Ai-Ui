import api from './api';
import type {
    ApiResponse,
    UserWithProfile,
    UserProfile,
    ProfileSetupRequest,
    ProfileUpdateRequest
} from '@/types';

/**
 * Setup user profile (first-time)
 */
export async function setupProfile(data: ProfileSetupRequest): Promise<UserWithProfile> {
    try {
        const response = await api.post<ApiResponse<{ profile: UserWithProfile }>>(
            '/api/profile/setup',
            data
        );

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Profile setup failed');
        }

        return response.data.data.profile;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Profile setup failed. Please try again.');
    }
}

/**
 * Get user profile
 */
export async function getProfile(): Promise<UserWithProfile> {
    try {
        const response = await api.get<ApiResponse<{ user: { id: string; email: string; fullName: string }; profile: UserProfile | null }>>(
            '/api/profile/me'
        );

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Failed to fetch profile');
        }

        const { user, profile } = response.data.data;
        return { ...user, profile };
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch profile. Please try again.');
    }
}

/**
 * Update user profile
 */
export async function updateProfile(data: ProfileUpdateRequest): Promise<UserWithProfile> {
    try {
        const response = await api.patch<ApiResponse<{ user: { id: string; email: string; fullName: string }; profile: UserProfile | null }>>(
            '/api/profile/update',
            data
        );

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Profile update failed');
        }

        const { user, profile } = response.data.data;
        return { ...user, profile };
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Profile update failed. Please try again.');
    }
}

/**
 * Change user password
 */
export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<void> {
    try {
        const response = await api.post<ApiResponse<void>>(
            '/api/auth/change-password',
            { currentPassword, newPassword }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Password change failed');
        }
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Password change failed. Please try again.');
    }
}

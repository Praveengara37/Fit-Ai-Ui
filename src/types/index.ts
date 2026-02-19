// User types
export interface User {
    id: string;
    email: string;
    fullName: string;
}

// Profile enums (match backend exactly)
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type FitnessGoal = 'lose_weight' | 'gain_muscle' | 'maintain' | 'get_fit';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'halal';

// Profile interface
export interface UserProfile {
    id: string;
    userId: string;
    dateOfBirth: string;
    gender: Gender;
    heightCm: number;
    currentWeightKg: number;
    targetWeightKg: number | null;
    fitnessGoal: FitnessGoal;
    activityLevel: ActivityLevel;
    dietaryPreference: DietaryPreference;
    createdAt: string;
    updatedAt: string;
}

// Extended user with profile
export interface UserWithProfile extends User {
    profile: UserProfile | null;
}

// Auth request/response types
export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        user: User;
    };
}

export interface VerifyResponse {
    success: boolean;
    data: {
        authenticated: boolean;
        user: User;
    };
}

// Profile request types
export interface ProfileSetupRequest {
    dateOfBirth: string;
    gender: Gender;
    heightCm: number;
    currentWeightKg: number;
    targetWeightKg: number | null;
    fitnessGoal: FitnessGoal;
    activityLevel: ActivityLevel;
    dietaryPreference: DietaryPreference;
}

export interface ProfileUpdateRequest extends Partial<ProfileSetupRequest> { }

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

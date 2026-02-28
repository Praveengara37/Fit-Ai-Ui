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
    dailyStepGoal?: number;
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

// ─── Meal Tracking Types ───────────────────────────────────────

export interface Food {
    foodId: string;
    name: string;
    brandName?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: number;
    servingUnit: string;
}

export interface MealFood {
    id?: string;
    foodId?: string;
    foodName: string;
    brandName?: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
    id: string;
    mealType: MealType;
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    notes?: string;
    foods: MealFood[];
    createdAt: string;
}

export interface DailyMeals {
    date: string;
    meals: Meal[];
    totals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    goals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    remaining: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

export interface NutritionGoals {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFat: number;
}

export interface MealStats {
    period: 'week' | 'month' | 'year';
    totalCalories: number;
    averageCalories: number;
    totalProtein: number;
    averageProtein: number;
    totalCarbs: number;
    averageCarbs: number;
    totalFat: number;
    averageFat: number;
    daysLogged: number;
    totalMeals: number;
    goalReachedDays: number;
    dailyBreakdown?: Array<{
        date: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    }>;
}

export interface LogMealData {
    mealType: MealType;
    date: string;
    foods: Array<{
        foodId?: string;
        foodName: string;
        brandName?: string;
        servingSize: number;
        servingUnit: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    }>;
    notes?: string;
}

// ─── Recommendations Types ────────────────────────────────────

export interface Recommendations {
    bmr: number;
    tdee: number;
    recommendedCalories: number;
    reason: string;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    macroRatios: {
        protein: string;
        carbs: string;
        fat: string;
    };
}

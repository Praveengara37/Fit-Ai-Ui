import api from './api';
import { LogMealData, NutritionGoals } from '@/types';

export async function searchFoods(query: string, maxResults = 10) {
    const response = await api.get('/api/foods/search', {
        params: { query, maxResults },
    });
    return response.data.data;
}

export async function getFoodById(foodId: string) {
    const response = await api.get(`/api/foods/${foodId}`);
    return response.data.data;
}

export async function getTodayMeals() {
    const response = await api.get('/api/meals/today');
    return response.data.data;
}

export async function logMeal(data: LogMealData) {
    const response = await api.post('/api/meals/log', data);
    return response.data.data;
}

export async function getMealHistory(startDate: string, endDate: string) {
    const response = await api.get('/api/meals/history', {
        params: { startDate, endDate },
    });
    return response.data.data;
}

export async function getMealStats(period: 'week' | 'month' | 'year') {
    const response = await api.get('/api/meals/stats', {
        params: { period },
    });
    return response.data.data;
}

export async function updateMeal(mealId: string, data: Partial<LogMealData>) {
    const response = await api.patch(`/api/meals/${mealId}`, data);
    return response.data.data;
}

export async function deleteMeal(mealId: string) {
    await api.delete(`/api/meals/${mealId}`);
}

export async function setNutritionGoals(goals: NutritionGoals) {
    const response = await api.post('/api/nutrition/goals', goals);
    return response.data.data;
}

export async function getNutritionGoals() {
    const response = await api.get('/api/nutrition/goals');
    return response.data.data;
}

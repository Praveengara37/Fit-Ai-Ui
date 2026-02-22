import api from './api';
import { DailySteps, StepsHistory, StepsStats } from '@/types/analytics';

export async function getTodaySteps(): Promise<DailySteps> {
    const response = await api.get('/api/steps/today');
    return response.data.data.steps;
}

export async function getStepsHistory(
    startDate: string,
    endDate: string
): Promise<StepsHistory> {
    const response = await api.get('/api/steps/history', {
        params: { startDate, endDate }
    });
    return response.data.data;
}

export async function getStepsStats(
    period: 'week' | 'month' | 'year'
): Promise<StepsStats> {
    const response = await api.get('/api/steps/stats', {
        params: { period }
    });
    return response.data.data.stats;
}

// Helper to calculate date ranges
export function getDateRange(period: 'day' | 'week' | 'month' | 'year') {
    const end = new Date();
    const start = new Date();

    switch (period) {
        case 'day':
            start.setHours(0, 0, 0, 0);
            break;
        case 'week':
            start.setDate(end.getDate() - 7);
            break;
        case 'month':
            start.setDate(end.getDate() - 30);
            break;
        case 'year':
            start.setDate(end.getDate() - 365);
            break;
    }

    return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
    };
}

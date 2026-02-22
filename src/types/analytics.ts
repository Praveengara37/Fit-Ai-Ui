export interface DailySteps {
    id?: string;
    userId: string;
    date: string;
    steps: number;
    goalSteps: number;
    distanceKm: number;
    caloriesBurned: number;
    activeMinutes: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface StepsHistory {
    history: DailySteps[];
    totalSteps: number;
    averageSteps: number;
}

export interface StepsStats {
    totalSteps: number;
    averageSteps: number;
    totalDistanceKm: number;
    totalCalories: number;
    bestDay: { date: string; steps: number } | null;
    currentStreak: number;
    daysWithActivity: number;
    goalReachedDays: number;
    comparisonPercent?: number; // Added based on requirements for trends
}

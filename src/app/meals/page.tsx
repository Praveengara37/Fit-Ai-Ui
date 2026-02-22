'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    ChevronLeft,
    Plus,
    UtensilsCrossed,
    BarChart3,
    Target,
    History,
} from 'lucide-react';
import { toast } from 'sonner';
import { getTodayMeals, deleteMeal as deleteMealApi } from '@/lib/meals';
import { DailyMeals } from '@/types';
import MealCard from '@/components/meals/MealCard';
import NutritionSummary from '@/components/meals/NutritionSummary';

export default function MealsPage() {
    const router = useRouter();
    const [data, setData] = useState<DailyMeals | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            setLoading(true);
            setError(null);
            const mealsData = await getTodayMeals();
            setData(mealsData);
        } catch {
            setError('Failed to load meals. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (mealId: string) => {
        if (deleteConfirm !== mealId) {
            setDeleteConfirm(mealId);
            return;
        }

        try {
            await deleteMealApi(mealId);
            toast.success('Meal deleted');
            fetchMeals();
        } catch {
            toast.error('Failed to delete meal');
        } finally {
            setDeleteConfirm(null);
        }
    };

    // Group meals by type
    const mealOrder: string[] = ['breakfast', 'lunch', 'dinner', 'snack'];
    const groupedMeals = mealOrder
        .map((type) => ({
            type,
            meals: (data?.meals || []).filter((m) => m.mealType === type),
        }))
        .filter((group) => group.meals.length > 0);

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 bg-[#2a2235] hover:bg-[#a855f7]/20 rounded-xl transition-colors text-gray-300 hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Today&apos;s Meals</h1>
                            <p className="text-gray-400 text-sm">{today}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Nav */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                        onClick={() => router.push('/meals/analytics')}
                        className="flex items-center gap-2 px-4 py-3 bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-xl text-sm text-gray-400 hover:text-white hover:border-[rgba(168,85,247,0.35)] transition-all"
                    >
                        <BarChart3 size={16} /> Analytics
                    </button>
                    <button
                        onClick={() => router.push('/meals/goals')}
                        className="flex items-center gap-2 px-4 py-3 bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-xl text-sm text-gray-400 hover:text-white hover:border-[rgba(168,85,247,0.35)] transition-all"
                    >
                        <Target size={16} /> Goals
                    </button>
                    <button
                        onClick={() => router.push('/meals/history')}
                        className="flex items-center gap-2 px-4 py-3 bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-xl text-sm text-gray-400 hover:text-white hover:border-[rgba(168,85,247,0.35)] transition-all"
                    >
                        <History size={16} /> History
                    </button>
                    <button
                        onClick={() => router.push('/meals/log')}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    >
                        <Plus size={16} /> Log Meal
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                        {error}
                        <button onClick={fetchMeals} className="ml-2 underline hover:text-red-300">
                            Retry
                        </button>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* Meal Cards */}
                        {groupedMeals.length > 0 ? (
                            <div className="space-y-3">
                                {groupedMeals.map((group) =>
                                    group.meals.map((meal) => (
                                        <MealCard
                                            key={meal.id}
                                            meal={meal}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-12 text-center">
                                <UtensilsCrossed className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No meals logged today</h3>
                                <p className="text-gray-500 mb-6 text-sm">Start tracking your nutrition by logging your first meal</p>
                                <button
                                    onClick={() => router.push('/meals/log')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl font-semibold transition-all hover:scale-[1.02]"
                                >
                                    <Plus size={18} /> Log Your First Meal
                                </button>
                            </div>
                        )}

                        {/* Daily Summary */}
                        {data && groupedMeals.length > 0 && (
                            <NutritionSummary
                                totals={data.totals}
                                goals={data.goals}
                                remaining={data.remaining}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

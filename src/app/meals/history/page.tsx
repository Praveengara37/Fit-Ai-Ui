'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Loader2,
    ChevronDown,
    ChevronUp,
    Download,
    Calendar,
} from 'lucide-react';
import { getMealHistory } from '@/lib/meals';

interface HistoryFood {
    foodName: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface HistoryMeal {
    id: string;
    mealType: string;
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    notes?: string | null;
    foods: HistoryFood[];
    createdAt?: string;
}

interface DayGroup {
    date: string;
    displayDate: string;
    totalCalories: number;
    totalProtein: number;
    meals: HistoryMeal[];
}

const RANGE_OPTIONS = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 14 Days', days: 14 },
    { label: 'Last 30 Days', days: 30 },
];

export default function MealHistoryPage() {
    const router = useRouter();
    const [rangeDays, setRangeDays] = useState(7);
    const [dayGroups, setDayGroups] = useState<DayGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, [rangeDays]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - rangeDays);

            const start = startDate.toISOString().split('T')[0];
            const end = endDate.toISOString().split('T')[0];

            const data = await getMealHistory(start, end);

            // Backend returns { history: [{ date, meals, totals }], periodStats }
            const history = data?.history || [];

            const groups: DayGroup[] = history.map((day: any) => ({
                date: day.date,
                displayDate: new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                }),
                totalCalories: day.totals?.calories || 0,
                totalProtein: day.totals?.protein || 0,
                meals: (day.meals || []).map((meal: any) => ({
                    id: meal.id,
                    mealType: meal.mealType,
                    date: day.date,
                    totalCalories: meal.totalCalories || 0,
                    totalProtein: meal.totalProtein || 0,
                    totalCarbs: meal.totalCarbs || 0,
                    totalFat: meal.totalFat || 0,
                    notes: meal.notes,
                    foods: meal.foods || [],
                    createdAt: meal.createdAt,
                })),
            }));

            // Sort descending by date
            groups.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setDayGroups(groups);
        } catch (err) {
            console.error('❌ Meal History Error:', err);
            setError('Failed to load meal history.');
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const rows = [['Date', 'Meal Type', 'Food', 'Calories', 'Protein', 'Carbs', 'Fat']];

        dayGroups.forEach((day) => {
            day.meals.forEach((meal) => {
                meal.foods.forEach((food: HistoryFood) => {
                    rows.push([
                        day.date,
                        meal.mealType,
                        food.foodName,
                        String(food.calories),
                        String(food.protein),
                        String(food.carbs),
                        String(food.fat),
                    ]);
                });
            });
        });

        const csv = rows.map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meal-history-${rangeDays}days.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const avgCalories = dayGroups.length > 0
        ? Math.round(dayGroups.reduce((sum, d) => sum + d.totalCalories, 0) / dayGroups.length)
        : 0;

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/meals')}
                            className="p-2 bg-[#2a2235] hover:bg-[#a855f7]/20 rounded-xl transition-colors text-gray-300 hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Meal History</h1>
                            <p className="text-gray-400 text-sm">Review your past meals</p>
                        </div>
                    </div>
                    <button
                        onClick={exportCSV}
                        disabled={dayGroups.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2a2235] border border-[rgba(168,85,247,0.25)] text-gray-300 hover:text-white rounded-xl text-sm transition-all disabled:opacity-40"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>

                {/* Range Selector */}
                <div className="flex bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-xl p-1 w-fit">
                    {RANGE_OPTIONS.map((opt) => (
                        <button
                            key={opt.days}
                            onClick={() => setRangeDays(opt.days)}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${rangeDays === opt.days
                                ? 'bg-[#a855f7] text-white'
                                : 'text-gray-400 hover:text-white'
                                } disabled:opacity-50`}
                        >
                            {opt.label}
                        </button>
                    ))}
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
                    </div>
                )}

                {/* Day Cards */}
                {!loading && !error && (
                    <>
                        {dayGroups.length > 0 ? (
                            <div className="space-y-3">
                                {dayGroups.map((day) => (
                                    <div
                                        key={day.date}
                                        className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() =>
                                                setExpandedDay(expandedDay === day.date ? null : day.date)
                                            }
                                            className="w-full flex items-center justify-between p-5 text-left"
                                        >
                                            <div>
                                                <h3 className="text-white font-semibold">{day.displayDate}</h3>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {day.totalCalories.toLocaleString()} calories · {day.totalProtein}g protein
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500">
                                                    {day.meals.length} {day.meals.length === 1 ? 'meal' : 'meals'}
                                                </span>
                                                {expandedDay === day.date ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                                )}
                                            </div>
                                        </button>

                                        {expandedDay === day.date && (
                                            <div className="border-t border-[rgba(168,85,247,0.1)] px-5 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                                {day.meals.map((meal) => (
                                                    <div key={meal.id} className="pt-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-[#a855f7] capitalize">
                                                                {meal.mealType}
                                                            </span>
                                                            <span className="text-sm text-gray-400">
                                                                {meal.totalCalories} cal
                                                            </span>
                                                        </div>
                                                        {meal.foods.map((food: HistoryFood, idx: number) => (
                                                            <p key={idx} className="text-xs text-gray-500 ml-3">
                                                                • {food.foodName} ({food.servingSize}{food.servingUnit}) — {food.calories} cal
                                                            </p>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-12 text-center">
                                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No meal history</h3>
                                <p className="text-gray-500 text-sm">
                                    No meals found in the last {rangeDays} days
                                </p>
                            </div>
                        )}

                        {/* Weekly Average */}
                        {dayGroups.length > 0 && (
                            <div className="bg-gradient-to-r from-[#2a2235] to-[#a855f7]/10 border border-[rgba(168,85,247,0.2)] rounded-2xl p-5 text-center">
                                <p className="text-gray-400 text-sm">
                                    Average:{' '}
                                    <span className="text-white font-bold text-lg">
                                        {avgCalories.toLocaleString()}
                                    </span>{' '}
                                    calories / day
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

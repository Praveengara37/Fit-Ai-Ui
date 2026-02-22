'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, TrendingUp, Flame, Calendar, Award } from 'lucide-react';
import { getMealStats, getNutritionGoals } from '@/lib/meals';
import { MealStats, NutritionGoals } from '@/types';
import CalorieChart from '@/components/meals/CalorieChart';
import MacroChart from '@/components/meals/MacroChart';

export default function NutritionAnalyticsPage() {
    const router = useRouter();
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
    const [stats, setStats] = useState<MealStats | null>(null);
    const [goals, setGoals] = useState<NutritionGoals | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [period]);

    const normalizeStats = (data: any): MealStats => ({
        period: data?.period || period,
        totalCalories: data?.totalCalories ?? 0,
        averageCalories: data?.averageCalories ?? 0,
        totalProtein: data?.totalProtein ?? 0,
        averageProtein: data?.averageProtein ?? 0,
        totalCarbs: data?.totalCarbs ?? 0,
        averageCarbs: data?.averageCarbs ?? 0,
        totalFat: data?.totalFat ?? 0,
        averageFat: data?.averageFat ?? 0,
        daysLogged: data?.daysLogged ?? 0,
        totalMeals: data?.totalMeals ?? 0,
        goalReachedDays: data?.goalReachedDays ?? 0,
        dailyBreakdown: data?.dailyBreakdown || [],
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [statsData, goalsData] = await Promise.all([
                getMealStats(period),
                getNutritionGoals(),
            ]);
            setStats(normalizeStats(statsData));
            setGoals(goalsData);
        } catch {
            setError('Failed to load analytics. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calorieGoal = goals?.dailyCalories || 2000;
    const dailyData = stats?.dailyBreakdown || [];

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/meals')}
                            className="p-2 bg-[#2a2235] hover:bg-[#a855f7]/20 rounded-xl transition-colors text-gray-300 hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Nutrition Analytics</h1>
                            <p className="text-gray-400 text-sm">Track your nutrition trends over time</p>
                        </div>
                    </div>

                    {/* Period Selector */}
                    <div className="flex bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-xl p-1">
                        {(['week', 'month', 'year'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p
                                    ? 'bg-[#a855f7] text-white'
                                    : 'text-gray-400 hover:text-white'
                                    } disabled:opacity-50`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && !stats ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                    </div>
                ) : stats ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame className="w-4 h-4 text-[#a855f7]" />
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Total Calories</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.totalCalories.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-1">this {period}</p>
                            </div>
                            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-[#22d3ee]" />
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Daily Average</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.averageCalories.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-1">vs goal {calorieGoal}</p>
                            </div>
                            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-[#22d3ee]" />
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Days Logged</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.daysLogged}</p>
                                <p className="text-xs text-gray-500 mt-1">{stats.totalMeals} meals total</p>
                            </div>
                            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-4 h-4 text-[#f59e0b]" />
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">On Track</span>
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    {stats.goalReachedDays}/{stats.daysLogged}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">days at goal</p>
                            </div>
                        </div>

                        {/* Charts */}
                        <CalorieChart data={dailyData} goal={calorieGoal} />
                        <MacroChart data={dailyData} />

                        {/* Weekly Summary */}
                        <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-4">Summary</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Avg Protein</p>
                                    <p className="text-white font-semibold">{stats.averageProtein}g/day</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Avg Carbs</p>
                                    <p className="text-white font-semibold">{stats.averageCarbs}g/day</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Avg Fat</p>
                                    <p className="text-white font-semibold">{stats.averageFat}g/day</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Meals</p>
                                    <p className="text-white font-semibold">{stats.totalMeals}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

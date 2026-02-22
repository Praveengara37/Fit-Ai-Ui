'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';

import StepTrendChart from '@/components/analytics/StepTrendChart';
import CalendarHeatmap from '@/components/analytics/CalendarHeatmap';
import InsightsPanel from '@/components/analytics/InsightsPanel';
import AchievementsList from '@/components/analytics/AchievementsList';
import PeriodSelector from '@/components/analytics/PeriodSelector';
import QuickStatsGrid from '@/components/analytics/QuickStatsGrid';

import { getStepsHistory, getStepsStats } from '@/lib/analytics';
import { StepsHistory, StepsStats } from '@/types/analytics';

export default function AnalyticsPage() {
    const router = useRouter();
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

    const [historyData, setHistoryData] = useState<StepsHistory | null>(null);
    const [statsData, setStatsData] = useState<StepsStats | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Calculate date ranges based on period
                const end = new Date();
                const start = new Date();

                switch (period) {
                    case 'day': start.setHours(0, 0, 0, 0); break;
                    case 'week': start.setDate(end.getDate() - 7); break;
                    case 'month': start.setDate(end.getDate() - 30); break;
                    case 'year': start.setDate(end.getDate() - 365); break;
                }

                const startDateStr = start.toISOString().split('T')[0];
                const endDateStr = end.toISOString().split('T')[0];

                // Ensure we fetch stats for the specific period if supported, or let the API handle it
                let periodParam: 'week' | 'month' | 'year' = 'month';
                if (period === 'week' || period === 'month' || period === 'year') {
                    periodParam = period;
                }

                const [hist, stats] = await Promise.all([
                    getStepsHistory(startDateStr, endDateStr),
                    getStepsStats(periodParam)
                ]);

                setHistoryData(hist);
                setStatsData(stats);
            } catch (err) {
                console.error('Failed to fetch analytics data:', err);
                setError('Could not load analytics data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period]);

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 bg-[#2a2235] hover:bg-[#a855f7]/20 rounded-xl transition-colors text-gray-300 hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Steps Analytics</h1>
                            <p className="text-gray-400">Track and optimize your daily movement</p>
                        </div>
                    </div>

                    <PeriodSelector
                        period={period}
                        onChange={setPeriod}
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Dynamic Main Content */}
                {loading && !historyData ? (
                    <div className="h-[60vh] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* KPI Cards */}
                        <QuickStatsGrid />

                        {/* Main Chart */}
                        <div className="bg-[#2a2235] rounded-2xl p-6 border border-gray-800/50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-semibold">Activity Trend</h3>
                                {statsData && statsData.averageSteps > 0 && (
                                    <div className="text-sm">
                                        <span className="text-gray-400">Average: </span>
                                        <span className="text-[#22d3ee] font-medium">{statsData.averageSteps.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <StepTrendChart
                                data={historyData?.history || []}
                                averageSteps={statsData?.averageSteps || 0}
                            />
                        </div>

                        {/* Additional Views Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            {/* Heatmap takes up 2 columns on large screens */}
                            <div className="lg:col-span-2 space-y-6">
                                <CalendarHeatmap
                                    data={historyData?.history || []}
                                    averageSteps={statsData?.averageSteps || 0}
                                />

                                {statsData && historyData && (
                                    <InsightsPanel
                                        data={historyData.history}
                                        stats={statsData}
                                    />
                                )}
                            </div>

                            {/* Achievements Column */}
                            <div className="lg:col-span-1">
                                {statsData && <AchievementsList stats={statsData} />}
                            </div>
                        </div>

                        {/* Goal Management Suggestion */}
                        {statsData && (
                            <div className="bg-gradient-to-r from-[#2a2235] to-[#a855f7]/10 rounded-2xl p-6 border border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Current Daily Goal: 10,000 steps</h3>
                                    <p className="text-sm text-gray-400">
                                        Based on your average of {statsData.averageSteps.toLocaleString()},
                                        {statsData.averageSteps < 8000
                                            ? " consider a goal of 8,000 steps for consistency."
                                            : " you're doing great! Keep it up."}
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.push('/profile')}
                                    className="px-6 py-3 bg-[#1a1625] hover:bg-[#2a2235] border border-[#a855f7]/30 text-white rounded-xl transition-all whitespace-nowrap"
                                >
                                    Settings
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

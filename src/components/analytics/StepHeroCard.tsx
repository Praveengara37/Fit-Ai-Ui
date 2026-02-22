'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { getTodaySteps } from '@/lib/analytics';
import { DailySteps } from '@/types/analytics';

interface StepHeroCardProps {
    refreshInterval?: number;
}

export default function StepHeroCard({ refreshInterval = 300000 }: StepHeroCardProps) {
    const [data, setData] = useState<DailySteps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);

    // Simple incrementing number animation could go here, but for now we just show the numbers

    const fetchTodayData = async () => {
        try {
            setLoading(true);
            setError(null);
            const steps = await getTodaySteps();
            setData(steps);
            setLastSynced(new Date());
        } catch (err) {
            console.error('Failed to fetch today steps:', err);
            setError("Could not load today's activity");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayData();

        if (refreshInterval > 0) {
            const interval = setInterval(fetchTodayData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    if (error) {
        return (
            <div className="bg-[#2a2235] rounded-2xl p-6 border border-red-500/20 flex flex-col items-center justify-center min-h-[300px] text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Failed to load</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                    onClick={fetchTodayData}
                    className="px-4 py-2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> Try Again
                </button>
            </div>
        );
    }

    if (loading && !data) {
        return (
            <div className="bg-[#2a2235] rounded-2xl p-6 min-h-[350px] flex flex-col animate-pulse">
                <div className="h-6 w-40 bg-gray-700/50 rounded mb-8"></div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="h-16 w-32 bg-gray-700/50 rounded-lg"></div>
                    <div className="h-4 w-16 bg-gray-700/50 rounded"></div>
                </div>
                <div className="mt-8 space-y-3">
                    <div className="h-2 w-full bg-gray-700/50 rounded-full"></div>
                    <div className="h-4 w-48 bg-gray-700/50 rounded"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const progressPercentage = Math.min(100, Math.round((data.steps / data.goalSteps) * 100)) || 0;

    const formattedTime = lastSynced
        ? lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div className="bg-[#2a2235] rounded-2xl p-6 sm:p-8 flex flex-col relative overflow-hidden group">
            {/* Decorative background gradient */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#a855f7]/10 rounded-full blur-3xl group-hover:bg-[#a855f7]/20 transition-all duration-700"></div>

            <div className="flex items-center justify-between mb-8 z-10">
                <div className="flex items-center gap-2">
                    <Activity className="w-6 h-6 text-[#a855f7]" />
                    <h2 className="text-xl font-bold text-white">Today&apos;s Activity</h2>
                </div>
                {loading && <RefreshCw className="w-4 h-4 text-[#a855f7] animate-spin" />}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-4">
                <div className="relative">
                    <span className="text-6xl sm:text-7xl font-bold text-white tracking-tight drop-shadow-md">
                        {data.steps.toLocaleString()}
                    </span>
                </div>
                <span className="text-xl text-gray-400 mt-2">steps</span>
            </div>

            <div className="mt-8 z-10">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-white">{progressPercentage}% to goal</span>
                    <span className="text-xs text-gray-400">Goal: {data.goalSteps.toLocaleString()}</span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-gradient-to-r from-[#a855f7] to-[#22d3ee] transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-sm text-gray-300">
                        <span className="font-semibold text-white">{data.distanceKm.toFixed(1)} km</span> walked • <span className="font-semibold text-white">{data.caloriesBurned} cal</span> burned
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="text-xs text-gray-500">
                            Synced today at {formattedTime}
                        </div>

                        <Link
                            href="/steps/analytics"
                            className="text-sm font-medium text-[#22d3ee] flex items-center gap-1 hover:text-[#a855f7] transition-colors"
                        >
                            Full Analytics <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Award, Flame, Calendar, AlertCircle } from 'lucide-react';
import { getStepsStats } from '@/lib/analytics';
import { StepsStats } from '@/types/analytics';

export default function QuickStatsGrid() {
    const [stats, setStats] = useState<StepsStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getStepsStats('week');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (error) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#2a2235] rounded-xl p-5 border border-red-500/10 flex items-center justify-center text-red-400">
                        <AlertCircle className="w-5 h-5 mr-2" /> Error loading
                    </div>
                ))}
            </div>
        );
    }

    if (loading || !stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#2a2235] rounded-xl p-5 animate-pulse min-h-[120px]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-4 w-20 bg-gray-700/50 rounded"></div>
                            <div className="h-8 w-8 bg-gray-700/50 rounded-full"></div>
                        </div>
                        <div className="h-8 w-24 bg-gray-700/50 rounded mb-2"></div>
                        <div className="h-3 w-16 bg-gray-700/50 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    const comparison = stats.comparisonPercent || 0;
    const isUp = comparison >= 0;

    const cards = [
        {
            title: 'This Week',
            value: stats.totalSteps.toLocaleString(),
            subtitle: 'steps',
            icon: Activity,
            trend: {
                value: `${Math.abs(comparison)}%`,
                isPositive: isUp,
            },
            iconColor: 'text-[#a855f7]',
            iconBg: 'bg-[#a855f7]/10'
        },
        {
            title: 'Daily Avg',
            value: stats.averageSteps.toLocaleString(),
            subtitle: 'steps / day',
            icon: Calendar,
            trend: {
                value: 'vs last week',
                isPositive: isUp,
            },
            iconColor: 'text-[#22d3ee]',
            iconBg: 'bg-[#22d3ee]/10'
        },
        {
            title: 'Best Day',
            value: stats.bestDay ? stats.bestDay.steps.toLocaleString() : '0',
            subtitle: stats.bestDay ? new Date(stats.bestDay.date).toLocaleDateString('en-US', { weekday: 'long' }) : 'No data',
            icon: Award,
            trend: null,
            iconColor: 'text-yellow-400',
            iconBg: 'bg-yellow-400/10'
        },
        {
            title: 'Current Streak',
            value: `${stats.currentStreak} Days`,
            subtitle: stats.currentStreak > 0 ? 'Active' : 'No streak',
            icon: Flame,
            trend: null,
            iconColor: 'text-orange-500',
            iconBg: 'bg-orange-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div key={index} className="bg-[#2a2235] rounded-xl p-5 hover:bg-[#2a2235]/80 transition-colors border border-transparent hover:border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 font-medium text-sm">{card.title}</h3>
                        <div className={`p-2 rounded-lg ${card.iconBg}`}>
                            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                        </div>
                    </div>

                    <div className="mb-2">
                        <span className="text-2xl font-bold text-white tracking-tight">{card.value}</span>
                        <span className="text-gray-500 text-sm ml-1">{card.subtitle}</span>
                    </div>

                    {card.trend && (
                        <div className={`flex items-center text-xs font-medium ${card.trend.isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                            {card.trend.isPositive ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {card.trend.value}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

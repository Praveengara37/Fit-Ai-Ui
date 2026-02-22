'use client';

import { Lightbulb, TrendingUp, AlertTriangle, Calendar, Award } from 'lucide-react';
import { DailySteps, StepsStats } from '@/types/analytics';

interface InsightsPanelProps {
    data: DailySteps[];
    stats: StepsStats;
}

export default function InsightsPanel({ data, stats }: InsightsPanelProps) {

    const generateInsights = () => {
        const insights = [];

        if (!data || data.length === 0 || !stats) {
            return [{
                icon: Lightbulb,
                color: 'text-gray-400',
                text: 'Not enough data available to generate insights.',
                bg: 'bg-gray-800'
            }];
        }

        // Insight 1: Comparison vs previous period
        if (stats.comparisonPercent) {
            if (stats.comparisonPercent > 0) {
                insights.push({
                    icon: TrendingUp,
                    color: 'text-[#22c55e]',
                    bg: 'bg-[#22c55e]/10',
                    text: `You're up ${stats.comparisonPercent}% compared to the previous period. Great job staying active!`
                });
            } else if (stats.comparisonPercent < 0) {
                insights.push({
                    icon: AlertTriangle,
                    color: 'text-[#f59e0b]',
                    bg: 'bg-[#f59e0b]/10',
                    text: `Activity is down ${Math.abs(stats.comparisonPercent)}% from the previous period. Try to add a 15-minute evening walk.`
                });
            }
        }

        // Insight 2: Most active day
        if (data.length > 3) {
            const dayOfWeekCounts: Record<string, { total: number, count: number }> = {};

            data.forEach(d => {
                const day = new Date(d.date).toLocaleDateString('en-US', { weekday: 'long' });
                if (!dayOfWeekCounts[day]) {
                    dayOfWeekCounts[day] = { total: 0, count: 0 };
                }
                dayOfWeekCounts[day].total += d.steps;
                dayOfWeekCounts[day].count += 1;
            });

            let mostActiveDay = '';
            let highestAvg = 0;

            Object.keys(dayOfWeekCounts).forEach(day => {
                const avg = dayOfWeekCounts[day].total / dayOfWeekCounts[day].count;
                if (avg > highestAvg) {
                    highestAvg = avg;
                    mostActiveDay = day;
                }
            });

            if (mostActiveDay) {
                insights.push({
                    icon: Calendar,
                    color: 'text-[#22d3ee]',
                    bg: 'bg-[#22d3ee]/10',
                    text: `Your most active days are typically ${mostActiveDay}s (avg ${Math.round(highestAvg).toLocaleString()} steps).`
                });
            }
        }

        // Insight 3: Consistency
        const hitGoalDays = stats.goalReachedDays || 0;
        const totalDays = data.length;

        if (totalDays > 0) {
            const consistencyRate = hitGoalDays / totalDays;
            if (consistencyRate >= 0.8) {
                insights.push({
                    icon: Award,
                    color: 'text-[#a855f7]',
                    bg: 'bg-[#a855f7]/10',
                    text: `Incredible consistency! You hit your goal on ${hitGoalDays} out of ${totalDays} days in this period.`
                });
            } else if (consistencyRate < 0.4 && totalDays > 3) {
                insights.push({
                    icon: Lightbulb,
                    color: 'text-[#22d3ee]',
                    bg: 'bg-[#22d3ee]/10',
                    text: `Consistency tip: You only reached your goal ${hitGoalDays} days this period. Consider lowering your goal temporarily to build a habit.`
                });
            }
        }

        return insights.length > 0 ? insights : [{
            icon: Lightbulb,
            color: 'text-[#a855f7]',
            bg: 'bg-[#a855f7]/10',
            text: 'Keep wearing your device and syncing daily to unlock more personalized insights.'
        }];
    };

    const insights = generateInsights();

    return (
        <div className="bg-[#2a2235] rounded-2xl p-6 h-full border border-gray-800/50 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee]/5 rounded-bl-[100px] pointer-events-none"></div>

            <h3 className="text-white font-semibold mb-6 flex items-center gap-2 relative z-10">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                AI Observations
            </h3>

            <div className="space-y-4 relative z-10">
                {insights.map((insight, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-[#1a1625] border border-gray-800 transition-all hover:border-gray-700">
                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${insight.bg}`}>
                            <insight.icon className={`w-4 h-4 ${insight.color}`} />
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {insight.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { Flame, Beef, Wheat, Droplets } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import MacroDisplay from '@/components/ui/MacroDisplay';

interface NutritionSummaryProps {
    totals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    goals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    remaining?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    compact?: boolean;
}

export default function NutritionSummary({
    totals,
    goals,
    remaining,
    compact = false,
}: NutritionSummaryProps) {
    const caloriePercent = goals.calories > 0
        ? Math.round((totals.calories / goals.calories) * 100)
        : 0;

    return (
        <div className={`bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl ${compact ? 'p-5' : 'p-6'}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-[#a855f7]" />
                <h3 className="text-white font-semibold">
                    {compact ? "Today's Nutrition" : 'Daily Summary'}
                </h3>
            </div>

            {/* Calorie Progress */}
            <div className="mb-5">
                <div className="flex items-baseline justify-between mb-2">
                    <div>
                        <span className="text-3xl font-bold text-white">
                            {totals.calories.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                            / {goals.calories.toLocaleString()} cal
                        </span>
                    </div>
                    <span className={`text-sm font-semibold ${caloriePercent > 100 ? 'text-red-400' : 'text-[#22d3ee]'
                        }`}>
                        {caloriePercent}%
                    </span>
                </div>
                <ProgressBar
                    current={totals.calories}
                    max={goals.calories}
                    size="lg"
                />
            </div>

            {/* Macros */}
            <div className="space-y-3">
                <MacroDisplay
                    label="Protein"
                    current={totals.protein}
                    max={goals.protein}
                    color="bg-[#a855f7]"
                    icon={<Beef className="w-4 h-4 text-[#a855f7]" />}
                />
                <MacroDisplay
                    label="Carbs"
                    current={totals.carbs}
                    max={goals.carbs}
                    color="bg-[#22d3ee]"
                    icon={<Wheat className="w-4 h-4 text-[#22d3ee]" />}
                />
                <MacroDisplay
                    label="Fat"
                    current={totals.fat}
                    max={goals.fat}
                    color="bg-[#f59e0b]"
                    icon={<Droplets className="w-4 h-4 text-[#f59e0b]" />}
                />
            </div>

            {/* Remaining */}
            {remaining && !compact && (
                <div className="mt-4 pt-4 border-t border-gray-800/30">
                    <p className="text-sm text-gray-400">
                        Remaining:{' '}
                        <span className={`font-semibold ${remaining.calories >= 0 ? 'text-[#22d3ee]' : 'text-red-400'}`}>
                            {remaining.calories >= 0 ? remaining.calories.toLocaleString() : `${Math.abs(remaining.calories).toLocaleString()} over`}
                        </span>
                        {' '}calories
                    </p>
                </div>
            )}
        </div>
    );
}

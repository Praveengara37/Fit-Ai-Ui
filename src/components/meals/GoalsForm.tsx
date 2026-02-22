'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getNutritionGoals, setNutritionGoals } from '@/lib/meals';
import { NutritionGoals } from '@/types';

export default function GoalsForm() {
    const [goals, setGoals] = useState<NutritionGoals>({
        dailyCalories: 2000,
        dailyProtein: 150,
        dailyCarbs: 250,
        dailyFat: 65,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const data = await getNutritionGoals();
            if (data) {
                setGoals({
                    dailyCalories: data.dailyCalories || 2000,
                    dailyProtein: data.dailyProtein || 150,
                    dailyCarbs: data.dailyCarbs || 250,
                    dailyFat: data.dailyFat || 65,
                });
            }
        } catch {
            // Use defaults - no toast here as it might just mean goals haven't been set yet
        } finally {
            setLoading(false);
        }
    };

    const calculatedCalories = (goals.dailyProtein * 4) + (goals.dailyCarbs * 4) + (goals.dailyFat * 9);
    const difference = Math.abs(calculatedCalories - goals.dailyCalories);
    const tolerance = goals.dailyCalories * 0.1;
    const isMismatch = difference > tolerance;

    const proteinPercent = goals.dailyCalories > 0 ? Math.round(((goals.dailyProtein * 4) / goals.dailyCalories) * 100) : 0;
    const carbsPercent = goals.dailyCalories > 0 ? Math.round(((goals.dailyCarbs * 4) / goals.dailyCalories) * 100) : 0;
    const fatPercent = goals.dailyCalories > 0 ? Math.round(((goals.dailyFat * 9) / goals.dailyCalories) * 100) : 0;

    const handleUseRecommended = () => {
        setGoals({
            dailyCalories: 2200,
            dailyProtein: 165,
            dailyCarbs: 275,
            dailyFat: 73,
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setNutritionGoals(goals);
            toast.success('Nutrition goals saved!');
        } catch {
            toast.error('Failed to save goals. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof NutritionGoals, value: string) => {
        const num = parseInt(value) || 0;
        setGoals((prev) => ({ ...prev, [field]: num }));
    };

    if (loading) {
        return (
            <div className="bg-[#2a2235] rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Calorie Goal */}
            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-1">Daily Calorie Goal</h3>
                <p className="text-gray-500 text-sm mb-4">Set your target daily calorie intake</p>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        value={goals.dailyCalories}
                        onChange={(e) => handleChange('dailyCalories', e.target.value)}
                        className="w-32 px-4 py-3 bg-[#1a1625] border border-[rgba(168,85,247,0.25)] rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-[#a855f7] transition-colors"
                        min={500}
                        max={10000}
                    />
                    <span className="text-gray-400">calories</span>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                    Recommended: 2,200 cal (based on moderate activity)
                </p>
            </div>

            {/* Macro Goals */}
            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-1">Macronutrient Goals</h3>
                <p className="text-gray-500 text-sm mb-5">Set daily targets for each macronutrient</p>

                <div className="space-y-5">
                    {/* Protein */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-[#a855f7]">Protein</div>
                        <input
                            type="number"
                            value={goals.dailyProtein}
                            onChange={(e) => handleChange('dailyProtein', e.target.value)}
                            className="w-24 px-3 py-2 bg-[#1a1625] border border-[rgba(168,85,247,0.25)] rounded-lg text-white font-semibold focus:outline-none focus:border-[#a855f7] transition-colors"
                            min={0}
                        />
                        <span className="text-gray-400 text-sm">grams</span>
                        <span className="text-xs text-gray-600 ml-auto">
                            {proteinPercent}% of calories ({goals.dailyProtein * 4} cal)
                        </span>
                    </div>

                    {/* Carbs */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-[#22d3ee]">Carbs</div>
                        <input
                            type="number"
                            value={goals.dailyCarbs}
                            onChange={(e) => handleChange('dailyCarbs', e.target.value)}
                            className="w-24 px-3 py-2 bg-[#1a1625] border border-[rgba(168,85,247,0.25)] rounded-lg text-white font-semibold focus:outline-none focus:border-[#a855f7] transition-colors"
                            min={0}
                        />
                        <span className="text-gray-400 text-sm">grams</span>
                        <span className="text-xs text-gray-600 ml-auto">
                            {carbsPercent}% of calories ({goals.dailyCarbs * 4} cal)
                        </span>
                    </div>

                    {/* Fat */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-[#f59e0b]">Fat</div>
                        <input
                            type="number"
                            value={goals.dailyFat}
                            onChange={(e) => handleChange('dailyFat', e.target.value)}
                            className="w-24 px-3 py-2 bg-[#1a1625] border border-[rgba(168,85,247,0.25)] rounded-lg text-white font-semibold focus:outline-none focus:border-[#a855f7] transition-colors"
                            min={0}
                        />
                        <span className="text-gray-400 text-sm">grams</span>
                        <span className="text-xs text-gray-600 ml-auto">
                            {fatPercent}% of calories ({goals.dailyFat * 9} cal)
                        </span>
                    </div>
                </div>

                {/* Calorie Check */}
                <div className={`mt-5 p-3 rounded-xl border text-sm flex items-center gap-2 ${isMismatch
                        ? 'bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]'
                        : 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]'
                    }`}>
                    {isMismatch ? (
                        <>
                            <AlertTriangle size={16} />
                            Macros ({calculatedCalories} cal) don&apos;t match calorie goal ({goals.dailyCalories} cal)
                        </>
                    ) : (
                        <>
                            <CheckCircle size={16} />
                            Total from macros: {calculatedCalories} calories ✓
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleUseRecommended}
                    className="flex items-center gap-2 px-5 py-3 bg-[#2a2235] border border-[rgba(168,85,247,0.25)] text-gray-300 hover:text-white hover:border-[rgba(168,85,247,0.4)] rounded-xl transition-all"
                >
                    <RefreshCw size={16} />
                    Use Recommended
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#a855f7]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Goals
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, Sparkles, Flame, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getRecommendations } from '@/lib/profile';
import { setNutritionGoals } from '@/lib/meals';
import type { Recommendations } from '@/types';

export default function RecommendationsPage() {
    const router = useRouter();
    const [data, setData] = useState<Recommendations | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getRecommendations();
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Failed to load recommendations');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyGoals = async () => {
        if (!data) return;

        setApplying(true);
        try {
            await setNutritionGoals({
                dailyCalories: data.recommendedCalories,
                dailyProtein: data.macros.protein,
                dailyCarbs: data.macros.carbs,
                dailyFat: data.macros.fat,
            });
            setApplied(true);
            toast.success('Recommended goals applied!');
        } catch {
            toast.error('Failed to apply goals');
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/settings')}
                        className="p-2 bg-[#2a2235] hover:bg-[#a855f7]/20 rounded-xl transition-colors text-gray-300 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Recommendations</h1>
                        <p className="text-gray-400 text-sm">Personalized nutrition guidance</p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Couldn&apos;t load recommendations</h3>
                        <p className="text-gray-500 text-sm mb-6">{error}</p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={fetchRecommendations}
                                className="px-5 py-2.5 bg-[#1a1625] border border-[rgba(168,85,247,0.25)] text-gray-300 hover:text-white rounded-xl text-sm transition-all"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/profile/edit')}
                                className="px-5 py-2.5 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                            >
                                Complete Profile
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && data && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame className="w-4 h-4 text-[#f59e0b]" />
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">BMR</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{Math.round(data.bmr).toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-1">calories/day at rest</p>
                            </div>
                            <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-[#22d3ee]" />
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">TDEE</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{Math.round(data.tdee).toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-1">total daily expenditure</p>
                            </div>
                        </div>

                        {/* Recommendation Card */}
                        <div className="bg-gradient-to-br from-[#2a2235] to-[#a855f7]/10 border border-[rgba(168,85,247,0.25)] rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-[#a855f7]" />
                                <h3 className="text-white font-semibold">Recommended Daily Intake</h3>
                            </div>

                            <div className="text-center mb-5">
                                <p className="text-5xl font-bold text-white mb-1">
                                    {Math.round(data.recommendedCalories).toLocaleString()}
                                </p>
                                <p className="text-gray-400 text-sm">calories per day</p>
                            </div>

                            {data.reason && (
                                <p className="text-gray-400 text-sm leading-relaxed bg-[#1a1625]/50 rounded-xl p-4 mb-5">
                                    {data.reason}
                                </p>
                            )}

                            {/* Macro Breakdown */}
                            <div>
                                <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-3">Recommended Macros</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#a855f7]" />
                                            <span className="text-sm text-gray-300">Protein</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-white font-semibold">{Math.round(data.macros.protein)}g</span>
                                            <span className="text-gray-500 text-sm ml-2">({data.macroRatios.protein})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#22d3ee]" />
                                            <span className="text-sm text-gray-300">Carbs</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-white font-semibold">{Math.round(data.macros.carbs)}g</span>
                                            <span className="text-gray-500 text-sm ml-2">({data.macroRatios.carbs})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                                            <span className="text-sm text-gray-300">Fat</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-white font-semibold">{Math.round(data.macros.fat)}g</span>
                                            <span className="text-gray-500 text-sm ml-2">({data.macroRatios.fat})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <button
                            onClick={handleApplyGoals}
                            disabled={applying || applied}
                            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 ${applied
                                    ? 'bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e] cursor-default'
                                    : 'bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-[#a855f7]/20'
                                } disabled:opacity-70 disabled:hover:scale-100`}
                        >
                            {applied ? (
                                <>
                                    <CheckCircle size={18} />
                                    Goals Applied!
                                </>
                            ) : applying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Applying...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Apply These Goals
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

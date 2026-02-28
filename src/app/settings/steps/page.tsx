'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, Save, Footprints, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getProfile, updateProfile } from '@/lib/profile';
import { verifyAuth } from '@/lib/auth';

const PRESETS = [5000, 7500, 10000, 12500, 15000];

const ACTIVITY_GUIDE = [
    { level: 'Sedentary', range: '5,000 – 7,000 steps', color: '#9ca3af' },
    { level: 'Lightly Active', range: '7,500 – 10,000 steps', color: '#22d3ee' },
    { level: 'Active', range: '10,000 – 12,500 steps', color: '#22c55e' },
    { level: 'Very Active', range: '12,500 – 15,000+ steps', color: '#f59e0b' },
];

export default function StepGoalsPage() {
    const router = useRouter();
    const [goal, setGoal] = useState(10000);
    const [originalGoal, setOriginalGoal] = useState(10000);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCurrentGoal();
    }, []);

    const loadCurrentGoal = async () => {
        try {
            const { authenticated } = await verifyAuth();
            if (!authenticated) {
                router.push('/login');
                return;
            }

            const profile = await getProfile();
            const currentGoal = profile.profile?.dailyStepGoal || 10000;
            setGoal(currentGoal);
            setOriginalGoal(currentGoal);
        } catch {
            // Use default
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (goal === originalGoal) {
            toast.info('No changes to save');
            return;
        }

        setSaving(true);
        try {
            await updateProfile({ dailyStepGoal: goal } as any);
            setOriginalGoal(goal);
            toast.success('Step goal updated!');
        } catch {
            toast.error('Failed to update step goal');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

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
                        <h1 className="text-3xl font-bold text-white">Daily Step Goal</h1>
                        <p className="text-gray-400 text-sm">Customize your daily step target</p>
                    </div>
                </div>

                {/* Goal Card */}
                <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-6 space-y-6">
                    {/* Current Value */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 mb-2">
                            <Footprints className="w-8 h-8 text-[#22c55e]" />
                            <span className="text-5xl font-bold text-white">{goal.toLocaleString()}</span>
                        </div>
                        <p className="text-gray-500 text-sm">steps per day</p>
                    </div>

                    {/* Slider */}
                    <div className="space-y-2">
                        <input
                            type="range"
                            min={1000}
                            max={50000}
                            step={500}
                            value={goal}
                            onChange={(e) => setGoal(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer
                                       bg-gradient-to-r from-[#a855f7]/30 to-[#22d3ee]/30
                                       [&::-webkit-slider-thumb]:appearance-none
                                       [&::-webkit-slider-thumb]:w-6
                                       [&::-webkit-slider-thumb]:h-6
                                       [&::-webkit-slider-thumb]:rounded-full
                                       [&::-webkit-slider-thumb]:bg-gradient-to-r
                                       [&::-webkit-slider-thumb]:from-[#a855f7]
                                       [&::-webkit-slider-thumb]:to-[#22d3ee]
                                       [&::-webkit-slider-thumb]:shadow-lg
                                       [&::-webkit-slider-thumb]:shadow-[#a855f7]/30
                                       [&::-webkit-slider-thumb]:cursor-pointer
                                       [&::-webkit-slider-thumb]:transition-transform
                                       [&::-webkit-slider-thumb]:hover:scale-110"
                        />
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>1,000</span>
                            <span>25,000</span>
                            <span>50,000</span>
                        </div>
                    </div>

                    {/* Preset Buttons */}
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-3">Quick Presets</p>
                        <div className="flex flex-wrap gap-2">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => setGoal(preset)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${goal === preset
                                            ? 'bg-[#a855f7] text-white'
                                            : 'bg-[#1a1625] border border-[rgba(168,85,247,0.2)] text-gray-400 hover:text-white hover:border-[rgba(168,85,247,0.4)]'
                                        }`}
                                >
                                    {preset.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Level Guide */}
                <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="w-4 h-4 text-[#22d3ee]" />
                        <h3 className="text-white font-semibold text-sm">Step Goals by Activity Level</h3>
                    </div>
                    <div className="space-y-3">
                        {ACTIVITY_GUIDE.map((item) => (
                            <div key={item.level} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-gray-300">{item.level}</span>
                                </div>
                                <span className="text-sm text-gray-500">{item.range}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving || goal === originalGoal}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#a855f7]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Goal
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

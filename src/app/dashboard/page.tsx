'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, User as UserIcon, Target, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { verifyAuth, logout } from '@/lib/auth';
import { getProfile } from '@/lib/profile';
import { getTodayMeals } from '@/lib/meals';
import { UserWithProfile, DailyMeals } from '@/types';
import Logo from '@/components/Logo';
import StepHeroCard from '@/components/analytics/StepHeroCard';
import QuickStatsGrid from '@/components/analytics/QuickStatsGrid';
import NutritionSummary from '@/components/meals/NutritionSummary';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserWithProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mealsData, setMealsData] = useState<DailyMeals | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { authenticated } = await verifyAuth();

            if (!authenticated) {
                router.push('/login');
                return;
            }

            // Fetch user profile
            const profileData = await getProfile();
            setUser(profileData);

            // Fetch today's meals for nutrition widget
            try {
                const meals = await getTodayMeals();
                setMealsData(meals);
            } catch {
                // Silently fail - meals widget will show empty state
            }
        } catch (error) {
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
            setIsLoggingOut(false);
        }
    };

    const formatGoal = (goal: string): string => {
        return goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary-purple mx-auto mb-4" size={48} />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <Logo className="glow-purple" width={180} height={68} />
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-6 py-3 rounded-xl 
                     font-semibold transition-all duration-300 hover:glow-cyan hover:scale-105 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Logging out...
                            </>
                        ) : (
                            <>
                                <LogOut size={18} />
                                Logout
                            </>
                        )}
                    </button>
                </div>

                {/* Welcome Section */}
                <div className="glass-card rounded-3xl p-12 text-center mb-8 animate-in fade-in slide-in-from-bottom duration-700">
                    <h1 className="font-heading text-5xl font-black mb-4">
                        <span className="gradient-text">Welcome Back!</span>
                    </h1>
                    <p className="text-2xl text-gray-100 mb-2">
                        {user?.fullName}
                    </p>
                    <p className="text-gray-400 mb-8">
                        {user?.email}
                    </p>

                    {/* Profile Summary or Setup CTA */}
                    {user?.profile ? (
                        <div className="mt-8">
                            <div className="h-px bg-gradient-to-r from-transparent via-primary-purple to-transparent mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass-card rounded-xl p-6">
                                    <Target className="text-primary-purple mx-auto mb-3" size={32} />
                                    <h3 className="font-heading text-lg font-bold text-gray-100 mb-1">Fitness Goal</h3>
                                    <p className="text-primary-cyan font-semibold">{formatGoal(user.profile.fitnessGoal)}</p>
                                </div>
                                <div className="glass-card rounded-xl p-6">
                                    <TrendingUp className="text-primary-cyan mx-auto mb-3" size={32} />
                                    <h3 className="font-heading text-lg font-bold text-gray-100 mb-1">Current Weight</h3>
                                    <p className="text-primary-purple font-semibold">{user.profile.currentWeightKg} kg</p>
                                </div>
                                <div className="glass-card rounded-xl p-6">
                                    <UserIcon className="text-primary-purple mx-auto mb-3" size={32} />
                                    <h3 className="font-heading text-lg font-bold text-gray-100 mb-1">Activity Level</h3>
                                    <p className="text-primary-cyan font-semibold">{formatGoal(user.profile.activityLevel)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8">
                            <div className="h-px bg-gradient-to-r from-transparent via-primary-purple to-transparent mb-8" />
                            <p className="text-gray-400 mb-6">Complete your profile to get personalized fitness recommendations</p>
                            <button
                                onClick={() => router.push('/profile/setup')}
                                className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-8 py-3 rounded-xl 
                                         font-semibold transition-all duration-300 hover:glow-cyan hover:scale-105"
                            >
                                Complete Profile Setup
                            </button>
                        </div>
                    )}
                </div>

                {/* Analytics Dashboard Overview */}
                {user?.profile && (
                    <div className="mb-12 space-y-6 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
                        <StepHeroCard />
                        <QuickStatsGrid />

                        {/* Nutrition Widget */}
                        <div className="relative">
                            {mealsData ? (
                                <div>
                                    <NutritionSummary
                                        totals={mealsData.totals}
                                        goals={mealsData.goals}
                                        compact
                                    />
                                    <div className="flex items-center gap-3 mt-3">
                                        <button
                                            onClick={() => router.push('/meals/log')}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                                        >
                                            <Plus size={16} /> Log Meal
                                        </button>
                                        <button
                                            onClick={() => router.push('/meals')}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-[#2a2235] border border-[rgba(168,85,247,0.25)] text-gray-300 hover:text-white rounded-xl text-sm transition-all"
                                        >
                                            View Details <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-6 text-center">
                                    <p className="text-gray-500 text-sm mb-3">No meals logged today</p>
                                    <button
                                        onClick={() => router.push('/meals/log')}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                                    >
                                        <Plus size={16} /> Log Your First Meal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Profile Card */}
                    <button
                        onClick={() => router.push('/profile')}
                        className="glass-card rounded-2xl p-6 hover:border-primary-cyan transition-all duration-300 hover:scale-105 text-left"
                    >
                        <div className="text-4xl mb-4">👤</div>
                        <h3 className="font-heading text-xl font-bold gradient-text mb-2">Profile</h3>
                        <p className="text-sm text-gray-400">View and edit your profile</p>
                    </button>

                    {/* Workouts Card */}
                    <div className="glass-card rounded-2xl p-6 opacity-60 cursor-not-allowed text-left">
                        <div className="text-4xl mb-4">🏋️</div>
                        <h3 className="font-heading text-xl font-bold text-gray-100 mb-2">Workouts</h3>
                        <p className="text-sm text-gray-400">Coming soon</p>
                    </div>

                    {/* Nutrition Card */}
                    <button
                        onClick={() => router.push('/meals')}
                        className="glass-card rounded-2xl p-6 hover:border-primary-cyan transition-all duration-300 hover:scale-105 text-left"
                    >
                        <div className="text-4xl mb-4">🥗</div>
                        <h3 className="font-heading text-xl font-bold gradient-text mb-2">Nutrition</h3>
                        <p className="text-sm text-gray-400">Track meals & macros</p>
                    </button>

                    {/* Settings Card */}
                    <button
                        onClick={() => router.push('/settings')}
                        className="glass-card rounded-2xl p-6 hover:border-primary-cyan transition-all duration-300 hover:scale-105 text-left"
                    >
                        <div className="text-4xl mb-4">⚙️</div>
                        <h3 className="font-heading text-xl font-bold gradient-text mb-2">Settings</h3>
                        <p className="text-sm text-gray-400">Goals &amp; preferences</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

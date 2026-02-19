'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, User as UserIcon, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { setupProfile } from '@/lib/profile';
import { verifyAuth } from '@/lib/auth';
import Logo from '@/components/Logo';
import type { Gender, FitnessGoal, ActivityLevel, DietaryPreference } from '@/types';

export default function ProfileSetupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Form state
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<Gender>('prefer_not_to_say');
    const [heightCm, setHeightCm] = useState('');
    const [currentWeightKg, setCurrentWeightKg] = useState('');
    const [targetWeightKg, setTargetWeightKg] = useState('');
    const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('get_fit');
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
    const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('none');

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
        } catch (error) {
            router.push('/login');
        } finally {
            setIsCheckingAuth(false);
        }
    };

    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!dateOfBirth || !heightCm || !currentWeightKg) {
            toast.error('Please fill in all required fields');
            return;
        }

        const age = calculateAge(dateOfBirth);
        if (age < 13) {
            toast.error('You must be at least 13 years old');
            return;
        }

        const height = parseFloat(heightCm);
        const currentWeight = parseFloat(currentWeightKg);
        const targetWeight = targetWeightKg ? parseFloat(targetWeightKg) : null;

        if (height < 50 || height > 300) {
            toast.error('Please enter a valid height (50-300 cm)');
            return;
        }

        if (currentWeight < 20 || currentWeight > 500) {
            toast.error('Please enter a valid weight (20-500 kg)');
            return;
        }

        if (targetWeight && (targetWeight < 20 || targetWeight > 500)) {
            toast.error('Please enter a valid target weight (20-500 kg)');
            return;
        }

        setIsLoading(true);

        try {
            await setupProfile({
                dateOfBirth,
                gender,
                heightCm: height,
                currentWeightKg: currentWeight,
                targetWeightKg: targetWeight,
                fitnessGoal,
                activityLevel,
                dietaryPreference,
            });

            toast.success('Profile setup complete! ✓');

            setTimeout(() => {
                router.push('/profile');
            }, 500);
        } catch (error: any) {
            toast.error(error.message || 'Profile setup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) {
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
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="flex justify-center mb-8 animate-in fade-in duration-500">
                    <Logo className="glow-purple" width={200} height={75} />
                </div>

                <div className="glass-card rounded-3xl p-8 animate-in slide-in-from-bottom duration-700">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#a855f7] to-[#22d3ee] mb-4">
                            <UserIcon size={32} className="text-white" />
                        </div>
                        <h1 className="font-heading text-4xl font-black mb-2">
                            <span className="gradient-text">Complete Your Profile</span>
                        </h1>
                        <p className="text-gray-400">Help us personalize your fitness journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-100">
                                    Date of Birth <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    disabled={isLoading}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="gender" className="block text-sm font-semibold text-gray-100">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as Gender)}
                                    disabled={isLoading}
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="heightCm" className="block text-sm font-semibold text-gray-100">
                                    Height (cm) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="heightCm"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="170"
                                    min="50"
                                    max="300"
                                    step="0.1"
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 placeholder:text-gray-400
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="currentWeightKg" className="block text-sm font-semibold text-gray-100">
                                    Current Weight (kg) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="currentWeightKg"
                                    value={currentWeightKg}
                                    onChange={(e) => setCurrentWeightKg(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="70"
                                    min="20"
                                    max="500"
                                    step="0.1"
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 placeholder:text-gray-400
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="targetWeightKg" className="block text-sm font-semibold text-gray-100">
                                    Target Weight (kg) <span className="text-gray-400 text-xs">(Optional)</span>
                                </label>
                                <input
                                    type="number"
                                    id="targetWeightKg"
                                    value={targetWeightKg}
                                    onChange={(e) => setTargetWeightKg(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="65"
                                    min="20"
                                    max="500"
                                    step="0.1"
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 placeholder:text-gray-400
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="fitnessGoal" className="block text-sm font-semibold text-gray-100">
                                    Fitness Goal
                                </label>
                                <select
                                    id="fitnessGoal"
                                    value={fitnessGoal}
                                    onChange={(e) => setFitnessGoal(e.target.value as FitnessGoal)}
                                    disabled={isLoading}
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="lose_weight">Lose Weight</option>
                                    <option value="gain_muscle">Gain Muscle</option>
                                    <option value="maintain">Maintain Weight</option>
                                    <option value="get_fit">Get Fit</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="activityLevel" className="block text-sm font-semibold text-gray-100">
                                    Activity Level
                                </label>
                                <select
                                    id="activityLevel"
                                    value={activityLevel}
                                    onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                                    disabled={isLoading}
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="sedentary">Sedentary (Little or no exercise)</option>
                                    <option value="light">Light (1-3 days/week)</option>
                                    <option value="moderate">Moderate (3-5 days/week)</option>
                                    <option value="active">Active (6-7 days/week)</option>
                                    <option value="very_active">Very Active (Athlete)</option>
                                </select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="dietaryPreference" className="block text-sm font-semibold text-gray-100">
                                    Dietary Preference
                                </label>
                                <select
                                    id="dietaryPreference"
                                    value={dietaryPreference}
                                    onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
                                    disabled={isLoading}
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="none">No Preference</option>
                                    <option value="vegetarian">Vegetarian</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="keto">Keto</option>
                                    <option value="paleo">Paleo</option>
                                    <option value="halal">Halal</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-6 py-3 rounded-xl 
                                     font-semibold transition-all duration-300 hover:glow-cyan hover:scale-105 
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                                     flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Setting up profile...
                                </>
                            ) : (
                                'Complete Setup'
                            )}
                        </button>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard')}
                                className="text-[#22d3ee] hover:underline text-sm inline-flex items-center gap-1 transition-colors"
                            >
                                Skip for now
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

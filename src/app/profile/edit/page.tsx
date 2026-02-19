'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getProfile, updateProfile } from '@/lib/profile';
import { verifyAuth } from '@/lib/auth';
import Logo from '@/components/Logo';
import type { Gender, FitnessGoal, ActivityLevel, DietaryPreference, ProfileSetupRequest } from '@/types';

export default function ProfileEditPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<Gender>('prefer_not_to_say');
    const [heightCm, setHeightCm] = useState('');
    const [currentWeightKg, setCurrentWeightKg] = useState('');
    const [targetWeightKg, setTargetWeightKg] = useState('');
    const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('get_fit');
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
    const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('none');

    // Store initial values to compute diff
    const initialValues = useRef<ProfileSetupRequest | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { authenticated } = await verifyAuth();
            if (!authenticated) {
                router.push('/login');
                return;
            }

            const profileData = await getProfile();

            if (!profileData.profile) {
                toast.info('Please complete your profile setup first');
                router.push('/profile/setup');
                return;
            }

            const profile = profileData.profile;
            const dob = profile.dateOfBirth.split('T')[0];
            setDateOfBirth(dob);
            setGender(profile.gender);
            setHeightCm(profile.heightCm.toString());
            setCurrentWeightKg(profile.currentWeightKg.toString());
            setTargetWeightKg(profile.targetWeightKg?.toString() || '');
            setFitnessGoal(profile.fitnessGoal);
            setActivityLevel(profile.activityLevel);
            setDietaryPreference(profile.dietaryPreference);

            // Save initial values for diff
            initialValues.current = {
                dateOfBirth: dob,
                gender: profile.gender,
                heightCm: profile.heightCm,
                currentWeightKg: profile.currentWeightKg,
                targetWeightKg: profile.targetWeightKg,
                fitnessGoal: profile.fitnessGoal,
                activityLevel: profile.activityLevel,
                dietaryPreference: profile.dietaryPreference,
            };
        } catch (error: any) {
            toast.error(error.message || 'Failed to load profile');
            router.push('/login');
        } finally {
            setIsLoadingProfile(false);
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

        // Compute changed fields only
        const currentValues: ProfileSetupRequest = {
            dateOfBirth,
            gender,
            heightCm: height,
            currentWeightKg: currentWeight,
            targetWeightKg: targetWeight,
            fitnessGoal,
            activityLevel,
            dietaryPreference,
        };

        const changedFields: Partial<ProfileSetupRequest> = {};
        if (initialValues.current) {
            const init = initialValues.current;
            if (currentValues.dateOfBirth !== init.dateOfBirth) changedFields.dateOfBirth = currentValues.dateOfBirth;
            if (currentValues.gender !== init.gender) changedFields.gender = currentValues.gender;
            if (currentValues.heightCm !== init.heightCm) changedFields.heightCm = currentValues.heightCm;
            if (currentValues.currentWeightKg !== init.currentWeightKg) changedFields.currentWeightKg = currentValues.currentWeightKg;
            if (currentValues.targetWeightKg !== init.targetWeightKg) changedFields.targetWeightKg = currentValues.targetWeightKg;
            if (currentValues.fitnessGoal !== init.fitnessGoal) changedFields.fitnessGoal = currentValues.fitnessGoal;
            if (currentValues.activityLevel !== init.activityLevel) changedFields.activityLevel = currentValues.activityLevel;
            if (currentValues.dietaryPreference !== init.dietaryPreference) changedFields.dietaryPreference = currentValues.dietaryPreference;
        }

        if (Object.keys(changedFields).length === 0) {
            toast.info('No changes detected');
            router.push('/profile');
            return;
        }

        setIsLoading(true);

        try {
            await updateProfile(changedFields);

            toast.success('Profile updated successfully!');

            setTimeout(() => {
                router.push('/profile');
            }, 500);
        } catch (error: any) {
            toast.error(error.message || 'Profile update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary-purple mx-auto mb-4" size={48} />
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-8">
                    <Logo className="glow-purple" width={180} height={68} />
                    <button
                        onClick={() => router.push('/profile')}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary-cyan transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Cancel
                    </button>
                </div>

                <div className="glass-card rounded-3xl p-8 animate-in slide-in-from-bottom duration-700">
                    <div className="text-center mb-8">
                        <h1 className="font-heading text-4xl font-black mb-2">
                            <span className="gradient-text">Edit Profile</span>
                        </h1>
                        <p className="text-gray-400">Update your fitness information</p>
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

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.push('/profile')}
                                disabled={isLoading}
                                className="flex-1 bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-6 py-3 rounded-xl 
                                         font-semibold transition-all duration-300 hover:border-primary-purple hover:glow-purple
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-6 py-3 rounded-xl 
                                         font-semibold transition-all duration-300 hover:glow-cyan hover:scale-105 
                                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                                         flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

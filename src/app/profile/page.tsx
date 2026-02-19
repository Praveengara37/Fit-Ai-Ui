'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Edit, KeyRound, ArrowLeft, User as UserIcon, Calendar, Ruler, Weight, Target, Activity, Utensils, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getProfile, changePassword } from '@/lib/profile';
import { verifyAuth } from '@/lib/auth';
import Logo from '@/components/Logo';
import type { UserWithProfile } from '@/types';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserWithProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Change password modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

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
            setUser(profileData);
        } catch (error: any) {
            setError(error.message || 'Failed to load profile');
            toast.error(error.message || 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setIsChangingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            toast.success('Password changed successfully!');
            setShowPasswordModal(false);
            resetPasswordForm();
        } catch (error: any) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const resetPasswordForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
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

    const formatGoal = (goal: string): string => {
        return goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary-purple mx-auto mb-4" size={48} />
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-heading font-bold text-gray-100 mb-2">Failed to Load Profile</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => { setError(null); setIsLoading(true); loadProfile(); }}
                        className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-6 py-3 rounded-xl 
                                 font-semibold transition-all duration-300 hover:glow-cyan hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // No profile set up yet — show setup CTA
    if (user && !user.profile) {
        return (
            <div className="min-h-screen p-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <Logo className="glow-purple" width={180} height={68} />
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-gray-400 hover:text-primary-cyan transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="glass-card rounded-3xl p-12 text-center animate-in fade-in slide-in-from-bottom duration-700">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#a855f7] to-[#22d3ee] mb-6">
                            <UserIcon size={40} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-heading font-black gradient-text mb-3">
                            Hello, {user.fullName}!
                        </h1>
                        <p className="text-gray-400 mb-2">{user.email}</p>
                        <div className="h-px bg-gradient-to-r from-transparent via-primary-purple to-transparent my-8" />
                        <p className="text-gray-400 mb-8 text-lg">
                            You haven&apos;t set up your fitness profile yet. Complete your profile to get personalized recommendations.
                        </p>
                        <button
                            onClick={() => router.push('/profile/setup')}
                            className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-8 py-3 rounded-xl 
                                     font-semibold transition-all duration-300 hover:glow-cyan hover:scale-105
                                     inline-flex items-center gap-2"
                        >
                            <UserIcon size={20} />
                            Setup Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user || !user.profile) {
        return null;
    }

    return (
        <div className="min-h-screen p-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Logo className="glow-purple" width={180} height={68} />
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary-cyan transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                </div>

                <div className="glass-card rounded-3xl p-8 mb-6 animate-in fade-in duration-500">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#a855f7] to-[#22d3ee] flex items-center justify-center">
                                <UserIcon size={40} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-heading font-black gradient-text mb-1">
                                    {user.fullName}
                                </h1>
                                <p className="text-gray-400">{user.email}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Member since {formatDate(user.profile.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/profile/edit')}
                                className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-4 py-2 rounded-xl 
                                         font-semibold transition-all duration-300 hover:glow-cyan hover:scale-105 
                                         flex items-center gap-2"
                            >
                                <Edit size={18} />
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-2 rounded-xl 
                                         font-semibold transition-all duration-300 hover:border-primary-purple hover:glow-purple
                                         flex items-center gap-2"
                            >
                                <KeyRound size={18} />
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card rounded-2xl p-6 animate-in slide-in-from-left duration-700">
                        <h2 className="text-xl font-heading font-bold gradient-text mb-4">Personal Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar size={20} className="text-primary-purple" />
                                <div>
                                    <p className="text-sm text-gray-400">Age</p>
                                    <p className="text-gray-100 font-semibold">{calculateAge(user.profile.dateOfBirth)} years</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserIcon size={20} className="text-primary-cyan" />
                                <div>
                                    <p className="text-sm text-gray-400">Gender</p>
                                    <p className="text-gray-100 font-semibold">{formatGoal(user.profile.gender)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Ruler size={20} className="text-primary-purple" />
                                <div>
                                    <p className="text-sm text-gray-400">Height</p>
                                    <p className="text-gray-100 font-semibold">{user.profile.heightCm} cm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 animate-in slide-in-from-right duration-700">
                        <h2 className="text-xl font-heading font-bold gradient-text mb-4">Fitness Metrics</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Weight size={20} className="text-primary-cyan" />
                                <div>
                                    <p className="text-sm text-gray-400">Current Weight</p>
                                    <p className="text-gray-100 font-semibold">{user.profile.currentWeightKg} kg</p>
                                </div>
                            </div>
                            {user.profile.targetWeightKg && (
                                <div className="flex items-center gap-3">
                                    <Target size={20} className="text-primary-purple" />
                                    <div>
                                        <p className="text-sm text-gray-400">Target Weight</p>
                                        <p className="text-gray-100 font-semibold">{user.profile.targetWeightKg} kg</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Activity size={20} className="text-primary-cyan" />
                                <div>
                                    <p className="text-sm text-gray-400">Activity Level</p>
                                    <p className="text-gray-100 font-semibold">{formatGoal(user.profile.activityLevel)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 md:col-span-2 animate-in slide-in-from-bottom duration-700">
                        <h2 className="text-xl font-heading font-bold gradient-text mb-4">Goals & Preferences</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <Target size={24} className="text-primary-purple" />
                                <div>
                                    <p className="text-sm text-gray-400">Fitness Goal</p>
                                    <p className="text-lg text-gray-100 font-semibold">{formatGoal(user.profile.fitnessGoal)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Utensils size={24} className="text-primary-cyan" />
                                <div>
                                    <p className="text-sm text-gray-400">Dietary Preference</p>
                                    <p className="text-lg text-gray-100 font-semibold">
                                        {user.profile.dietaryPreference === 'none' ? 'No Preference' : formatGoal(user.profile.dietaryPreference)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => { setShowPasswordModal(false); resetPasswordForm(); }}>
                        <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-heading font-bold gradient-text mb-6">Change Password</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-100">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            id="currentPassword"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            disabled={isChangingPassword}
                                            placeholder="Enter current password"
                                            className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                                     focus:border-primary-purple focus:outline-none focus:glow-purple 
                                                     transition-all duration-300 placeholder:text-gray-400 pr-12
                                                     disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-cyan transition-colors"
                                        >
                                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-100">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={isChangingPassword}
                                            placeholder="Enter new password (min. 8 characters)"
                                            className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                                     focus:border-primary-purple focus:outline-none focus:glow-purple 
                                                     transition-all duration-300 placeholder:text-gray-400 pr-12
                                                     disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-cyan transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-100">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        placeholder="Confirm new password"
                                        className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                                 focus:border-primary-purple focus:outline-none focus:glow-purple 
                                                 transition-all duration-300 placeholder:text-gray-400
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => { setShowPasswordModal(false); resetPasswordForm(); }}
                                    disabled={isChangingPassword}
                                    className="flex-1 bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-6 py-3 rounded-xl 
                                             font-semibold transition-all duration-300 hover:border-primary-purple hover:glow-purple
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword}
                                    className="flex-1 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-6 py-3 rounded-xl 
                                             font-semibold transition-all duration-300 hover:glow-cyan hover:scale-105
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             flex items-center justify-center gap-2"
                                >
                                    {isChangingPassword ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Changing...
                                        </>
                                    ) : (
                                        'Change Password'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

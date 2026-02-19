'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { register } from '@/lib/auth';
import Logo from '@/components/Logo';

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await register(email, password, fullName);
            toast.success('Registration successful!');

            setTimeout(() => {
                router.push('/profile/setup');
            }, 500);
        } catch (error: any) {
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-4 animate-in fade-in duration-300">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-[#22d3ee] hover:underline text-sm inline-flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to Login
                    </button>
                </div>
                <div className="flex justify-center mb-8 animate-in fade-in duration-500">
                    <Logo className="glow-purple" width={200} height={75} />
                </div>

                <div className="glass-card rounded-3xl p-8 animate-in slide-in-from-bottom duration-700">
                    <div className="text-center mb-8">
                        <h1 className="font-heading text-4xl font-black mb-2">
                            <span className="gradient-text">Create Account</span>
                        </h1>
                        <p className="text-gray-400">Join FitAI and start your fitness journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-100">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={isLoading}
                                placeholder="John Doe"
                                autoComplete="off"
                                className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                         focus:border-primary-purple focus:outline-none focus:glow-purple 
                                         transition-all duration-300 placeholder:text-gray-400
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-100">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                placeholder="you@example.com"
                                autoComplete="off"
                                className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                         focus:border-primary-purple focus:outline-none focus:glow-purple 
                                         transition-all duration-300 placeholder:text-gray-400
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-100">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 placeholder:text-gray-400 pr-12
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-cyan transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-100">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                                             focus:border-primary-purple focus:outline-none focus:glow-purple 
                                             transition-all duration-300 placeholder:text-gray-400 pr-12
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-cyan transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
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
                                    Creating account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="text-primary-cyan hover:text-primary-purple transition-colors font-semibold"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

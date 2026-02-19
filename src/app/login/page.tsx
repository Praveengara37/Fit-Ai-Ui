'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '@/lib/auth';
import Logo from '@/components/Logo';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.fullName}!`);

            // Small delay to show success message
            setTimeout(() => {
                router.push('/dashboard');
            }, 500);
        } catch (error: any) {
            toast.error(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo with glow effect */}
                <div className="flex justify-center mb-8 animate-in fade-in duration-500">
                    <Logo className="glow-purple transition-all hover:scale-105" width={220} height={83} />
                </div>

                {/* Glass card */}
                <div className="glass-card rounded-3xl p-8 animate-in slide-in-from-bottom duration-700">
                    {/* Heading */}
                    <h1 className="font-heading text-4xl font-black mb-2">
                        <span className="gradient-text">Welcome Back</span>
                    </h1>
                    <p className="text-gray-400 mb-8">Sign in to your FitAI account</p>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                placeholder="you@example.com"
                                className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 rounded-xl 
                         focus:border-primary-purple focus:outline-none focus:glow-purple 
                         transition-all duration-300 placeholder:text-gray-400
                         disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="••••••••"
                                    className="w-full bg-[#2a2235] border-2 border-[rgba(138,43,226,0.3)] text-gray-100 px-4 py-3 pr-12 rounded-xl 
                           focus:border-primary-purple focus:outline-none focus:glow-purple 
                           transition-all duration-300 placeholder:text-gray-400
                           disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-cyan hover:text-[#22d3ee] 
                           transition-colors disabled:opacity-50"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
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
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Don&apos;t have an account?{' '}
                            <a
                                href="/register"
                                className="text-primary-cyan hover:text-[#22d3ee] transition-colors font-semibold underline"
                            >
                                Create one
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-xs mt-8">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}

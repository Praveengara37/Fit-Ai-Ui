'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, User, Target, Footprints, Sparkles, ChevronRight } from 'lucide-react';

const SETTINGS_LINKS = [
    {
        title: 'Profile',
        description: 'View and edit your personal information',
        icon: User,
        href: '/profile',
        color: '#a855f7',
    },
    {
        title: 'Nutrition Goals',
        description: 'Set your daily calorie and macro targets',
        icon: Target,
        href: '/meals/goals',
        color: '#22d3ee',
    },
    {
        title: 'Step Goals',
        description: 'Customize your daily step target',
        icon: Footprints,
        href: '/settings/steps',
        color: '#22c55e',
    },
    {
        title: 'Recommendations',
        description: 'Personalized calorie and macro recommendations',
        icon: Sparkles,
        href: '/settings/recommendations',
        color: '#f59e0b',
    },
];

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 bg-[#2a2235] hover:bg-[#a855f7]/20 rounded-xl transition-colors text-gray-300 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Settings</h1>
                        <p className="text-gray-400 text-sm">Manage your preferences and goals</p>
                    </div>
                </div>

                {/* Settings Cards */}
                <div className="space-y-3">
                    {SETTINGS_LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className="w-full flex items-center gap-4 p-5 bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl hover:border-[rgba(168,85,247,0.35)] transition-all group text-left"
                            >
                                <div
                                    className="p-3 rounded-xl"
                                    style={{ backgroundColor: `${item.color}15` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold">{item.title}</h3>
                                    <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

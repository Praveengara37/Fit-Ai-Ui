'use client';

import { Flame, Star, Target, Trophy, Clock } from 'lucide-react';
import { StepsStats } from '@/types/analytics';

interface AchievementsListProps {
    stats: StepsStats;
}

export default function AchievementsList({ stats }: AchievementsListProps) {

    // Calculate some static "milestones" for visual demonstration
    // In a real app, these would come from an achievements backend service
    const milestones = [
        {
            id: 'streak_3',
            title: '3-Day Streak',
            description: 'Hit your goal 3 days in a row',
            icon: Flame,
            progress: Math.min(3, stats.currentStreak),
            max: 3,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            activeColor: 'bg-orange-500'
        },
        {
            id: 'streak_7',
            title: '7-Day Streak',
            description: 'Hit your goal 7 days in a row',
            icon: Flame,
            progress: Math.min(7, stats.currentStreak),
            max: 7,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            activeColor: 'bg-red-500'
        },
        {
            id: 'goals_hit',
            title: 'Goal Crusher',
            description: 'Reach your daily goal 10 times',
            icon: Target,
            progress: Math.min(10, stats.goalReachedDays || 0), // Use actual metric
            max: 10,
            color: 'text-[#22c55e]',
            bg: 'bg-[#22c55e]/10',
            activeColor: 'bg-[#22c55e]'
        },
        {
            id: 'marathon',
            title: 'Marathon Walker',
            description: 'Walk 42km total',
            icon: Trophy,
            progress: Math.min(42, stats.totalDistanceKm || 0),
            max: 42,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            activeColor: 'bg-yellow-400'
        }
    ];

    return (
        <div className="bg-[#2a2235] rounded-2xl p-6 h-full border border-gray-800/50">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#a855f7]" />
                Milestones & Achievements
            </h3>

            <div className="space-y-6">
                {milestones.map((milestone) => {
                    const isCompleted = milestone.progress >= milestone.max;
                    const percentage = Math.min(100, (milestone.progress / milestone.max) * 100);

                    return (
                        <div key={milestone.id} className="relative">
                            <div className={`flex items-start gap-4 p-4 rounded-xl transition-all ${isCompleted ? 'bg-[#1a1625] border border-gray-700' : 'opacity-80'}`}>
                                <div className={`mt-1 p-2 rounded-xl shrink-0 ${isCompleted ? milestone.bg : 'bg-gray-800'}`}>
                                    <milestone.icon className={`w-5 h-5 ${isCompleted ? milestone.color : 'text-gray-500'}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`font-medium text-sm truncate pr-2 ${isCompleted ? 'text-white' : 'text-gray-300'}`}>
                                            {milestone.title}
                                        </h4>
                                        <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                                            {Math.floor(milestone.progress)} / {milestone.max}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">{milestone.description}</p>

                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out rounded-full ${isCompleted ? milestone.activeColor : 'bg-gray-600'}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {isCompleted && (
                                    <div className="absolute -top-2 -right-2 bg-[#22c55e] border border-[#1a1625] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg transform rotate-3">
                                        <Star className="w-3 h-3 fill-current" />
                                        Unlocked
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active challenge teaser */}
            <div className="mt-6 p-4 rounded-xl border border-dashed border-gray-700/50 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400 font-medium">
                    <Clock className="w-4 h-4 text-[#22d3ee]" />
                    <span>New challenges arriving soon</span>
                </div>
            </div>
        </div>
    );
}

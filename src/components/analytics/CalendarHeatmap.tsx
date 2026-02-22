'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface CalendarHeatmapProps {
    data: { date: string; steps: number }[];
    goalSteps?: number;
    averageSteps?: number;
}

export default function CalendarHeatmap({
    data,
    goalSteps = 10000,
    averageSteps = 0
}: CalendarHeatmapProps) {
    const [hoveredDay, setHoveredDay] = useState<{ date: string; steps: number } | null>(null);

    if (!data || data.length === 0) {
        return (
            <div className="bg-[#2a2235] rounded-2xl p-6 h-full flex items-center justify-center">
                <p className="text-gray-400">No data available for heatmap</p>
            </div>
        );
    }

    // Get color based on steps
    const getColorForSteps = (steps: number) => {
        if (steps === 0) return 'bg-gray-800/50'; // No activity
        if (steps >= goalSteps) return 'bg-[#a855f7]'; // Goal reached (dark purple)
        if (averageSteps > 0 && steps >= averageSteps) return 'bg-[#a855f7]/70'; // Above avg
        if (steps > goalSteps * 0.5) return 'bg-[#a855f7]/40'; // Moderate activity
        return 'bg-[#a855f7]/20'; // Light activity
    };

    // Process data for the 7-column grid layout
    // In a real app, this should align with actual calendar days (padding with empties)
    // But since we get an array of days from the API, we'll map them sequentially
    // Assume data is sorted from oldest to newest

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-[#2a2235] rounded-2xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    Activity Heatmap
                    <div className="group relative">
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full mb-2 -left-24 w-60 bg-[#1a1625] text-xs text-gray-300 p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-normal z-50 shadow-xl border border-gray-800 pointer-events-none">
                            Darker purple indicates higher step counts. Fully opaque means the daily goal was reached.
                        </div>
                    </div>
                </h3>

                {/* Simple Legend */}
                <div className="flex items-center gap-2 text-xs text-gray-400 sm:flex hidden">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-gray-800/50"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#a855f7]/20"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#a855f7]/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#a855f7]/70"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#a855f7]"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="w-full max-w-[500px] mx-auto">
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 relative">
                    {/* Weekday headers */}
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-xs text-gray-500 font-medium pb-2">
                            {day.charAt(0)}
                        </div>
                    ))}

                    {/* Calendar cells */}
                    {/* Padding for first day of month if needed (simplified here) */}
                    {(() => {
                        if (!data[0]) return null;
                        const firstDayIndex = new Date(data[0].date).getDay();
                        return Array.from({ length: firstDayIndex }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square rounded-sm bg-transparent"></div>
                        ));
                    })()}

                    {data.map((day, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-white/50 relative group ${getColorForSteps(day.steps)}`}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                        >
                            {/* Tooltip positioned via CSS relative to the cell */}
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1625] text-white text-xs py-1 px-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none border border-gray-700 shadow-xl`}>
                                <div className="font-semibold">{day.steps.toLocaleString()} steps</div>
                                <div className="text-gray-400 text-[10px]">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Legend (visible only on small screens) */}
            <div className="flex items-center justify-between mt-4 text-xs text-gray-400 sm:hidden">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-800/50"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#a855f7]/20"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#a855f7]/40"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#a855f7]/70"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#a855f7]"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
}

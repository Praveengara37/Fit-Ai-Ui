'use client';

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface StepTrendChartProps {
    data: { date: string; steps: number }[];
    goalSteps?: number;
    showAverage?: boolean;
    averageSteps?: number;
    height?: number;
}

export default function StepTrendChart({
    data,
    goalSteps = 10000,
    showAverage = true,
    averageSteps = 0,
    height = 350
}: StepTrendChartProps) {

    if (!data || data.length === 0) {
        return (
            <div className="bg-[#2a2235] rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-800" style={{ height }}>
                <p className="text-gray-400">No step data available for this period.</p>
            </div>
        );
    }

    const formatXAxisDate = (dateString: string) => {
        try {
            if (data.length <= 7) {
                return format(parseISO(dateString), 'EEE'); // Mon, Tue
            } else if (data.length <= 31) {
                return format(parseISO(dateString), 'dMMM'); // 14Feb
            } else {
                return format(parseISO(dateString), 'MMM yyyy'); // Feb 2024
            }
        } catch {
            return dateString;
        }
    };

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; }) => {
        if (active && payload && payload.length && label) {
            const steps = payload[0].value;
            const date = parseISO(label);
            return (
                <div className="bg-[#1a1625] border border-gray-700 p-3 rounded-xl shadow-xl">
                    <p className="text-gray-400 text-xs mb-1">{format(date, 'MMMM d, yyyy')}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#a855f7]"></div>
                        <p className="text-white font-bold text-lg">{steps.toLocaleString()} steps</p>
                    </div>
                    {steps >= goalSteps && (
                        <p className="text-xs text-[#22c55e] mt-1 font-medium">Goal reached! 🎉</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        tickFormatter={formatXAxisDate}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                        minTickGap={20}
                    />
                    <YAxis
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                        dx={-10}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2235" vertical={false} />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />

                    <ReferenceLine
                        y={goalSteps}
                        stroke="#a855f7"
                        strokeDasharray="5 5"
                        label={{ position: 'top', value: 'Goal', fill: '#a855f7', fontSize: 12 }}
                    />

                    {showAverage && averageSteps > 0 && (
                        <ReferenceLine
                            y={averageSteps}
                            stroke="#22d3ee"
                            strokeDasharray="3 3"
                            label={{ position: 'insideBottomLeft', value: 'Avg', fill: '#22d3ee', fontSize: 12 }}
                        />
                    )}

                    <Area
                        type="monotone"
                        dataKey="steps"
                        stroke="#a855f7"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSteps)"
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

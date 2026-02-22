'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

interface CalorieChartProps {
    data: Array<{
        date: string;
        calories: number;
    }>;
    goal: number;
}

export default function CalorieChart({ data, goal }: CalorieChartProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const shortDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Calories This Week</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.1)" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={shortDate}
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1a1625',
                            border: '1px solid rgba(168,85,247,0.3)',
                            borderRadius: '12px',
                            color: '#e5e5e5',
                        }}
                        labelFormatter={(label) => formatDate(String(label))}
                        formatter={(value?: number | string) => [`${value ?? 0} cal`, 'Calories']}
                    />
                    <ReferenceLine
                        y={goal}
                        stroke="#22d3ee"
                        strokeDasharray="5 5"
                        label={{
                            value: `Goal: ${goal}`,
                            position: 'right',
                            fill: '#22d3ee',
                            fontSize: 11,
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="calories"
                        stroke="#a855f7"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCalories)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

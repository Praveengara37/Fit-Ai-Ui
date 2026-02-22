'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface MacroChartProps {
    data: Array<{
        date: string;
        protein: number;
        carbs: number;
        fat: number;
    }>;
}

export default function MacroChart({ data }: MacroChartProps) {
    const shortDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Macronutrient Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                        label={{
                            value: 'grams',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fill: '#6b7280', fontSize: 11 },
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1a1625',
                            border: '1px solid rgba(168,85,247,0.3)',
                            borderRadius: '12px',
                            color: '#e5e5e5',
                        }}
                        labelFormatter={(label) => formatDate(String(label))}
                        formatter={(value?: number | string, name?: string) => [
                            `${value ?? 0}g`,
                            (name ?? '').charAt(0).toUpperCase() + (name ?? '').slice(1),
                        ]}
                    />
                    <Legend
                        wrapperStyle={{ color: '#9ca3af', fontSize: 12 }}
                        formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
                    />
                    <Bar dataKey="protein" stackId="macros" fill="#a855f7" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="carbs" stackId="macros" fill="#22d3ee" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="fat" stackId="macros" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

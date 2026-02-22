'use client';

interface PeriodSelectorProps {
    period: 'day' | 'week' | 'month' | 'year';
    onChange: (period: 'day' | 'week' | 'month' | 'year') => void;
    disabled?: boolean;
}

export default function PeriodSelector({ period, onChange, disabled = false }: PeriodSelectorProps) {
    const periods: { value: 'day' | 'week' | 'month' | 'year', label: string }[] = [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
    ];

    return (
        <div className="flex gap-1 p-1 bg-[#2a2235] rounded-xl border border-gray-800 w-full sm:w-auto overflow-x-auto scroolbar-hide">
            {periods.map((p) => (
                <button
                    key={p.value}
                    onClick={() => onChange(p.value)}
                    disabled={disabled}
                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${period === p.value
                            ? 'bg-[#a855f7] text-white shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
}

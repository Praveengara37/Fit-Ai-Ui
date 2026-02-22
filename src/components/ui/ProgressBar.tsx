'use client';

interface ProgressBarProps {
    current: number;
    max: number;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    colorClass?: string;
    showPercentage?: boolean;
}

export default function ProgressBar({
    current,
    max,
    label,
    size = 'md',
    colorClass = 'bg-gradient-to-r from-[#a855f7] to-[#22d3ee]',
    showPercentage = false,
}: ProgressBarProps) {
    const percentage = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
    const heightClass = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2.5' : 'h-3.5';

    return (
        <div className="w-full">
            {(label || showPercentage) && (
                <div className="flex items-center justify-between mb-1.5">
                    {label && <span className="text-xs text-gray-400 font-medium">{label}</span>}
                    {showPercentage && (
                        <span className="text-xs text-gray-400 font-medium">{percentage}%</span>
                    )}
                </div>
            )}
            <div className={`${heightClass} w-full bg-gray-700/60 rounded-full overflow-hidden`}>
                <div
                    className={`${heightClass} ${colorClass} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

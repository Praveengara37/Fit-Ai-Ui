'use client';

import ProgressBar from './ProgressBar';

interface MacroDisplayProps {
    label: string;
    current: number;
    max: number;
    unit?: string;
    color: string;
    icon?: React.ReactNode;
}

export default function MacroDisplay({
    label,
    current,
    max,
    unit = 'g',
    color,
    icon,
}: MacroDisplayProps) {
    return (
        <div className="flex items-center gap-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">{label}</span>
                    <span className="text-sm text-gray-400">
                        <span className="text-white font-semibold">{Math.round(current)}</span>
                        <span className="text-gray-500">/{max}{unit}</span>
                    </span>
                </div>
                <ProgressBar
                    current={current}
                    max={max}
                    size="sm"
                    colorClass={color}
                />
            </div>
        </div>
    );
}

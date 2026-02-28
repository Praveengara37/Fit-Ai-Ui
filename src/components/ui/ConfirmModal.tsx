'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
}

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
}: ConfirmModalProps) {
    if (!open) return null;

    const Icon = variant === 'danger' ? Trash2 : AlertTriangle;
    const iconColor = variant === 'danger' ? 'text-red-400' : 'text-[#f59e0b]';
    const iconBg = variant === 'danger' ? 'bg-red-500/10' : 'bg-[#f59e0b]/10';
    const confirmBg =
        variant === 'danger'
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-[#f59e0b] hover:bg-[#f59e0b]/90';

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-[#2a2235] border border-[rgba(168,85,247,0.25)] rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${iconBg}`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl bg-[#1a1625] border border-[rgba(168,85,247,0.2)] text-gray-300 hover:text-white hover:border-[rgba(168,85,247,0.4)] transition-all text-sm font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all ${confirmBg}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

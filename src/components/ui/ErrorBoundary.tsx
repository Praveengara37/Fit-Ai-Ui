'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.25)] rounded-2xl p-8 max-w-md w-full text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            {this.state.error?.message || 'An unexpected error occurred. Please try reloading the page.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                        >
                            <RefreshCw size={18} />
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

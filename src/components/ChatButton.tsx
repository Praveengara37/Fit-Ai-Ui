'use client';

import { ChatbotIcon } from './ui/ChatbotIcon';

export function ChatButton() {
    return (
        <button
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full 
                 bg-[#1a1625] border border-[rgba(153,87,241,0.4)]
                 flex items-center justify-center 
                 hover:scale-110 transition-all duration-300 
                 shadow-[0_0_20px_rgba(153,87,241,0.4),0_0_40px_rgba(42,244,255,0.15)]
                 hover:shadow-[0_0_30px_rgba(153,87,241,0.6),0_0_60px_rgba(42,244,255,0.25)]
                 group"
            onClick={() => window.location.href = '/chat'}
            aria-label="Open AI Chat"
        >
            <ChatbotIcon
                width={32}
                height={29}
                className="drop-shadow-[0_0_8px_rgba(153,87,241,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(153,87,241,0.7)] transition-all duration-300"
            />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-[rgba(153,87,241,0.3)] animate-ping opacity-30 pointer-events-none" />
        </button>
    );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { sendChatMessage } from '@/lib/chat';
import { ChatbotIcon } from '@/components/ui/ChatbotIcon';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTIONS = [
    "Am I eating enough protein?",
    "How am I doing this week?",
    "Should I work out today?",
    "What should I eat for dinner?"
];

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string>();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText,
        };

        setMessages(prev => [...prev, userMessage]);
        const messageText = inputText;
        setInputText('');
        setLoading(true);

        try {
            const result = await sendChatMessage(messageText, conversationId);
            setConversationId(result.conversationId);

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.message,
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            // @ts-expect-error - axios error structure
            alert(error.response?.data?.error || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // --- Empty state with suggestions ---
    if (messages.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <div className="p-6 md:p-8">
                    <div className="max-w-4xl mx-auto flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 rounded-xl bg-[#2a2235] border border-[rgba(168,85,247,0.25)]
                                       text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="font-heading text-xl font-bold gradient-text">AI Chat</h2>
                    </div>
                </div>

                {/* Hero */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 pb-40">
                    <div className="relative">
                        <ChatbotIcon
                            width={120}
                            height={108}
                            className="drop-shadow-[0_0_30px_rgba(153,87,241,0.5)]"
                        />
                        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-[rgba(153,87,241,0.15)] to-[rgba(42,244,255,0.1)] blur-xl scale-150" />
                    </div>
                    <h1 className="font-heading text-4xl font-black mt-8">
                        <span className="gradient-text">AI Fitness Coach</span>
                    </h1>
                    <p className="text-gray-400 mt-3 text-lg text-center max-w-md">
                        Ask me anything about your fitness journey!
                    </p>

                    {/* Suggestions */}
                    <div className="mt-10 w-full max-w-2xl">
                        <p className="text-sm text-gray-500 mb-4">Try asking:</p>
                        <div className="space-y-3">
                            {SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => setInputText(suggestion)}
                                    className="w-full text-left p-4 glass-card rounded-xl
                                               hover:border-primary-cyan transition-all duration-200
                                               group"
                                >
                                    <span className="text-primary-purple group-hover:text-primary-cyan transition-colors">
                                        {suggestion}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input bar (fixed bottom) */}
                <div className="fixed bottom-0 left-0 right-0 border-t border-[rgba(168,85,247,0.2)] bg-[#1a1625]/95 backdrop-blur-md p-4 z-40">
                    <div className="flex gap-3 max-w-4xl mx-auto">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-[#2a2235] border border-[rgba(168,85,247,0.25)] rounded-xl p-3
                                       text-sm text-gray-100 resize-none
                                       focus:outline-none focus:border-primary-purple
                                       placeholder:text-gray-500"
                            rows={2}
                            maxLength={500}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className="px-5 py-3 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] rounded-xl
                                       text-white font-semibold
                                       hover:scale-105 transition-all duration-200
                                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <span className="text-xl">→</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Conversation view ---
    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex-shrink-0 p-4 md:p-6 border-b border-[rgba(168,85,247,0.15)]">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 rounded-xl bg-[#2a2235] border border-[rgba(168,85,247,0.25)]
                                   text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <ChatbotIcon width={28} height={25} />
                    <h2 className="font-heading text-lg font-bold gradient-text">AI Fitness Coach</h2>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 mr-3 mt-1">
                                    <ChatbotIcon width={24} height={22} />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                    ? 'bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white'
                                    : 'glass-card'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex-shrink-0 mr-3 mt-1">
                                <ChatbotIcon width={24} height={22} />
                            </div>
                            <div className="glass-card rounded-2xl p-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-primary-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-primary-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-primary-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input bar */}
            <div className="flex-shrink-0 border-t border-[rgba(168,85,247,0.2)] bg-[#1a1625]/95 backdrop-blur-md p-4">
                <div className="flex gap-3 max-w-4xl mx-auto">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-[#2a2235] border border-[rgba(168,85,247,0.25)] rounded-xl p-3
                                   text-sm text-gray-100 resize-none
                                   focus:outline-none focus:border-primary-purple
                                   placeholder:text-gray-500
                                   disabled:opacity-50"
                        rows={2}
                        maxLength={500}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !inputText.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] rounded-xl
                                   text-white font-semibold
                                   hover:scale-105 transition-all duration-200
                                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="text-xl">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

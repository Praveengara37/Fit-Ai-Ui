'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import MealForm from '@/components/meals/MealForm';

export default function LogMealPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#2a2235] hover:bg-[#a855f7]/20 rounded-xl transition-colors text-gray-300 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Log Meal</h1>
                        <p className="text-gray-400 text-sm">Search for foods and add them to your meal</p>
                    </div>
                </div>

                {/* Form */}
                <MealForm />
            </div>
        </div>
    );
}

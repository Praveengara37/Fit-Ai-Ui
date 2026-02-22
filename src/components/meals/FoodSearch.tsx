'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { searchFoods } from '@/lib/meals';
import { Food } from '@/types';
import FoodResult from './FoodResult';

interface FoodSearchProps {
    onAdd: (food: Food) => void;
}

export default function FoodSearch({ onAdd }: FoodSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Food[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const performSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        try {
            const data = await searchFoods(searchQuery, 10);
            setResults(data.foods || []);
            setHasSearched(true);
        } catch {
            setResults([]);
            setHasSearched(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, performSearch]);

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setHasSearched(false);
        inputRef.current?.focus();
    };

    return (
        <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for foods... (e.g., chicken breast)"
                    className="w-full pl-10 pr-10 py-3 bg-[#2a2235] border border-[rgba(168,85,247,0.25)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7] transition-colors"
                    autoComplete="off"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#a855f7] animate-spin" />
                    <span className="ml-2 text-gray-400 text-sm">Searching...</span>
                </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {results.map((food, index) => (
                        <FoodResult
                            key={food.foodId || index}
                            food={food}
                            onAdd={onAdd}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && hasSearched && results.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No foods found for &quot;{query}&quot;</p>
                    <p className="text-gray-600 text-xs mt-1">Try a different search term</p>
                </div>
            )}

            {/* Hint */}
            {!hasSearched && !loading && query.length < 2 && query.length > 0 && (
                <p className="text-gray-600 text-xs text-center">Type at least 2 characters to search</p>
            )}
        </div>
    );
}

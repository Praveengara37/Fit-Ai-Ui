'use client';

import { Plus } from 'lucide-react';
import { Food } from '@/types';

interface FoodResultProps {
    food: Food;
    onAdd: (food: Food) => void;
}

export default function FoodResult({ food, onAdd }: FoodResultProps) {
    return (
        <div className="bg-[#2a2235] hover:bg-[#352a45] border border-[rgba(168,85,247,0.15)] hover:border-[rgba(168,85,247,0.35)] rounded-xl p-4 transition-all duration-200 group">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm truncate group-hover:text-[#a855f7] transition-colors">
                        {food.name}
                    </h4>
                    {food.brandName && (
                        <p className="text-xs text-gray-500 mt-0.5">{food.brandName}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-[#a855f7] font-bold">{food.calories} cal</span>
                        <span className="text-gray-400">P: {food.protein}g</span>
                        <span className="text-gray-400">C: {food.carbs}g</span>
                        <span className="text-gray-400">F: {food.fat}g</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Serving: {food.servingSize}{food.servingUnit}
                    </p>
                </div>
                <button
                    onClick={() => onAdd(food)}
                    className="flex-shrink-0 p-2 bg-[#a855f7]/10 hover:bg-[#a855f7] text-[#a855f7] hover:text-white rounded-lg transition-all duration-200"
                    title="Add food"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
}

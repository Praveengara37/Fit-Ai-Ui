'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Trash2, Clock } from 'lucide-react';
import { Meal } from '@/types';

interface MealCardProps {
    meal: Meal;
    onEdit?: (meal: Meal) => void;
    onDelete?: (mealId: string) => void;
}

const MEAL_ICONS: Record<string, string> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
};

export default function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
    const [expanded, setExpanded] = useState(false);

    const mealTime = new Date(meal.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[rgba(168,85,247,0.3)]">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{MEAL_ICONS[meal.mealType] || '🍽️'}</span>
                    <div>
                        <h3 className="text-white font-semibold capitalize">
                            {meal.mealType}
                            <span className="text-[#a855f7] ml-2 font-bold">
                                {meal.totalCalories} cal
                            </span>
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Clock size={12} />
                            <span>{mealTime}</span>
                            <span className="mx-1">·</span>
                            <span>{meal.foods.length} {meal.foods.length === 1 ? 'food' : 'foods'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right mr-2 hidden sm:block">
                        <div className="text-xs text-gray-400">
                            P: {meal.totalProtein}g · C: {meal.totalCarbs}g · F: {meal.totalFat}g
                        </div>
                    </div>
                    {expanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </div>
            </button>

            {/* Expanded Details */}
            {expanded && (
                <div className="border-t border-[rgba(168,85,247,0.1)] px-5 pb-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3 mt-4">
                        {meal.foods.map((food, index) => (
                            <div
                                key={food.id || index}
                                className="flex items-center justify-between py-2 border-b border-gray-800/30 last:border-b-0"
                            >
                                <div>
                                    <p className="text-gray-200 text-sm">{food.foodName}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {food.servingSize}{food.servingUnit}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-[#a855f7] font-medium">{food.calories} cal</p>
                                    <p className="text-xs text-gray-500">
                                        P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {meal.notes && (
                        <p className="text-xs text-gray-500 mt-3 italic">&quot;{meal.notes}&quot;</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-800/30">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(meal)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-[#1a1625] hover:bg-[#352a45] rounded-lg transition-colors"
                            >
                                <Pencil size={12} />
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(meal.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-red-400 bg-[#1a1625] hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={12} />
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

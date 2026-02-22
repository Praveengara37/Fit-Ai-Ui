'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X, Minus, Plus, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import { logMeal } from '@/lib/meals';
import { Food, MealType, MealFood } from '@/types';
import FoodSearch from './FoodSearch';

const MEAL_TYPES: { value: MealType; label: string; icon: string }[] = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' },
];

export default function MealForm() {
    const router = useRouter();
    const [mealType, setMealType] = useState<MealType>('breakfast');
    const [addedFoods, setAddedFoods] = useState<MealFood[]>([]);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const handleAddFood = (food: Food) => {
        const mealFood: MealFood = {
            foodId: food.foodId,
            foodName: food.name,
            brandName: food.brandName,
            servingSize: food.servingSize,
            servingUnit: food.servingUnit,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
        };
        setAddedFoods((prev) => [...prev, mealFood]);
        toast.success(`${food.name} added`);
    };

    const handleRemoveFood = (index: number) => {
        setAddedFoods((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateServing = (index: number, newServing: number) => {
        if (newServing <= 0) return;
        setAddedFoods((prev) =>
            prev.map((food, i) => {
                if (i !== index) return food;
                const ratio = newServing / food.servingSize;
                return {
                    ...food,
                    servingSize: newServing,
                    calories: Math.round(food.calories * ratio),
                    protein: Math.round(food.protein * ratio * 10) / 10,
                    carbs: Math.round(food.carbs * ratio * 10) / 10,
                    fat: Math.round(food.fat * ratio * 10) / 10,
                };
            })
        );
    };

    const totals = addedFoods.reduce(
        (acc, food) => ({
            calories: acc.calories + food.calories,
            protein: acc.protein + food.protein,
            carbs: acc.carbs + food.carbs,
            fat: acc.fat + food.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const handleSave = async () => {
        if (addedFoods.length === 0) return;

        setSaving(true);
        try {
            await logMeal({
                mealType,
                date: new Date().toISOString().split('T')[0],
                foods: addedFoods.map((f) => ({
                    foodId: f.foodId,
                    foodName: f.foodName,
                    brandName: f.brandName,
                    servingSize: f.servingSize,
                    servingUnit: f.servingUnit,
                    calories: f.calories,
                    protein: f.protein,
                    carbs: f.carbs,
                    fat: f.fat,
                })),
                notes: notes || undefined,
            });
            toast.success('Meal logged successfully!');
            router.push('/meals');
        } catch {
            toast.error('Failed to log meal. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Meal Type Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Meal Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MEAL_TYPES.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setMealType(type.value)}
                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${mealType === type.value
                                    ? 'bg-[#a855f7]/20 border-[#a855f7] text-white'
                                    : 'bg-[#2a2235] border-[rgba(168,85,247,0.15)] text-gray-400 hover:border-[rgba(168,85,247,0.35)] hover:text-gray-300'
                                }`}
                        >
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Food Search */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Search Food</label>
                <FoodSearch onAdd={handleAddFood} />
            </div>

            {/* Added Foods */}
            {addedFoods.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Added Foods ({addedFoods.length})
                    </label>
                    <div className="space-y-2">
                        {addedFoods.map((food, index) => (
                            <div
                                key={index}
                                className="bg-[#2a2235] border border-[rgba(168,85,247,0.15)] rounded-xl p-4 flex items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{food.foodName}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {food.calories} cal · P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleUpdateServing(index, food.servingSize - (food.servingSize > 50 ? 50 : 10))}
                                        className="p-1 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-xs text-gray-300 min-w-[60px] text-center">
                                        {food.servingSize}{food.servingUnit}
                                    </span>
                                    <button
                                        onClick={() => handleUpdateServing(index, food.servingSize + (food.servingSize >= 50 ? 50 : 10))}
                                        className="p-1 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveFood(index)}
                                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Running Totals */}
                    <div className="mt-4 bg-gradient-to-r from-[#2a2235] to-[#a855f7]/10 border border-[rgba(168,85,247,0.2)] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm font-medium">Total</span>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-[#a855f7] font-bold">{totals.calories} cal</span>
                                <span className="text-gray-400">P: {totals.protein.toFixed(1)}g</span>
                                <span className="text-gray-400">C: {totals.carbs.toFixed(1)}g</span>
                                <span className="text-gray-400">F: {totals.fat.toFixed(1)}g</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this meal..."
                    className="w-full px-4 py-3 bg-[#2a2235] border border-[rgba(168,85,247,0.25)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7] transition-colors resize-none"
                    rows={2}
                />
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={addedFoods.length === 0 || saving}
                className="w-full py-4 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#a855f7]/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
                {saving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <UtensilsCrossed size={20} />
                        Save Meal ({addedFoods.length} {addedFoods.length === 1 ? 'food' : 'foods'})
                    </>
                )}
            </button>
        </div>
    );
}

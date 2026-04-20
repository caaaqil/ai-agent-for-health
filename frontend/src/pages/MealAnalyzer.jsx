import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Utensils, CheckCircle2, ChevronRight, Zap, CloudLightning, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const MealAnalyzer = ({ user }) => {
    const [mealText, setMealText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!mealText) return;

        setLoading(true);
        try {
            const res = await api.post('/ai/analyze-meal', { userId: user._id, foodText: mealText });
            setResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto bg-[#f8fafc] min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-health-100 flex items-center justify-center border-2 border-health-500 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                    </div>
                    <span className="text-health-900 font-bold text-sm">The Living Sanctuary</span>
                </div>
                <div className="bg-health-50 p-1.5 rounded-lg">
                    <div className="w-4 h-4 bg-health-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="text-white w-3 h-3" />
                    </div>
                </div>
            </div>

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Nourish Your Body</h1>
                <p className="text-gray-500 text-sm mt-2 max-w-[280px] mx-auto">Upload a photo of your meal to instantly receive detailed nutritional insights from our AI sanctuary.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 h-[500px]">
                {/* Left Column: Input/Preview */}
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="flex-1 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-12 h-12 bg-health-100 rounded-full flex items-center justify-center mb-3">
                            <Camera className="text-health-600 w-6 h-6" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 mb-1">Capture or Upload</h3>
                        <p className="text-[9px] text-gray-400 mb-4">Drag and drop your meal photo here</p>
                        <button className="bg-health-600 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg shadow-health-100">
                            Select Image
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
                        <textarea
                            value={mealText}
                            onChange={(e) => setMealText(e.target.value)}
                            placeholder="Describe your meal (e.g. Avocado Toast with Egg)"
                            className="w-full h-20 text-xs text-gray-700 bg-transparent resize-none focus:outline-none placeholder:text-gray-300"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full mt-2 bg-health-900 text-white text-[10px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
                        >
                            {loading ? 'Analyzing...' : <>Analyze <ChevronRight size={14} /></>}
                        </button>
                    </div>

                    <div className="h-40 bg-white rounded-3xl overflow-hidden relative border border-gray-100 p-2">
                        <div className="flex items-center gap-1 mb-2">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Current Preview</span>
                            <div className="ml-auto flex items-center gap-1 text-[7px] font-bold text-health-600 uppercase">
                                <CheckCircle2 size={10} /> Processed
                            </div>
                        </div>
                        <div className="w-full h-28 rounded-2xl overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400"
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-3">
                                <span className="text-[7px] text-white/70 uppercase font-black">Detected Meal</span>
                                <span className="text-xs text-white font-bold leading-none">Salmon & Avocado Harvest Bowl</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analysis Result */}
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-50 relative overflow-hidden flex flex-col">
                        <div className="text-center mb-6">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">AI Nutrition Analysis</span>
                            <h2 className="text-lg font-bold text-gray-900">Health Metrics</h2>
                        </div>

                        <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="64" cy="64" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                <circle
                                    cx="64" cy="64" r="54" fill="none" stroke="#15803d" strokeWidth="10"
                                    strokeDasharray="339" strokeDashoffset={339 * (1 - (result?.calories / 1000 || 0.642))}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-gray-900">{result?.calories || 642}</span>
                                <span className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Kcal</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center gap-1 mb-1">
                                    <CloudLightning className="text-health-500 w-3 h-3" />
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">Protein</span>
                                </div>
                                <div className="flex items-end gap-0.5">
                                    <span className="text-sm font-black text-gray-900">{result?.protein || 32}</span>
                                    <span className="text-[8px] text-gray-400 font-bold mb-0.5">g</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center gap-1 mb-1">
                                    <Droplets className="text-amber-500 w-3 h-3" />
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">Fats</span>
                                </div>
                                <div className="flex items-end gap-0.5">
                                    <span className="text-sm font-black text-gray-900">{result?.fat || 24}</span>
                                    <span className="text-[8px] text-gray-400 font-bold mb-0.5">g</span>
                                </div>
                            </div>
                            <div className="col-span-2 bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <Zap className="text-health-500 w-3 h-3" />
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">Carbohydrates</span>
                                </div>
                                <div className="flex items-end gap-0.5">
                                    <span className="text-sm font-black text-gray-900">48</span>
                                    <span className="text-[8px] text-gray-400 font-bold mb-0.5">g</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-[#334155] text-white text-[10px] font-bold py-3 rounded-2xl">
                            Log Meal to Diary
                        </button>
                    </div>

                    <div className="bg-health-100 rounded-3xl p-5 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-health-600/10 rounded-lg flex items-center justify-center">
                                <Zap className="text-health-600 w-3 h-3" />
                            </div>
                            <span className="text-[9px] font-bold text-health-800 uppercase tracking-widest">AI Sanctuary Tip</span>
                        </div>
                        <p className="text-[10px] text-health-900/70 leading-relaxed font-medium">
                            {result?.note || "This meal is rich in Omega-3 fatty acids, excellent for cognitive recovery after your morning meditation session."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealAnalyzer;

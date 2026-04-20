import React, { useState, useEffect } from 'react';
import {
    Plus, MessageSquare, Utensils, Calendar,
    Droplets, Zap, Activity, ChevronRight, Settings,
    ArrowUpRight, Wind
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({
        calories: 1842,
        protein: 112,
        carbs: 210,
        fat: 56,
        hydration: 1.8
    });

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
                <Settings className="text-health-800 w-5 h-5 cursor-pointer" />
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    Hello {user?.name || 'Sanctuary'} <span className="text-2xl">👋</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Your body is a temple in bloom. Ready for your daily check-in?</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-health-600 text-white px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-semibold shadow-lg shadow-health-200"
                >
                    <MessageSquare size={16} /> Ask AI
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-white text-health-900 px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-semibold border border-gray-100 shadow-sm"
                >
                    <Utensils size={16} className="text-health-500" /> Upload Meal
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-white text-health-900 px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-semibold border border-gray-100 shadow-sm"
                >
                    <Calendar size={16} className="text-health-500" /> Workout Plan
                </motion.button>
            </div>

            {/* Main Stats Card */}
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 relative overflow-hidden">
                    <div className="flex gap-8 items-center">
                        {/* Circular Progress */}
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="72" cy="72" r="60" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                <circle cx="72" cy="72" r="60" fill="none" stroke="#15803d" strokeWidth="12" strokeDasharray="377" strokeDashoffset={377 * (1 - 0.75)} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">{stats.calories.toLocaleString()}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Kcal Consumed</span>
                            </div>
                        </div>

                        {/* Detailed Metrics */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Energy Balance</span>
                                    <span className="text-sm font-bold text-health-800">75% of target</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-health-600 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Protein Intake</span>
                                    <span className="text-[10px] font-bold text-health-800">{stats.protein}g / 150g</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-health-400 rounded-full" style={{ width: '74%' }}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 rounded-xl p-2.5">
                                    <span className="block text-[8px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Carbs</span>
                                    <span className="text-sm font-bold text-gray-800">{stats.carbs}g</span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-2.5">
                                    <span className="block text-[8px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Fat</span>
                                    <span className="text-sm font-bold text-gray-800">{stats.fat}g</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 bg-health-50 p-1 rounded-lg">
                            <Activity className="text-health-600 w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Cards Grid */}
            <div className="grid grid-cols-12 gap-4 mb-24">
                {/* Daily Insight */}
                <div className="col-span-12 bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                        <Wind className="text-health-500 w-4 h-4" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Insight</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        "Your heart rate variability is higher today. It's a great afternoon for a high-intensity session followed by deep hydration."
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                            <div className="w-3 h-3 bg-health-600 rounded-full"></div>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-gray-900">Sanctuary AI</span>
                            <span className="block text-[8px] text-gray-400">Wellness Guide</span>
                        </div>
                    </div>
                </div>

                {/* Recent Movement */}
                <div className="col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-4 text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-gray-900">Recent Movement</span>
                        <span className="text-health-600">See all</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-health-50 flex items-center justify-center">
                                    <Activity className="text-health-600 w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-gray-900">Morning Run</span>
                                    <span className="block text-[9px] text-gray-400">5.2 km • 35 mins</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-health-600">+340 kcal</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-health-50 flex items-center justify-center">
                                    <ArrowUpRight className="text-health-600 w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-gray-900">Yoga Flow</span>
                                    <span className="block text-[9px] text-gray-400">Guiding • 45 mins</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-health-600">+120 kcal</span>
                        </div>
                    </div>
                </div>

                {/* Hydration */}
                <div className="col-span-5 bg-health-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                        <Droplets className="text-health-700 w-4 h-4" />
                        <span className="text-[10px] font-bold text-health-800 uppercase tracking-widest">Hydration</span>
                    </div>
                    <p className="text-[9px] text-health-800 opacity-70 leading-tight mb-4">
                        Keep the water flowing. You're at 60% of your target.
                    </p>

                    <div className="flex items-end gap-1 mb-4 h-12">
                        {[30, 60, 45, 90, 70].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-health-900/10 rounded-full relative"
                                style={{ height: '100%' }}
                            >
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-health-900 rounded-full"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-health-900">{stats.hydration.toFixed(1)}</span>
                        <span className="text-[10px] font-black text-health-900 opacity-60">/3.0L</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

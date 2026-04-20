import React, { useState } from 'react';
import { Settings, Droplets, Zap, Calendar, ChevronRight, PlayCircle, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const WorkoutPlanner = ({ user }) => {
    const [goal, setGoal] = useState('muscle');
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);

    const generatePlan = async () => {
        setLoading(true);
        try {
            const res = await api.post('/ai/generate-workout', { userId: user._id, goal });
            setPlan(res.data.plan);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const schedule = [
        { day: 'Mon', type: 'Chest', subtitle: 'Hypertrophy focus', duration: '60 min', icon: 'zap', color: 'health-400' },
        { day: 'Tue', type: 'Cardio', subtitle: 'Steady-state Flow', duration: '45 min', icon: 'target', color: 'health-100' },
        { day: 'Wed', type: 'Rest', subtitle: 'Mindful recovery', duration: null, icon: 'coffee', color: 'amber-50' },
        { day: 'Thu', type: 'Back', subtitle: 'Posture & Core', duration: '50 min', icon: 'zap', color: 'health-400' },
        { day: 'Fri', type: 'Yoga', subtitle: 'Full body mobility', duration: '30 min', icon: 'wind', color: 'health-50' },
        { day: 'Sat', type: 'HIIT', subtitle: 'Peak intensity', duration: '35 min', icon: 'flame', color: 'orange-50' },
        { day: 'Sun', type: 'Legs', subtitle: 'Foundation power', duration: '75 min', icon: 'zap', color: 'health-400' },
    ];

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

            <div className="mb-10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Weekly Momentum</span>
                <h1 className="text-5xl font-extrabold text-health-800 leading-tight mb-2">Workout Plan</h1>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">A restorative sequence designed to align your physical vitality with mental clarity. Embrace the rhythm of the sanctuary.</p>

                <div className="mt-8 flex items-center gap-4">
                    <div className="flex-1 bg-health-200 rounded-3xl p-6 relative overflow-hidden flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold text-health-800 uppercase tracking-widest block mb-1">Total Effort</span>
                            <span className="text-3xl font-black text-health-900">5.5 hrs</span>
                            <span className="block text-[8px] text-health-800 opacity-60 font-bold uppercase tracking-widest">this week</span>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-health-400 rounded-full blur-3xl -mr-12 -mt-12 opacity-30"></div>
                    </div>
                </div>
            </div>

            {/* Week View */}
            <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
                {schedule.map((day, i) => (
                    <div
                        key={day.day}
                        className={`min-w-[100px] rounded-3xl p-4 flex flex-col items-center text-center shadow-sm border border-gray-50 transition-all ${i === 2 ? 'bg-amber-50 border-amber-100' : 'bg-white'}`}
                    >
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-4">{day.day}</span>
                        <div className={`w-8 h-8 rounded-xl bg-${day.color} flex items-center justify-center mb-4`}>
                            <Zap className={`w-4 h-4 text-health-${i === 2 ? '200' : '800'}`} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-900 mb-0.5">{day.type}</span>
                        <span className="text-[8px] text-gray-400 font-medium mb-2 leading-none whitespace-nowrap">{day.subtitle}</span>
                        <span className="text-[9px] font-black text-gray-900 mt-auto">{day.duration || '--'}</span>
                    </div>
                ))}
            </div>

            {/* Today's Session Card */}
            <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Today's Focus: Deep Resilience</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-[240px]">Your heart rate variability indicates high readiness. Today is the perfect time to push for an extra 10% in your HIIT session. Listen to the sanctuary within.</p>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-health-900 text-white px-6 py-3 rounded-full text-xs font-bold shadow-xl shadow-health-100"
                    >
                        START TODAY'S SESSION
                    </motion.button>
                </div>

                {/* Mascot/Illustration Placeholder */}
                <div className="absolute top-0 right-0 w-1/2 h-full p-4 pointer-events-none">
                    <div className="w-full h-full bg-gray-100 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Fitness" alt="mascot" className="w-32 h-32 opacity-80" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutPlanner;

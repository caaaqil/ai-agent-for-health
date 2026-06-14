import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare, Utensils, Calendar, Droplets,
    Activity, ArrowUpRight, Wind, Bell, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [stats] = useState({
        calories: 1842, target: 2450, protein: 112, carbs: 210, fat: 56, hydration: 1.8,
    });

    const calPct = Math.min(stats.calories / stats.target, 1);
    const R = 60, C = 2 * Math.PI * R;

    const quickActions = [
        { icon: MessageSquare, label: 'Ask AI', to: '/chat', primary: true },
        { icon: Utensils, label: 'Log Meal', to: '/meal' },
        { icon: Calendar, label: 'Workout', to: '/workout' },
    ];

    return (
        <div className="pb-28 pt-6 px-4 max-w-lg mx-auto" style={{ animation: 'var(--animate-fade-up)' }}>
            <header className="flex justify-between items-center mb-7">
                <div>
                    <p className="text-xs font-semibold text-ink-faint uppercase tracking-widest">Good morning</p>
                    <h1 className="text-2xl font-extrabold text-ink tracking-tight flex items-center gap-1.5">
                        {user?.name?.split(' ')[0] || 'Friend'} <span>👋</span>
                    </h1>
                </div>
                <button className="relative w-10 h-10 rounded-full glass shadow-soft flex items-center justify-center text-ink-soft">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-health-500 rounded-full ring-2 ring-white" />
                </button>
            </header>

            {/* Quick actions */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-5 -mx-4 px-4">
                {quickActions.map(({ icon: Icon, label, to, primary }) => (
                    <motion.button
                        key={label}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(to)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-shadow ${
                            primary
                                ? 'brand-gradient text-white shadow-glow'
                                : 'bg-surface text-ink border border-line shadow-soft'
                        }`}
                    >
                        <Icon size={16} className={primary ? '' : 'text-health-600'} /> {label}
                    </motion.button>
                ))}
            </div>

            {/* Main nutrition card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-surface rounded-card p-6 shadow-soft border border-line mb-4"
            >
                <div className="flex items-center gap-2 mb-5">
                    <Activity className="text-health-600" size={16} />
                    <span className="text-xs font-bold text-ink-soft uppercase tracking-widest">Today's Energy</span>
                </div>

                <div className="flex gap-6 items-center">
                    <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                            <circle cx="72" cy="72" r={R} fill="none" stroke="var(--color-line)" strokeWidth="12" />
                            <motion.circle
                                cx="72" cy="72" r={R} fill="none" stroke="url(#grad)" strokeWidth="12"
                                strokeLinecap="round" strokeDasharray={C}
                                initial={{ strokeDashoffset: C }}
                                animate={{ strokeDashoffset: C * (1 - calPct) }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#34d399" />
                                    <stop offset="100%" stopColor="#047857" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold text-ink tracking-tight">{stats.calories.toLocaleString()}</span>
                            <span className="text-[10px] text-ink-faint uppercase font-bold tracking-widest">of {stats.target}</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <Macro label="Protein" value={stats.protein} goal={150} unit="g" pct={75} />
                        <Macro label="Carbs" value={stats.carbs} goal={260} unit="g" pct={80} />
                        <Macro label="Fat" value={stats.fat} goal={70} unit="g" pct={80} />
                    </div>
                </div>
            </motion.div>

            {/* Daily insight */}
            <div className="bg-surface rounded-card p-6 shadow-soft border border-line mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Wind className="text-health-500" size={16} />
                    <span className="text-xs font-bold text-ink-soft uppercase tracking-widest">Daily Insight</span>
                </div>
                <p className="text-ink text-sm leading-relaxed mb-4">
                    Your heart-rate variability is higher today — a great window for a high-intensity
                    session followed by deep hydration.
                </p>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-health-50 flex items-center justify-center">
                        <Sparkles className="text-health-600" size={15} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-ink">Sanctuary AI</span>
                        <span className="block text-[10px] text-ink-faint">Your wellness guide</span>
                    </div>
                </div>
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7 bg-surface rounded-card p-5 shadow-soft border border-line">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-ink uppercase tracking-widest">Movement</span>
                        <span className="text-[11px] font-bold text-health-600">See all</span>
                    </div>
                    <div className="space-y-3.5">
                        <ActivityRow icon={Activity} title="Morning Run" meta="5.2 km · 35 min" kcal="+340" />
                        <ActivityRow icon={ArrowUpRight} title="Yoga Flow" meta="Guided · 45 min" kcal="+120" />
                    </div>
                </div>

                <div className="col-span-5 brand-gradient rounded-card p-5 shadow-glow text-white relative overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Droplets size={15} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Water</span>
                    </div>
                    <p className="text-[10px] text-white/80 leading-tight mb-4">60% of your daily goal</p>
                    <div className="flex items-end gap-1 mb-4 h-12">
                        {[30, 60, 45, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/20 rounded-full relative h-full">
                                <div className="absolute bottom-0 inset-x-0 bg-white rounded-full" style={{ height: `${h}%` }} />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold">{stats.hydration.toFixed(1)}</span>
                        <span className="text-xs font-bold text-white/70">/ 3.0 L</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Macro = ({ label, value, goal, unit, pct }) => (
    <div>
        <div className="flex justify-between items-end mb-1">
            <span className="text-[11px] font-semibold text-ink-soft">{label}</span>
            <span className="text-[11px] font-bold text-ink">{value}{unit} <span className="text-ink-faint font-medium">/ {goal}{unit}</span></span>
        </div>
        <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
            <motion.div
                className="h-full brand-gradient rounded-full"
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </div>
    </div>
);

const ActivityRow = ({ icon: Icon, title, meta, kcal }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-health-50 flex items-center justify-center">
                <Icon className="text-health-600" size={16} />
            </div>
            <div>
                <span className="block text-xs font-bold text-ink">{title}</span>
                <span className="block text-[10px] text-ink-faint">{meta}</span>
            </div>
        </div>
        <span className="text-[11px] font-bold text-health-600">{kcal}</span>
    </div>
);

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare, Utensils, Calendar, Activity, Target, Flame, Bell, Sparkles, Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/api';

const isToday = (d) => {
    const date = new Date(d);
    const now = new Date();
    return date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate();
};

const sum = (arr, key) => arr.reduce((t, m) => t + (Number(m[key]) || 0), 0);

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);

    // Always pull fresh data from the database so the dashboard reflects what's
    // actually stored (survives logout / server restarts).
    useEffect(() => {
        if (!user?._id) { setLoaded(true); return; }
        let cancelled = false;
        (async () => {
            try {
                const res = await authService.getProfile(user._id);
                if (!cancelled) setData(res.data);
            } catch {
                if (!cancelled) setData(user); // fall back to cached login data
            } finally {
                if (!cancelled) setLoaded(true);
            }
        })();
        return () => { cancelled = true; };
    }, [user._id]);

    const profile = data?.profile || {};
    const meals = data?.mealHistory || [];
    const todayMeals = meals.filter((m) => isToday(m.date));

    const target = profile.caloriesTarget || 2000;
    const calories = Math.round(sum(todayMeals, 'calories'));
    const calPct = Math.min(calories / target, 1);

    const proteinTarget = profile.proteinTarget || 150;
    const carbsTarget = Math.round((target * 0.45) / 4);
    const fatTarget = Math.round((target * 0.25) / 9);
    const protein = Math.round(sum(todayMeals, 'protein'));
    const carbs = Math.round(sum(todayMeals, 'carbs'));
    const fat = Math.round(sum(todayMeals, 'fat'));

    const R = 60, C = 2 * Math.PI * R;

    // Weight-goal progress (start → current → target)
    const hasGoal = profile.goal && profile.goal !== 'maintain' && profile.targetWeight;
    let goalPct = null;
    if (hasGoal && profile.startWeight) {
        const total = Math.abs(profile.targetWeight - profile.startWeight) || 1;
        const done = profile.goal === 'lose weight'
            ? profile.startWeight - profile.weight
            : profile.weight - profile.startWeight;
        goalPct = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
    }

    const quickActions = [
        { icon: MessageSquare, label: 'Ask AI', to: '/chat', primary: true },
        { icon: Utensils, label: 'Log Meal', to: '/meal' },
        { icon: Calendar, label: 'Workout', to: '/workout' },
    ];

    const recent = [...meals].reverse().slice(0, 4);

    return (
        <div className="pb-28 pt-6 px-4 max-w-lg mx-auto" style={{ animation: 'var(--animate-fade-up)' }}>
            <header className="flex justify-between items-center mb-7">
                <div>
                    <p className="text-xs font-semibold text-ink-faint uppercase tracking-widest">Welcome back</p>
                    <h1 className="text-2xl font-extrabold text-ink tracking-tight flex items-center gap-1.5">
                        {data?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Friend'} <span>👋</span>
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
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Activity className="text-health-600" size={16} />
                        <span className="text-xs font-bold text-ink-soft uppercase tracking-widest">Today's Energy</span>
                    </div>
                    {!loaded && <Loader2 size={14} className="animate-spin text-ink-faint" />}
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
                            <span className="text-2xl font-extrabold text-ink tracking-tight">{calories.toLocaleString()}</span>
                            <span className="text-[10px] text-ink-faint uppercase font-bold tracking-widest">of {target.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <Macro label="Protein" value={protein} goal={proteinTarget} unit="g" />
                        <Macro label="Carbs" value={carbs} goal={carbsTarget} unit="g" />
                        <Macro label="Fat" value={fat} goal={fatTarget} unit="g" />
                    </div>
                </div>
                {todayMeals.length === 0 && loaded && (
                    <p className="text-xs text-ink-faint text-center mt-4">
                        No meals logged today — <button onClick={() => navigate('/meal')} className="text-health-600 font-bold">analyze one</button> to fill this in.
                    </p>
                )}
            </motion.div>

            {/* Weight goal */}
            {hasGoal ? (
                <div className="bg-ink rounded-card p-6 shadow-float relative overflow-hidden mb-4">
                    <div className="absolute -top-12 -right-10 w-36 h-36 bg-health-500/25 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="text-health-300" size={15} />
                            <span className="text-[11px] font-bold text-health-300 uppercase tracking-widest">Weight goal</span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight mb-1">
                            {profile.goal === 'lose weight' ? 'Lose' : 'Gain'} to {profile.targetWeight} kg
                        </h3>
                        <p className="text-xs text-white/60 mb-5">
                            {profile.startWeight || profile.weight} kg → {profile.targetWeight} kg
                            {profile.deadline ? ` · by ${new Date(profile.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-white/15 h-2 rounded-full overflow-hidden">
                                <motion.div className="h-full brand-gradient rounded-full"
                                    initial={{ width: 0 }} animate={{ width: `${goalPct ?? 0}%` }}
                                    transition={{ duration: 0.9, ease: 'easeOut' }} />
                            </div>
                            <span className="text-xs font-bold text-white whitespace-nowrap">{goalPct ?? 0}%</span>
                        </div>
                    </div>
                </div>
            ) : loaded && (
                <button
                    onClick={() => navigate('/profile')}
                    className="w-full bg-surface border border-line rounded-card p-5 shadow-soft mb-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
                >
                    <div className="w-10 h-10 rounded-xl bg-health-50 flex items-center justify-center">
                        <Target className="text-health-600" size={18} />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-ink">Set a weight goal</span>
                        <span className="block text-xs text-ink-soft">Add your target in Profile to track progress here.</span>
                    </div>
                </button>
            )}

            {/* Recent meals */}
            <div className="bg-surface rounded-card p-6 shadow-soft border border-line">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-ink uppercase tracking-widest">Recent Meals</span>
                    <button onClick={() => navigate('/meal')} className="text-[11px] font-bold text-health-600">Add meal</button>
                </div>
                {recent.length > 0 ? (
                    <div className="space-y-3.5">
                        {recent.map((m, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-health-50 flex items-center justify-center flex-shrink-0">
                                        <Utensils className="text-health-600" size={15} />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-bold text-ink truncate">{m.food || 'Meal'}</span>
                                        <span className="block text-[10px] text-ink-faint">
                                            {m.protein || 0}g P · {m.carbs || 0}g C · {m.fat || 0}g F
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[11px] font-bold text-health-600 whitespace-nowrap flex items-center gap-1">
                                    <Flame size={12} /> {Math.round(m.calories || 0)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-12 h-12 rounded-2xl bg-health-50 flex items-center justify-center mb-3">
                            <Utensils className="text-health-600" size={20} />
                        </div>
                        <p className="text-xs text-ink-faint max-w-[220px]">No meals yet. Analyze your first meal and it'll show up here.</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 text-ink-faint">
                <Sparkles size={13} className="text-health-500" />
                <span className="text-[11px] font-semibold">Sanctuary AI · your wellness guide</span>
            </div>
        </div>
    );
};

const Macro = ({ label, value, goal, unit }) => {
    const pct = Math.min((value / (goal || 1)) * 100, 100);
    return (
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
};

export default Dashboard;

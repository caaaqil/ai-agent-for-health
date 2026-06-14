import React, { useState } from 'react';
import { Settings, Zap, Wind, Flame, Coffee, Target, Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamPost } from '../services/api';
import AppHeader from '../components/AppHeader';

/* Static style map — Tailwind can't see dynamically built class strings,
   so each variant must be a complete, literal class set. */
const TYPE_STYLE = {
    strength: { tile: 'bg-health-100 text-health-700', icon: Zap },
    cardio: { tile: 'bg-sky-100 text-sky-600', icon: Target },
    rest: { tile: 'bg-amber-100 text-amber-600', icon: Coffee },
    yoga: { tile: 'bg-violet-100 text-violet-600', icon: Wind },
    hiit: { tile: 'bg-orange-100 text-orange-600', icon: Flame },
};

const SCHEDULE = [
    { day: 'Mon', type: 'Chest', kind: 'strength', sub: 'Hypertrophy', dur: '60m' },
    { day: 'Tue', type: 'Cardio', kind: 'cardio', sub: 'Steady flow', dur: '45m' },
    { day: 'Wed', type: 'Rest', kind: 'rest', sub: 'Recovery', dur: '—' },
    { day: 'Thu', type: 'Back', kind: 'strength', sub: 'Posture', dur: '50m' },
    { day: 'Fri', type: 'Yoga', kind: 'yoga', sub: 'Mobility', dur: '30m' },
    { day: 'Sat', type: 'HIIT', kind: 'hiit', sub: 'Peak', dur: '35m' },
    { day: 'Sun', type: 'Legs', kind: 'strength', sub: 'Power', dur: '75m' },
];

const GOALS = [
    { id: 'muscle', label: 'Build Muscle' },
    { id: 'fat-loss', label: 'Lose Fat' },
    { id: 'endurance', label: 'Endurance' },
];

const WorkoutPlanner = ({ user }) => {
    const [goal, setGoal] = useState('muscle');
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);

    const generatePlan = async () => {
        if (loading) return;
        setLoading(true);
        setPlan('');
        try {
            await streamPost('/ai/generate-workout', { userId: user._id, goal }, setPlan);
        } catch {
            setPlan("Couldn't reach the AI service. Make sure Ollama is running, then try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-28 pt-6 px-4 max-w-lg mx-auto" style={{ animation: 'var(--animate-fade-up)' }}>
            <AppHeader
                right={<Settings className="text-ink-soft w-5 h-5 cursor-pointer" />}
            />

            <div className="mb-6">
                <span className="text-[11px] font-bold text-ink-faint uppercase tracking-widest">Weekly momentum</span>
                <h1 className="text-3xl font-extrabold text-ink tracking-tight mt-1">Your Workout Plan</h1>
            </div>

            {/* Effort highlight */}
            <div className="brand-gradient rounded-card p-6 shadow-glow text-white relative overflow-hidden mb-6">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest block mb-1">Total effort this week</span>
                <span className="text-4xl font-extrabold">5.5 <span className="text-xl font-bold text-white/80">hrs</span></span>
                <p className="text-xs text-white/80 mt-2 max-w-[240px]">A balanced sequence aligning physical vitality with mental clarity.</p>
            </div>

            {/* Week schedule */}
            <div className="flex gap-2.5 mb-8 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                {SCHEDULE.map((d) => {
                    const { tile, icon: Icon } = TYPE_STYLE[d.kind];
                    return (
                        <div key={d.day} className="min-w-[92px] bg-surface rounded-3xl p-4 flex flex-col items-center text-center shadow-soft border border-line flex-shrink-0">
                            <span className="text-[10px] font-bold text-ink-faint uppercase tracking-widest mb-3">{d.day}</span>
                            <div className={`w-9 h-9 rounded-2xl ${tile} flex items-center justify-center mb-3`}>
                                <Icon size={16} />
                            </div>
                            <span className="text-xs font-bold text-ink">{d.type}</span>
                            <span className="text-[10px] text-ink-faint mb-2">{d.sub}</span>
                            <span className="text-[11px] font-bold text-ink mt-auto">{d.dur}</span>
                        </div>
                    );
                })}
            </div>

            {/* AI plan generator */}
            <div className="bg-surface rounded-card p-6 shadow-soft border border-line mb-6">
                <h3 className="text-base font-bold text-ink mb-1">Generate a plan with AI</h3>
                <p className="text-xs text-ink-soft mb-4">Pick a goal and let Sanctuary build a tailored routine.</p>

                <div className="flex gap-2 mb-4">
                    {GOALS.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => setGoal(g.id)}
                            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                                goal === g.id
                                    ? 'brand-gradient text-white shadow-glow'
                                    : 'bg-canvas text-ink-soft border border-line'
                            }`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={generatePlan}
                    disabled={loading}
                    className="w-full brand-gradient text-white text-sm font-bold py-3.5 rounded-2xl shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {loading ? <Loader2 size={17} className="animate-spin" /> : <><Play size={16} /> Generate Plan</>}
                </motion.button>

                <AnimatePresence>
                    {plan && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 bg-canvas rounded-2xl p-4 text-sm text-ink leading-relaxed whitespace-pre-wrap border border-line">
                                {plan}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Today's session */}
            <div className="bg-ink rounded-card p-7 shadow-float relative overflow-hidden">
                <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-health-500/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                    <span className="text-[11px] font-bold text-health-300 uppercase tracking-widest">Today's focus</span>
                    <h3 className="text-xl font-extrabold text-white mt-1 mb-2">Deep Resilience</h3>
                    <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-[260px]">
                        Your readiness is high today — a perfect window to push an extra 10% in your HIIT session.
                    </p>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 brand-gradient text-white px-6 py-3 rounded-full text-sm font-bold shadow-glow"
                    >
                        <Play size={16} /> Start session
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutPlanner;

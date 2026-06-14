import React from 'react';
import { Settings, Edit2, Scale, Ruler, Zap, Award, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../components/AppHeader';

const WEEK = [
    { day: 'Mon', h: 40 }, { day: 'Tue', h: 65 }, { day: 'Wed', h: 95 },
    { day: 'Thu', h: 45 }, { day: 'Fri', h: 85 }, { day: 'Sat', h: 30 }, { day: 'Sun', h: 55 },
];

const Profile = ({ user, onLogout }) => {
    return (
        <div className="pb-28 pt-6 px-4 max-w-lg mx-auto" style={{ animation: 'var(--animate-fade-up)' }}>
            <AppHeader right={<Settings className="text-ink-soft w-5 h-5 cursor-pointer" />} />

            {/* Identity */}
            <div className="flex items-center gap-4 mb-7">
                <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center shadow-glow text-white text-2xl font-extrabold">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <span className="text-[11px] font-bold text-ink-faint uppercase tracking-widest">Wellness profile</span>
                    <h1 className="text-2xl font-extrabold text-ink tracking-tight truncate">{user?.name || 'Your Name'}</h1>
                    <p className="text-xs text-ink-soft truncate">{user?.email || 'Cultivating balance daily'}</p>
                </div>
            </div>

            <button className="w-full mb-6 brand-gradient text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-glow">
                <Edit2 size={15} /> Edit Profile
            </button>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <StatCard icon={Scale} iconColor="text-health-600" iconBg="bg-health-50"
                    label="Current Weight" value="64.2" unit="kg" foot="−2.1 kg this month" />
                <StatCard icon={Ruler} iconColor="text-sky-500" iconBg="bg-sky-50"
                    label="Height" value="172" unit="cm" foot="BMI 21.7 · Healthy" />
            </div>

            {/* Primary goal */}
            <div className="bg-ink rounded-card p-6 shadow-float relative overflow-hidden mb-6">
                <div className="absolute -top-12 -right-10 w-36 h-36 bg-health-500/25 rounded-full blur-2xl" />
                <div className="relative z-10">
                    <span className="text-[11px] font-bold text-health-300 uppercase tracking-widest block mb-2">Primary goal</span>
                    <h3 className="text-lg font-bold text-white leading-tight mb-5">Marathon Readiness &amp; Recovery</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/15 h-2 rounded-full overflow-hidden">
                            <motion.div className="h-full brand-gradient rounded-full"
                                initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                        </div>
                        <span className="text-xs font-bold text-white whitespace-nowrap">65%</span>
                    </div>
                </div>
            </div>

            {/* Weekly chart */}
            <div className="bg-surface rounded-card p-6 shadow-soft border border-line mb-6">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-bold text-ink">Weekly Vitality</h3>
                    <span className="text-[11px] font-bold text-health-600 bg-health-50 px-2.5 py-1 rounded-full">Energy</span>
                </div>
                <div className="flex items-end justify-between h-36 gap-2">
                    {WEEK.map(({ day, h }, i) => {
                        const peak = h >= 85;
                        return (
                            <div key={day} className="flex-1 flex flex-col items-center gap-2.5">
                                <div className="w-full bg-canvas rounded-full relative overflow-hidden" style={{ height: '110px' }}>
                                    <motion.div
                                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
                                        className={`absolute bottom-0 inset-x-0 rounded-full ${peak ? 'brand-gradient' : 'bg-health-200'}`}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-ink-faint">{day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 gap-4 mb-6">
                <InsightCard icon={Zap} title="Restorative Insight"
                    text="Your mid-week consistency makes Wednesday your power pivot — schedule demanding sessions then." accent />
                <InsightCard icon={Award} title="Milestone Reached"
                    text="12 consecutive recovery sessions logged. Your HRV has improved 12% this month." />
            </div>

            <button
                onClick={onLogout}
                className="w-full py-3.5 text-sm font-bold text-red-500 bg-surface border border-line rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            >
                <LogOut size={16} /> Sign Out
            </button>
        </div>
    );
};

const StatCard = ({ icon: Icon, iconColor, iconBg, label, value, unit, foot }) => (
    <div className="bg-surface rounded-card p-5 shadow-soft border border-line">
        <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
            <Icon className={iconColor} size={16} />
        </div>
        <span className="text-[10px] font-bold text-ink-faint uppercase tracking-widest block mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-ink">{value}</span>
            <span className="text-xs font-bold text-ink-faint">{unit}</span>
        </div>
        <span className="text-[10px] font-semibold text-health-600 mt-1.5 block">{foot}</span>
    </div>
);

const InsightCard = ({ icon: Icon, title, text, accent }) => (
    <div className={`rounded-card p-5 border ${accent ? 'bg-health-50 border-health-100' : 'bg-surface border-line shadow-soft'}`}>
        <div className="flex items-center gap-2 mb-2.5">
            <Icon size={15} className="text-health-600" />
            <span className="text-[11px] font-bold text-health-700 uppercase tracking-widest">{title}</span>
        </div>
        <p className="text-sm text-ink-soft leading-relaxed">{text}</p>
    </div>
);

export default Profile;

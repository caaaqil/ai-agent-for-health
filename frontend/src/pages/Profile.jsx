import React, { useState, useEffect } from 'react';
import { Settings, Edit2, Scale, Ruler, Cake, Target, LogOut, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../components/AppHeader';
import { authService } from '../services/api';

const GOAL_LABELS = {
    'lose weight': 'Lose weight',
    'gain muscle': 'Gain muscle',
    'maintain': 'Maintain',
};

// How close the user is to their target weight, as 0–100%.
const goalProgress = (p) => {
    const { goal, startWeight, weight, targetWeight } = p;
    if (goal === 'maintain' || !startWeight || !targetWeight) return null;
    const total = Math.abs(targetWeight - startWeight);
    if (total === 0) return 100;
    const done = goal === 'lose weight' ? startWeight - weight : weight - startWeight;
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
};

// Someone may type their height in metres (1.75) instead of cm (175) — normalise it.
const toCm = (h) => (h > 0 && h < 3 ? Math.round(h * 100) : h);

const bmiInfo = (weight, height) => {
    if (!weight || !height) return null;
    const cm = toCm(height);
    const bmi = weight / ((cm / 100) ** 2);
    let label = 'Healthy';
    if (bmi < 18.5) label = 'Underweight';
    else if (bmi >= 25 && bmi < 30) label = 'Overweight';
    else if (bmi >= 30) label = 'Obese';
    return { value: bmi.toFixed(1), label };
};

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null);

const Profile = ({ user, setUser, onLogout }) => {
    const [editing, setEditing] = useState(false);

    // Refresh from the database on open so the profile always reflects what's
    // stored (heals stale browser data without needing to log out/in).
    useEffect(() => {
        if (!user?._id) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await authService.getProfile(user._id);
                if (!cancelled) setUser((u) => ({ ...u, ...res.data }));
            } catch {
                /* keep cached data */
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user._id]);

    const p = user?.profile || {};
    const bmi = bmiInfo(p.weight, p.height);
    const progress = goalProgress(p);

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
                    <p className="text-xs text-ink-soft truncate">{user?.email}</p>
                </div>
            </div>

            <button
                onClick={() => setEditing(true)}
                className="w-full mb-6 brand-gradient text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-glow active:scale-[0.99] transition-transform"
            >
                <Edit2 size={15} /> Edit Profile &amp; Goal
            </button>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <StatCard icon={Scale} iconColor="text-health-600" iconBg="bg-health-50"
                    label="Current Weight" value={p.weight || '—'} unit={p.weight ? 'kg' : ''}
                    foot={p.startWeight ? `Started at ${p.startWeight} kg` : 'Set your weight'} />
                <StatCard icon={Ruler} iconColor="text-sky-500" iconBg="bg-sky-50"
                    label="Height" value={p.height ? toCm(p.height) : '—'} unit={p.height ? 'cm' : ''}
                    foot={bmi ? `BMI ${bmi.value} · ${bmi.label}` : 'Set your height'} />
                <StatCard icon={Cake} iconColor="text-amber-500" iconBg="bg-amber-50"
                    label="Age" value={p.age || '—'} unit={p.age ? 'yrs' : ''}
                    foot={p.age ? 'Years young' : 'Set your age'} />
                <StatCard icon={Target} iconColor="text-violet-500" iconBg="bg-violet-50"
                    label="Target Weight" value={p.targetWeight || '—'} unit={p.targetWeight ? 'kg' : ''}
                    foot={p.deadline ? `By ${fmtDate(p.deadline)}` : 'Set a target'} />
            </div>

            {/* Primary goal */}
            <div className="bg-ink rounded-card p-6 shadow-float relative overflow-hidden mb-6">
                <div className="absolute -top-12 -right-10 w-36 h-36 bg-health-500/25 rounded-full blur-2xl" />
                <div className="relative z-10">
                    <span className="text-[11px] font-bold text-health-300 uppercase tracking-widest block mb-2">Primary goal</span>
                    <h3 className="text-lg font-bold text-white leading-tight mb-1">{GOAL_LABELS[p.goal] || 'Maintain'}</h3>
                    {p.goal !== 'maintain' && p.targetWeight ? (
                        <>
                            <p className="text-xs text-white/60 mb-5">
                                {p.startWeight || p.weight} kg → {p.targetWeight} kg
                                {p.deadline ? ` · by ${fmtDate(p.deadline)}` : ''}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-white/15 h-2 rounded-full overflow-hidden">
                                    <motion.div className="h-full brand-gradient rounded-full"
                                        initial={{ width: 0 }} animate={{ width: `${progress ?? 0}%` }}
                                        transition={{ duration: 0.9, ease: 'easeOut' }} />
                                </div>
                                <span className="text-xs font-bold text-white whitespace-nowrap">{progress ?? 0}%</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-white/60">Tap “Edit Profile &amp; Goal” to set a weight target and deadline.</p>
                    )}
                </div>
            </div>

            <button
                onClick={onLogout}
                className="w-full py-3.5 text-sm font-bold text-red-500 bg-surface border border-line rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            >
                <LogOut size={16} /> Sign Out
            </button>

            <AnimatePresence>
                {editing && (
                    <EditModal
                        user={user}
                        setUser={setUser}
                        onClose={() => setEditing(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const EditModal = ({ user, setUser, onClose }) => {
    const p = user?.profile || {};
    const [form, setForm] = useState({
        age: p.age || '',
        weight: p.weight || '',
        height: p.height || '',
        goal: p.goal || 'maintain',
        targetWeight: p.targetWeight || '',
        deadline: p.deadline ? new Date(p.deadline).toISOString().slice(0, 10) : '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const payload = {
                age: Number(form.age) || 0,
                weight: Number(form.weight) || 0,
                height: toCm(Number(form.height)) || 0,
                goal: form.goal,
                targetWeight: form.goal === 'maintain' ? 0 : Number(form.targetWeight) || 0,
                deadline: form.goal === 'maintain' ? null : form.deadline || null,
            };
            const res = await authService.updateProfile(user._id, payload);
            // Keep auth fields (token/email/name) and merge the fresh profile back in.
            setUser({ ...user, ...res.data });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save. Make sure the backend is running.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="bg-surface w-full max-w-lg rounded-t-card sm:rounded-card p-6 shadow-float max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-extrabold text-ink">Edit profile &amp; goal</h2>
                    <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
                </div>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100">{error}</div>
                )}

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <NumField icon={Cake} label="Age" value={form.age} onChange={set('age')} suffix="yrs" />
                    <NumField icon={Scale} label="Weight" value={form.weight} onChange={set('weight')} suffix="kg" />
                    <NumField icon={Ruler} label="Height" value={form.height} onChange={set('height')} suffix="cm" />
                </div>

                <label className="block text-xs font-semibold text-ink-soft mb-1.5 ml-1">My goal</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.entries(GOAL_LABELS).map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, goal: value }))}
                            className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                                form.goal === value
                                    ? 'brand-gradient text-white border-transparent shadow-glow'
                                    : 'bg-canvas text-ink-soft border-line'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {form.goal !== 'maintain' && (
                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <NumField icon={Target} label="Target weight" value={form.targetWeight} onChange={set('targetWeight')} suffix="kg" />
                        <div>
                            <label className="block text-xs font-semibold text-ink-soft mb-1.5 ml-1">Deadline</label>
                            <input
                                type="date"
                                value={form.deadline}
                                onChange={set('deadline')}
                                className="w-full px-3 py-3 bg-white/80 border border-line rounded-2xl text-sm text-ink focus:bg-white focus:border-health-400 focus:ring-4 focus:ring-health-100 focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                {form.goal !== 'maintain' && form.weight && form.targetWeight && (
                    <p className="text-xs text-ink-soft mb-4 ml-1">
                        {form.goal === 'lose weight' ? 'Cutting' : 'Gaining'}{' '}
                        <span className="font-bold text-health-700">
                            {Math.abs(Number(form.weight) - Number(form.targetWeight)).toFixed(1)} kg
                        </span>
                        {form.deadline ? ` by ${fmtDate(form.deadline)}` : ''}.
                    </p>
                )}

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full mt-3 py-3.5 brand-gradient text-white font-bold text-sm rounded-2xl shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save changes'}
                </button>
            </motion.div>
        </motion.div>
    );
};

const NumField = ({ icon: Icon, label, value, onChange, suffix }) => (
    <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5 ml-1">{label}</label>
        <div className="relative">
            <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
            <input
                type="number"
                value={value}
                onChange={onChange}
                placeholder="0"
                className="w-full pl-9 pr-9 py-3 bg-white/80 border border-line rounded-2xl text-sm text-ink placeholder:text-ink-faint focus:bg-white focus:border-health-400 focus:ring-4 focus:ring-health-100 focus:outline-none transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-faint pointer-events-none">{suffix}</span>
        </div>
    </div>
);

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

export default Profile;

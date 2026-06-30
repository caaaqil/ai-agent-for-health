import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, ChevronRight, Flame, Beef, Droplet, Wheat, Loader2, X, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { authService } from '../services/api';
import AppHeader from '../components/AppHeader';

const MealAnalyzer = ({ user }) => {
    const [mealText, setMealText] = useState('');
    const [image, setImage] = useState(null); // data URL for preview + upload
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const fileInputRef = useRef(null);

    // Load previously analyzed meals from the database so they persist across sessions.
    const loadHistory = async () => {
        if (!user?._id) return;
        try {
            const res = await authService.getProfile(user._id);
            setHistory([...(res.data.mealHistory || [])].reverse());
        } catch {
            /* ignore — just show no history */
        }
    };

    useEffect(() => { loadHistory(); }, [user._id]);

    const onPickImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(file);
    };

    const analyze = async (e) => {
        e.preventDefault();
        if ((!mealText.trim() && !image) || loading) return;
        setLoading(true);
        try {
            const res = await api.post('/ai/analyze-meal', {
                userId: user._id,
                foodText: mealText.trim() || undefined,
                image: image || undefined,
            });
            setResult(res.data);
            loadHistory(); // the meal was just saved — refresh the list
            setMealText('');
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setResult({
                calories: 642, protein: 32, fat: 24, carbs: 48,
                note: err.response?.data?.message || "Couldn't reach the AI service — showing a sample analysis. Make sure Ollama is running.",
            });
        } finally {
            setLoading(false);
        }
    };

    const macros = result && [
        { icon: Beef, label: 'Protein', value: result.protein ?? 32, color: 'text-rose-500', bg: 'bg-rose-50' },
        { icon: Droplet, label: 'Fats', value: result.fat ?? 24, color: 'text-amber-500', bg: 'bg-amber-50' },
        { icon: Wheat, label: 'Carbs', value: result.carbs ?? 48, color: 'text-health-600', bg: 'bg-health-50' },
    ];

    return (
        <div className="pb-28 pt-6 px-4 max-w-lg mx-auto" style={{ animation: 'var(--animate-fade-up)' }}>
            <AppHeader
                right={
                    <div className="w-9 h-9 rounded-full glass shadow-soft flex items-center justify-center text-health-600">
                        <Sparkles size={16} />
                    </div>
                }
            />

            <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-ink tracking-tight">Nourish your body</h1>
                <p className="text-ink-soft text-sm mt-1.5">Describe a meal and get instant nutrition insights.</p>
            </div>

            {/* Input card */}
            <form onSubmit={analyze} className="bg-surface rounded-card p-5 shadow-soft border border-line mb-4">
                <textarea
                    value={mealText}
                    onChange={(e) => setMealText(e.target.value)}
                    placeholder="e.g. Grilled salmon with avocado and brown rice"
                    rows={3}
                    className="w-full text-sm text-ink bg-transparent resize-none focus:outline-none placeholder:text-ink-faint"
                />

                {image && (
                    <div className="relative mt-2 mb-1 w-24 h-24 rounded-2xl overflow-hidden border border-line">
                        <img src={image} alt="meal preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ink/70 text-white flex items-center justify-center"
                            aria-label="Remove image"
                        >
                            <X size={13} />
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onPickImage}
                    className="hidden"
                />

                <div className="flex items-center gap-2 mt-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-11 h-11 rounded-2xl bg-canvas border border-line flex items-center justify-center text-ink-soft hover:text-health-600 transition-colors flex-shrink-0"
                        aria-label="Add photo"
                    >
                        <Camera size={18} />
                    </button>
                    <button
                        type="submit"
                        disabled={loading || (!mealText.trim() && !image)}
                        className="flex-1 brand-gradient text-white text-sm font-bold py-3 rounded-2xl shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <Loader2 size={17} className="animate-spin" /> : <>Analyze Meal <ChevronRight size={16} /></>}
                    </button>
                </div>
            </form>

            {/* Result */}
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="bg-surface rounded-card p-6 shadow-soft border border-line">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <span className="text-[11px] font-bold text-ink-faint uppercase tracking-widest block">Total Energy</span>
                                    <div className="flex items-baseline gap-1.5 mt-1">
                                        <span className="text-4xl font-extrabold text-ink tracking-tight">{result.calories ?? 642}</span>
                                        <span className="text-sm font-bold text-ink-faint">kcal</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center shadow-glow">
                                    <Flame className="text-white" size={22} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {macros.map(({ icon: Icon, label, value, color, bg }) => (
                                    <div key={label} className="bg-canvas rounded-2xl p-3 text-center">
                                        <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                                            <Icon className={color} size={15} />
                                        </div>
                                        <span className="block text-lg font-extrabold text-ink leading-none">{value}<span className="text-xs text-ink-faint">g</span></span>
                                        <span className="block text-[10px] font-semibold text-ink-faint uppercase tracking-wide mt-1">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-health-50 rounded-card p-5 border border-health-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="text-health-600" size={15} />
                                <span className="text-[11px] font-bold text-health-700 uppercase tracking-widest">Sanctuary Tip</span>
                            </div>
                            <p className="text-sm text-health-900/80 leading-relaxed">
                                {result.note || 'Rich in Omega-3 fatty acids — excellent for cognitive recovery and reducing inflammation after training.'}
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-surface/60 border-2 border-dashed border-line rounded-card py-12 flex flex-col items-center text-center px-6"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-health-50 flex items-center justify-center mb-4">
                            <Camera className="text-health-600" size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-ink">No analysis yet</h3>
                        <p className="text-xs text-ink-faint mt-1 max-w-[220px]">Describe what you ate above and we'll break down the nutrition for you.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Saved meal history */}
            {history.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <History size={15} className="text-ink-soft" />
                        <span className="text-[11px] font-bold text-ink-soft uppercase tracking-widest">Meal History</span>
                    </div>
                    <div className="space-y-2.5">
                        {history.map((m, i) => (
                            <div key={i} className="bg-surface rounded-2xl p-4 shadow-soft border border-line flex items-center justify-between">
                                <div className="min-w-0">
                                    <span className="block text-sm font-bold text-ink truncate">{m.food || 'Meal'}</span>
                                    <span className="block text-[11px] text-ink-faint mt-0.5">
                                        {m.protein || 0}g P · {m.carbs || 0}g C · {m.fat || 0}g F
                                        {m.date ? ` · ${new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-health-600 whitespace-nowrap flex items-center gap-1 ml-3">
                                    <Flame size={13} /> {Math.round(m.calories || 0)} kcal
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealAnalyzer;

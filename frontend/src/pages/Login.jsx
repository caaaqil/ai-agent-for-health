import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Leaf, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authService.login({ email, password });
            setUser(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                {/* Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center shadow-glow mb-5">
                        <Leaf className="text-white" size={30} strokeWidth={2.2} />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-ink">Welcome back</h1>
                    <p className="text-ink-soft text-sm mt-1.5">Sign in to your wellness sanctuary</p>
                </div>

                <div className="glass rounded-card shadow-float p-7">
                    {error && (
                        <div className="p-3 mb-5 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field
                            icon={<Mail size={17} />}
                            type="email"
                            label="Email"
                            value={email}
                            onChange={setEmail}
                            placeholder="you@example.com"
                        />
                        <Field
                            icon={<Lock size={17} />}
                            type="password"
                            label="Password"
                            value={password}
                            onChange={setPassword}
                            placeholder="••••••••"
                        />

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 brand-gradient text-white font-bold text-sm rounded-2xl shadow-glow flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>
                </div>

                <p className="mt-7 text-center text-sm text-ink-soft">
                    New here?{' '}
                    <Link to="/register" className="text-health-700 font-bold hover:text-health-800">
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

const Field = ({ icon, label, type, value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5 ml-1">{label}</label>
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">
                {icon}
            </span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/80 border border-line rounded-2xl text-sm text-ink placeholder:text-ink-faint focus:bg-white focus:border-health-400 focus:ring-4 focus:ring-health-100 focus:outline-none transition-all"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

export default Login;

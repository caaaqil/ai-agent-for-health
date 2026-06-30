import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Flame, Utensils, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamPost, authService } from '../services/api';
import AppHeader from '../components/AppHeader';

const SUGGESTIONS = [
    { icon: Flame, label: 'Create a workout plan', prompt: 'Create a workout plan for me.' },
    { icon: Utensils, label: 'Calories in rice?', prompt: 'How many calories are in a cup of cooked rice?' },
];

const GREETING = {
    role: 'assistant',
    content: "Hi! I'm your Sanctuary guide. I can build workouts, analyze meals, or answer any health question. What's on your mind today?",
};

const Chat = ({ user }) => {
    const [messages, setMessages] = useState([GREETING]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Load this user's saved chat history once when the page opens, so past
    // conversations reappear instead of resetting every time you switch tabs.
    useEffect(() => {
        if (!user?._id) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await authService.getProfile(user._id);
                const history = (res.data.chatHistory || []).map((m) => ({ role: m.role, content: m.content }));
                if (!cancelled && history.length) setMessages([GREETING, ...history]);
            } catch {
                /* keep the greeting if history can't be loaded */
            }
        })();
        return () => { cancelled = true; };
    }, [user._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const send = async (text) => {
        const content = (text ?? input).trim();
        if (!content || loading) return;

        setMessages((prev) => [...prev, { role: 'user', content }]);
        setInput('');
        setLoading(true);

        let started = false;
        const upsertAssistant = (text) => {
            setMessages((prev) => {
                if (!started) { started = true; return [...prev, { role: 'assistant', content: text }]; }
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: text };
                return copy;
            });
        };

        try {
            await streamPost('/ai/chat', { userId: user._id, message: content }, upsertAssistant);
        } catch {
            upsertAssistant("I'm having trouble reaching my brain right now. Please make sure the AI service (Ollama) is running and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => { e.preventDefault(); send(); };

    return (
        <div className="pt-6 px-4 max-w-lg mx-auto flex flex-col h-screen">
            <AppHeader
                right={
                    <div className="w-9 h-9 rounded-full glass shadow-soft flex items-center justify-center text-health-600">
                        <Sparkles size={16} />
                    </div>
                }
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scroll-slim -mx-1 px-1 space-y-4 pb-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && <Avatar />}
                            <div
                                className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-soft ${
                                    msg.role === 'user'
                                        ? 'brand-gradient text-white rounded-3xl rounded-br-md'
                                        : 'bg-surface text-ink border border-line rounded-3xl rounded-bl-md'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex items-end gap-2.5 justify-start">
                        <Avatar />
                        <div className="bg-surface border border-line rounded-3xl rounded-bl-md px-4 py-3.5 shadow-soft flex items-center gap-1.5">
                            {[0, 0.15, 0.3].map((d) => (
                                <span key={d} className="w-1.5 h-1.5 bg-health-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips (only before the first user message) */}
            {messages.length === 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
                    {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
                        <button
                            key={label}
                            onClick={() => send(prompt)}
                            className="flex items-center gap-2 bg-surface text-ink px-3.5 py-2 rounded-full whitespace-nowrap text-xs font-semibold border border-line shadow-soft flex-shrink-0 active:scale-95 transition-transform"
                        >
                            <Icon size={14} className="text-health-600" /> {label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input bar */}
            <form onSubmit={handleSubmit} className="pb-5 pt-1">
                <div className="glass rounded-full p-2 pl-5 shadow-float flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your health…"
                        className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        aria-label="Send"
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                            input.trim() && !loading
                                ? 'brand-gradient text-white shadow-glow'
                                : 'bg-line text-ink-faint'
                        }`}
                    >
                        <ArrowUp size={19} />
                    </button>
                </div>
            </form>
        </div>
    );
};

const Avatar = () => (
    <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center flex-shrink-0 shadow-soft">
        <Sparkles className="text-white" size={14} />
    </div>
);

export default Chat;

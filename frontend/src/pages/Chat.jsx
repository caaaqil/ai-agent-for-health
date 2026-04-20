import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Flame, Utensils, Plus, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Chat = ({ user }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "I've analyzed your sleep data from last night. Your REM cycle was slightly shorter than usual. Would you like to try a low-intensity mobility flow this morning to gently wake up your nervous system?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { userId: user._id, message: input });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my brain right now. Please ensure Ollama is running." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto bg-[#f8fafc] min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-health-100 flex items-center justify-center border-2 border-health-500 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                    </div>
                    <span className="text-health-900 font-bold text-sm">The Living Sanctuary</span>
                </div>
                <div className="bg-health-50 p-1.5 rounded-lg text-health-600">
                    <Sparkles size={16} />
                </div>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">Your Digital Sanctuary</h1>
                <p className="text-gray-500 text-sm mt-1">How can I support your restorative journey today?</p>
            </div>

            {/* Suggested Actions Chips */}
            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar py-1">
                <button className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2.5 rounded-2xl whitespace-nowrap text-[10px] font-bold border border-gray-100 shadow-sm flex-shrink-0">
                    <div className="w-5 h-5 rounded-lg bg-health-50 flex items-center justify-center text-health-600">
                        <Flame size={12} />
                    </div>
                    Create a workout plan
                </button>
                <button className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2.5 rounded-2xl whitespace-nowrap text-[10px] font-bold border border-gray-100 shadow-sm flex-shrink-0">
                    <div className="w-5 h-5 rounded-lg bg-green-50 flex items-center justify-center text-health-600">
                        <Utensils size={12} />
                    </div>
                    How many calories in rice?
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-6 overflow-y-auto mb-6 pr-2">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-health-50 flex items-center justify-center border border-health-200 flex-shrink-0 overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="ai" />
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-health-900 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 rounded-bl-none border border-gray-50'
                                    }`}
                            >
                                {msg.content}
                                {msg.role === 'assistant' && index === 0 && (
                                    <div className="flex gap-2 mt-4">
                                        <button className="bg-gray-100 text-gray-900 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider">Yes, show me the flow</button>
                                        <button className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider">Maybe later</button>
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="user" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex justify-start items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-health-50 flex items-center justify-center border border-health-200 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="ai" />
                            </div>
                            <div className="bg-white px-5 py-4 rounded-3xl rounded-bl-none border border-gray-50 shadow-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-health-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-health-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-health-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <span className="text-[10px] text-gray-400 font-bold ml-1">AI Sanctuary is thinking...</span>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="bg-white rounded-full p-2.5 shadow-xl border border-gray-100 flex items-center gap-3 relative">
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-health-600 transition-colors">
                    <Plus size={20} />
                </button>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
                    placeholder="Message the Sanctuary..."
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${input.trim() && !loading ? 'bg-health-900 text-white shadow-lg' : 'bg-gray-100 text-gray-300'
                        }`}
                >
                    <ArrowUp size={20} />
                </button>
            </div>
        </div>
    );
};

export default Chat;

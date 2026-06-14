import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Utensils, Dumbbell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Utensils, label: 'Meal', path: '/meal' },
    { icon: Dumbbell, label: 'Workout', path: '/workout' },
    { icon: User, label: 'Profile', path: '/profile' },
];

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(92%,26rem)]">
            <div className="glass shadow-float rounded-full px-2 py-2 flex justify-between items-center">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link
                            key={path}
                            to={path}
                            aria-label={label}
                            className="relative flex-1 flex flex-col items-center justify-center py-1.5"
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="nav-pill"
                                    className="absolute inset-0 brand-gradient rounded-full shadow-glow"
                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                />
                            )}
                            <span className={`relative z-10 flex items-center gap-1.5 px-1 transition-colors ${isActive ? 'text-white' : 'text-ink-faint'}`}>
                                <Icon size={19} strokeWidth={2.2} />
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        className="text-xs font-bold whitespace-nowrap overflow-hidden"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Utensils, Calendar, User } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { icon: <Home size={18} />, label: 'HOME', path: '/' },
        { icon: <MessageSquare size={18} />, label: 'CHAT', path: '/chat' },
        { icon: <Utensils size={18} />, label: 'MEAL', path: '/meal' },
        { icon: <Calendar size={18} />, label: 'WORKOUT', path: '/workout' },
        { icon: <User size={18} />, label: 'PROFILE', path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-health-700' : 'text-gray-400'
                            }`}
                    >
                        <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-health-100 shadow-sm' : ''
                            }`}>
                            {item.icon}
                        </div>
                        <span className={`text-[8px] font-black tracking-[0.05em] transition-all ${isActive ? 'opacity-100' : 'opacity-0'
                            }`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { Settings, Edit2, Scale, Ruler, Zap, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = ({ user, onLogout }) => {
    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto bg-[#f8fafc] min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-health-100 flex items-center justify-center border-2 border-health-500 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="avatar" />
                    </div>
                    <span className="text-health-900 font-bold text-sm">The Living Sanctuary</span>
                </div>
                <Settings className="text-health-800 w-5 h-5 cursor-pointer" />
            </div>

            <div className="mb-8">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Wellness Profile</span>
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">{user?.name || 'Elena Vance'}</h1>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">Cultivating balance through mindful movement and holistic recovery since 2022.</p>

                <button className="mt-6 bg-health-600 text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-health-100">
                    <Edit2 size={14} /> Edit Profile
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-4 mb-8">
                {/* Weight Card */}
                <div className="col-span-4 bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-health-50 p-1.5 rounded-lg">
                            <Scale size={14} className="text-health-600" />
                        </div>
                        <span className="text-[9px] font-bold text-health-600">-2.1kg this month</span>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Current Weight</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-gray-900">64.2</span>
                        <span className="text-xs font-bold text-gray-400">kg</span>
                    </div>
                </div>

                {/* Stature Card */}
                <div className="col-span-4 bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
                    <div className="bg-blue-50 p-1.5 rounded-lg w-fit mb-6">
                        <Ruler size={14} className="text-blue-500" />
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Stature</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-gray-900">172</span>
                        <span className="text-xs font-bold text-gray-400">cm</span>
                    </div>
                </div>

                {/* Primary Goal Card */}
                <div className="col-span-12 bg-health-800 rounded-3xl p-6 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block mb-2">Primary Goal</span>
                        <h3 className="text-xl font-bold text-white mb-6 leading-tight">Marathon Readiness & <br />Post-Run Recovery</h3>

                        <div className="flex justify-between items-end mb-2">
                            <div className="w-full bg-white/10 h-1.5 rounded-full mr-4">
                                <div className="bg-health-400 h-full rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-white whitespace-nowrap">65% Achieved</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-health-600 rounded-full blur-3xl -mr-16 -mt-16 opacity-30"></div>
                </div>
            </div>

            {/* Weekly Flow Chart */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-900">Weekly Vitality Flow</h3>
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                        <button className="px-3 py-1 text-[9px] font-bold text-gray-400 uppercase">Steps</button>
                        <button className="px-3 py-1 text-[9px] font-bold text-gray-900 bg-white rounded-md shadow-sm uppercase tracking-wider">Energy</button>
                    </div>
                </div>

                <div className="flex items-end justify-between h-40 px-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                        const heights = [40, 65, 95, 45, 85, 30, 55];
                        return (
                            <div key={day} className="flex flex-col items-center gap-3">
                                <div className="w-10 bg-gray-100 rounded-full relative overflow-hidden" style={{ height: '120px' }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${heights[i]}%` }}
                                        className={`absolute bottom-0 left-0 right-0 bg-health-${i === 2 || i === 4 ? '800' : '400'} rounded-full`}
                                    ></motion.div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-health-50 rounded-3xl p-5 border border-health-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={14} className="text-health-700" />
                        <span className="text-[9px] font-bold text-health-800 uppercase tracking-widest">Restorative Insight</span>
                    </div>
                    <p className="text-[10px] text-health-900/60 leading-relaxed">Your consistency in the mid-week suggests that Wednesday is your "Power Pivot". Consider scheduling your most demanding physical tasks then.</p>
                </div>
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Award size={14} className="text-health-700" />
                        <span className="text-[9px] font-bold text-gray-800 uppercase tracking-widest">Milestone Reached</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">You've logged 12 consecutive recovery sessions. This dedication to balance is why your heart rate variability (HRV) has improved by 12% this month.</p>
                </div>
            </div>

            <button
                onClick={onLogout}
                className="w-full py-4 text-xs font-bold text-red-400 border border-gray-100 rounded-2xl mb-8"
            >
                Sign Out of Sanctuary
            </button>
        </div>
    );
};

export default Profile;

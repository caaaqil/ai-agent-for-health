import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { UserPlus } from 'lucide-react';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authService.register(formData);
            setUser(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl card-shadow border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-health-100 rounded-2xl mb-4">
                        <UserPlus className="text-health-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Join Us</h2>
                    <p className="text-gray-500">Start your restorative journey today</p>
                </div>

                {error && <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:outline-none transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:outline-none transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-health-600 text-white font-bold rounded-xl hover:bg-health-700 transition-colors shadow-lg shadow-health-200 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Continue'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-health-600 font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

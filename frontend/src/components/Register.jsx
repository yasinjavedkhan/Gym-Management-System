import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address (e.g., titan@gym.com).');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.register(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-gym-gray px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black uppercase mb-2">Join the Tribe</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Create your profile</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                            placeholder="titan@gym.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Password</label>
                        <input
                            type="number"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                            placeholder="12345"
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className={`w-full bg-gym-black text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-electric-blue transition-all shadow-xl hover:shadow-electric-blue/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-bold text-gray-400 uppercase tracking-tight">
                    Already a member? <Link to="/login" className="text-electric-blue hover:underline ml-1">Sign in here</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

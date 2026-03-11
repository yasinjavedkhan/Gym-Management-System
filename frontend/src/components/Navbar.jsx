import React, { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, ChevronDown, User, LogOut, LayoutDashboard, Check, Phone, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authAPI.getProfile();
                const fullUser = response.data;
                setUser(fullUser);
                localStorage.setItem('user', JSON.stringify(fullUser));
            } catch (err) {
                console.error("Failed to refresh profile:", err);
            }
        };

        const checkAuth = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                fetchProfile();
            } else {
                setUser(null);
            }
        };

        checkAuth();

        window.addEventListener('authChange', checkAuth);
        return () => window.removeEventListener('authChange', checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    return (
        <nav className="absolute w-full z-50 glass border-b border-gray-200">
            <div className="w-full px-4 sm:px-8">
                <div className="flex justify-between h-20 items-center w-full">
                    <div className="flex-1 flex justify-start items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Dumbbell className="text-electric-blue w-8 h-8" />
                            <span className="text-2xl font-bold tracking-tight uppercase">Titan Gym</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 items-center justify-center space-x-10">
                        <Link to="/" className="text-base font-bold hover:text-electric-blue hover:scale-110 transition-all duration-300">Home</Link>
                        <Link to="/schedule" className="text-base font-bold hover:text-electric-blue hover:scale-110 transition-all duration-300">Schedule</Link>
                        <Link to="/pricing" className="text-base font-bold hover:text-electric-blue hover:scale-110 transition-all duration-300">Pricing</Link>
                        {user && user.email === 'admin@titangym.com' && (
                            <Link to="/admin" className="text-base font-bold hover:text-electric-blue hover:scale-110 transition-all duration-300 text-gym-black">Admin</Link>
                        )}
                    </div>

                    <div className="flex-1 flex justify-end items-center gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-[#eaf4ff] border border-[#d9ebff] rounded-full flex items-center justify-center text-[#007BFF]">
                                                <User size={20} strokeWidth={2.5} />
                                            </div>
                                            <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-[#00d26a] border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#007BFF]">Member</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[15px] font-black uppercase text-gym-black">{user.name.split(' ')[0]}</span>
                                                <ChevronDown size={14} className={`text-gray-300 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-[-1]"
                                                    onClick={() => setIsProfileOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-4 w-[240px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 p-3 z-50"
                                                >
                                                    <div className="bg-[#f8fafc] rounded-[1.5rem] p-5 mb-2">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-2 h-2 rounded-full bg-[#00d26a]" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af]">Membership</span>
                                                        </div>
                                                        <span className="text-sm font-black uppercase text-gym-black ml-4">{user.membershipType} Member</span>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-1 px-1">
                                                        <Link
                                                            to="/dashboard"
                                                            onClick={() => setIsProfileOpen(false)}
                                                            className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                                                        >
                                                            <LayoutGrid size={20} className="text-[#007BFF]" />
                                                            <span className="text-sm font-semibold text-gym-black">Dashboard</span>
                                                        </Link>
                                                        
                                                        <button
                                                            onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                                                            className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-red-50 transition-colors"
                                                        >
                                                            <LogOut size={20} className="text-[#ff3b30]" />
                                                            <span className="text-sm font-semibold text-[#ff3b30]">Logout</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link to="/login" className="bg-gym-black text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest hover:bg-electric-blue transition-all shadow-lg hover:shadow-electric-blue/20">
                                    Join Now
                                </Link>
                            )}
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-gym-black">
                                {isOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 p-6 space-y-6 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/" onClick={() => setIsOpen(false)} className="bg-gray-50 p-4 rounded-2xl text-center font-bold hover:bg-electric-blue/10 transition-colors">Home</Link>
                        <Link to="/schedule" onClick={() => setIsOpen(false)} className="bg-gray-50 p-4 rounded-2xl text-center font-bold hover:bg-electric-blue/10 transition-colors">Schedule</Link>
                    </div>
                    <Link to="/pricing" onClick={() => setIsOpen(false)} className="block text-lg font-bold">Pricing</Link>
                    {user && user.email === 'admin@titangym.com' && (
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-lg font-black text-electric-blue">Admin Panel</Link>
                    )}

                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-lg font-bold text-electric-blue">Dashboard</Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left text-lg font-bold text-red-500">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="block bg-electric-blue text-white text-center py-3 rounded-xl font-bold">Join Now</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

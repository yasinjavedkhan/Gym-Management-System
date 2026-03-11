import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Zap, Target, TrendingUp, Plus, X, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI, bookingAPI } from '../services/api';

const data = [
    { name: 'Mon', weight: 80, calories: 2100 },
    { name: 'Tue', weight: 79.5, calories: 2300 },
    { name: 'Wed', weight: 79.2, calories: 2000 },
    { name: 'Thu', weight: 79, calories: 2500 },
    { name: 'Fri', weight: 78.8, calories: 2200 },
    { name: 'Sat', weight: 78.5, calories: 2800 },
    { name: 'Sun', weight: 78.2, calories: 1900 },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${color}`}>
                <Icon className="text-white" size={24} />
            </div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Live Updates</span>
        </div>
        <div className="text-sm font-bold text-gray-500 uppercase mb-1">{title}</div>
        <div className="text-4xl font-black">{value}</div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [nextSession, setNextSession] = useState('No Session');
    
    // Log Activity Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [logData, setLogData] = useState({
        weight: '',
        caloriesBurned: '',
        logWorkout: true
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!storedUser || !token) {
                navigate('/login');
                return;
            }

            try {
                // Refresh profile to get latest stats
                const profileRes = await authAPI.getProfile();
                setUser(profileRes.data);
                localStorage.setItem('user', JSON.stringify(profileRes.data));

                // Get bookings for next session
                const bookingsRes = await bookingAPI.getUserBookings();
                const bookings = bookingsRes.data;
                if (bookings && bookings.length > 0) {
                    // Sort by date and find next one
                    const now = new Date();
                    const upcoming = bookings
                        .filter(b => new Date(b.Class.startTime) > now)
                        .sort((a, b) => new Date(a.Class.startTime) - new Date(b.Class.startTime));
                    
                    if (upcoming.length > 0) {
                        const next = new Date(upcoming[0].Class.startTime);
                        setNextSession(next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    }
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setUser(JSON.parse(storedUser));
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogActivity = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const dataToUpdate = {
                logWorkout: logData.logWorkout
            };
            if (logData.weight) dataToUpdate.weight = parseFloat(logData.weight);
            if (logData.caloriesBurned) dataToUpdate.caloriesBurned = parseInt(logData.caloriesBurned);

            const res = await authAPI.updateProfile(dataToUpdate);
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setIsModalOpen(false);
            setLogData({ weight: '', caloriesBurned: '', logWorkout: true });
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to log activity. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="pt-32 pb-20 bg-gym-gray min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase mb-2">Member Dashboard</h1>
                        <p className="text-gray-500 font-semibold text-lg italic">Welcome back, {user.name.split(' ')[0]}.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 hidden sm:flex">
                            <Target className="text-electric-blue" />
                            <div>
                                <span className="block text-[10px] font-black uppercase opacity-40">Membership</span>
                                <span className="font-bold text-sm uppercase">{user.membershipType} MEMBER</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-electric-blue text-white px-6 py-4 rounded-2xl shadow-sm hover:brightness-110 flex items-center gap-2 font-black uppercase tracking-widest transition-all"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">Log Progress</span>
                            <span className="sm:hidden">Log</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
                    <StatCard title="Weight" value={`${user.weight} KG`} icon={Activity} color="bg-electric-blue" />
                    <StatCard title="Calories" value={`${user.caloriesToday.toLocaleString()} kcal`} icon={Zap} color="bg-gym-black" />
                    <StatCard title="Next Session" value={nextSession} icon={Target} color="bg-electric-blue" />
                    <StatCard title="Workouts" value={`${user.totalWorkouts} total`} icon={TrendingUp} color="bg-gym-black" />
                </div>

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-black uppercase mb-8">Weight Progress</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#007BFF"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#007BFF', strokeWidth: 4, stroke: '#fff' }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-black uppercase mb-8">Calorie Intake</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#121212" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#121212" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="calories" stroke="#121212" strokeWidth={4} fillOpacity={1} fill="url(#colorCal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Log Activity Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gym-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gym-black transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black uppercase mb-2">Log Daily Progress</h3>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    Update your stats to track growth
                                </p>
                            </div>

                            <form onSubmit={handleLogActivity} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Current Weight (KG)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={logData.weight}
                                        onChange={(e) => setLogData({ ...logData, weight: e.target.value })}
                                        className="w-full bg-gym-gray border-none p-4 rounded-2xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                                        placeholder={`Current: ${user.weight || 0} KG`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Calories Burned Today</label>
                                    <input
                                        type="number"
                                        value={logData.caloriesBurned}
                                        onChange={(e) => setLogData({ ...logData, caloriesBurned: e.target.value })}
                                        className="w-full bg-gym-gray border-none p-4 rounded-2xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                                        placeholder="+ Add kCal"
                                    />
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gym-gray rounded-2xl cursor-pointer" onClick={() => setLogData({...logData, logWorkout: !logData.logWorkout})}>
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${logData.logWorkout ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        {logData.logWorkout && <Check size={16} className="text-white" />}
                                    </div>
                                    <span className="font-bold text-sm tracking-tight">Count as completed workout (+1)</span>
                                </div>

                                <button
                                    disabled={isUpdating}
                                    type="submit"
                                    className="w-full bg-gym-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-electric-blue transition-all shadow-xl mt-4 flex justify-center items-center gap-2"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Progress'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;

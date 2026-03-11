import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Zap, Target, TrendingUp } from 'lucide-react';
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

    if (!user) return null;

    return (
        <div className="pt-32 pb-20 bg-gym-gray min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black uppercase mb-2">Member Dashboard</h1>
                        <p className="text-gray-500 font-semibold text-lg italic">Welcome back, {user.name.split(' ')[0]}.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <Target className="text-electric-blue" />
                            <div>
                                <span className="block text-[10px] font-black uppercase opacity-40">Membership</span>
                                <span className="font-bold text-sm uppercase">{user.membershipType} MEMBER</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCard title="Weight" value={`${user.weight} KG`} icon={Activity} color="bg-electric-blue" />
                    <StatCard title="Calories" value={`${user.caloriesToday.toLocaleString()} kcal`} icon={Zap} color="bg-gym-black" />
                    <StatCard title="Next Session" value={nextSession} icon={Target} color="bg-electric-blue" />
                    <StatCard title="Workouts" value={`${user.totalWorkouts} total`} icon={TrendingUp} color="bg-gym-black" />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
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

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
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
        </div>
    );
};

export default Dashboard;

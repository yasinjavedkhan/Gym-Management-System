import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, classAPI } from '../services/api';

const Schedule = () => {
    const [activeTab, setActiveTab] = useState('');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingStatus, setBookingStatus] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await classAPI.getAll();
                setClasses(response.data);
                if (response.data.length > 0) {
                    const uniqueCategories = [...new Set(response.data.map(c => c.title))];
                    setActiveTab(uniqueCategories[0]);
                }
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const groupedClasses = classes.reduce((acc, curr) => {
        if (!acc[curr.title]) acc[curr.title] = [];
        acc[curr.title].push(curr);
        return acc;
    }, {});

    const categories = Object.keys(groupedClasses);

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleBook = async (classId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setBookingStatus(prev => ({ ...prev, [classId]: 'loading' }));
            await bookingAPI.book(classId);
            setBookingStatus(prev => ({ ...prev, [classId]: 'success' }));
            setTimeout(() => {
                setBookingStatus(prev => ({ ...prev, [classId]: null }));
            }, 3000);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Booking failed');
            setBookingStatus(prev => ({ ...prev, [classId]: 'error' }));
            setTimeout(() => {
                setErrorMsg('');
                setBookingStatus(prev => ({ ...prev, [classId]: null }));
            }, 3000);
        }
    };

    return (
        <section className="py-32 bg-gym-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black uppercase mb-4">Class Schedule</h2>
                    <div className="w-20 h-2 bg-electric-blue mx-auto" />
                </div>

                <div className="flex justify-center flex-wrap gap-4 mb-12">
                    {categories.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-full font-bold uppercase transition-all ${activeTab === tab
                                ? 'bg-electric-blue text-white shadow-lg'
                                : 'bg-white text-gym-black hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-electric-blue" size={48} />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">No Classes Available</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="wait">
                            {groupedClasses[activeTab]?.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-electric-blue/20"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-electric-blue/10 p-4 rounded-2xl group-hover:bg-electric-blue group-hover:text-white transition-colors">
                                            <Clock size={24} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.duration} MIN</span>
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 uppercase">{item.title} Session</h3>
                                    <div className="flex items-center gap-2 mb-6 text-gray-600">
                                        <User size={18} className="text-electric-blue" />
                                        <span className="font-semibold">{item.trainerName}</span>
                                    </div>
                                    <div className="text-3xl font-black text-gym-black mb-8">{formatTime(item.startTime)}</div>
                                    <button
                                        onClick={() => handleBook(item.id)}
                                        disabled={bookingStatus[item.id] === 'loading' || bookingStatus[item.id] === 'success'}
                                        className={`w-full py-4 rounded-xl border-2 font-black uppercase transition-all
                                        ${bookingStatus[item.id] === 'success' ? 'bg-green-500 text-white border-green-500'
                                                : bookingStatus[item.id] === 'error' ? 'bg-red-500 text-white border-red-500'
                                                    : 'border-gym-black hover:bg-gym-black hover:text-white text-gym-black'}`}
                                    >
                                        {bookingStatus[item.id] === 'loading' ? 'Booking...'
                                            : bookingStatus[item.id] === 'success' ? 'Booked!'
                                                : bookingStatus[item.id] === 'error' ? 'Failed'
                                                    : 'Book Now'}
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
                {errorMsg && (
                    <div className="mt-8 bg-red-50 text-red-500 p-4 rounded-xl text-center font-bold">
                        {errorMsg}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Schedule;

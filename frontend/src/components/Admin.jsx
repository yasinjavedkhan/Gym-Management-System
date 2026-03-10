import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api, { trainerAPI } from '../services/api';

const Admin = () => {
    const [classData, setClassData] = useState({
        title: 'Yoga',
        trainerName: '',
        startTime: '',
        duration: 60,
        capacity: 20
    });
    const [trainerData, setTrainerData] = useState({
        name: '',
        specialty: 'Yoga',
        experience: 0
    });

    // Status object format: { type: 'success'|'error', message: '', scope: 'class'|'trainer' }
    const [status, setStatus] = useState({ type: '', message: '', scope: '' });
    const [loadingClass, setLoadingClass] = useState(false);
    const [loadingTrainer, setLoadingTrainer] = useState(false);
    const [trainers, setTrainers] = useState([]);
    const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await trainerAPI.getAll();
                setTrainers(res.data);
            } catch (error) {
                console.error("Failed to fetch trainers", error);
            }
        };
        fetchTrainers();
    }, []);

    const handleClassSubmit = async (e) => {
        e.preventDefault();
        setLoadingClass(true);
        setStatus({ type: '', message: '', scope: '' });

        try {
            await api.post('/classes', {
                ...classData,
                startTime: new Date(classData.startTime)
            });
            setStatus({ type: 'success', message: 'Class successfully added to the database!', scope: 'class' });
            setClassData({ ...classData, trainerName: '', startTime: '' }); // Reset some fields
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to create class', scope: 'class' });
        } finally {
            setLoadingClass(false);
        }
    };

    const handleTrainerSubmit = async (e) => {
        e.preventDefault();
        setLoadingTrainer(true);
        setStatus({ type: '', message: '', scope: '' });

        try {
            await api.post('/trainers', trainerData);
            setStatus({ type: 'success', message: 'Trainer successfully added to the database!', scope: 'trainer' });
            setTrainerData({ name: '', specialty: 'Yoga', experience: 0 }); // Reset all fields
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to create trainer', scope: 'trainer' });
        } finally {
            setLoadingTrainer(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gym-gray px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black uppercase mb-4">Admin Panel</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Add New Classes to Database</p>
                    <div className="w-20 h-2 bg-electric-blue mx-auto mt-6" />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Add Class Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-gray-100"
                    >
                        <h2 className="text-3xl font-black uppercase mb-8 text-center">Add Class</h2>
                        {status.message && status.scope === 'class' && (
                            <div className={`p-4 rounded-xl text-sm font-bold mb-8 text-center border ${status.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleClassSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Class Type</label>
                                <select
                                    value={classData.title}
                                    onChange={(e) => setClassData({ ...classData, title: e.target.value })}
                                    className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold cursor-pointer"
                                >
                                    <option value="Yoga">Yoga</option>
                                    <option value="HIIT">HIIT</option>
                                    <option value="Strength">Strength</option>
                                    <option value="Cardio">Cardio</option>
                                </select>
                            </div>
                            <div className="relative">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Trainer Name</label>
                                <input
                                    type="text"
                                    value={classData.trainerName}
                                    onChange={(e) => {
                                        setClassData({ ...classData, trainerName: e.target.value });
                                        setShowTrainerDropdown(true);
                                    }}
                                    onFocus={() => setShowTrainerDropdown(true)}
                                    // Delay hiding dropdown so clicks on options register first
                                    onBlur={() => setTimeout(() => setShowTrainerDropdown(false), 200)}
                                    className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                                    placeholder="e.g. Sarah J."
                                    required
                                    autoComplete="off"
                                />
                                <AnimatePresence>
                                    {showTrainerDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto"
                                        >
                                            {trainers.filter(t => t.name.toLowerCase().includes(classData.trainerName.toLowerCase())).length > 0 ? (
                                                trainers.filter(t => t.name.toLowerCase().includes(classData.trainerName.toLowerCase())).map(trainer => (
                                                    <div
                                                        key={trainer.id}
                                                        className="p-4 hover:bg-gym-gray cursor-pointer font-bold border-b border-gray-50 last:border-none"
                                                        onClick={() => {
                                                            setClassData({ ...classData, trainerName: trainer.name });
                                                            setShowTrainerDropdown(false);
                                                        }}
                                                    >
                                                        {trainer.name} <span className="text-gray-400 text-sm ml-2 font-normal">({trainer.specialty})</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-gray-400 text-sm font-bold text-center">No matching trainers found</div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={classData.startTime}
                                    onChange={(e) => setClassData({ ...classData, startTime: e.target.value })}
                                    className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Duration (Mins)</label>
                                    <input
                                        type="number"
                                        value={classData.duration}
                                        onChange={(e) => setClassData({ ...classData, duration: parseInt(e.target.value) || '' })}
                                        className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                                        min="15"
                                        max="180"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Capacity</label>
                                    <input
                                        type="number"
                                        value={classData.capacity}
                                        onChange={(e) => setClassData({ ...classData, capacity: parseInt(e.target.value) || '' })}
                                        className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                                        min="1"
                                        max="100"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loadingClass}
                                type="submit"
                                className="w-full bg-gym-black text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-electric-blue transition-all shadow-xl hover:shadow-electric-blue/20 mt-8 disabled:opacity-70"
                            >
                                {loadingClass ? 'Adding...' : 'Add Class'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Add Trainer Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-gray-100"
                    >
                        <h2 className="text-3xl font-black uppercase mb-8 text-center">Add Trainer</h2>
                        {status.message && status.scope === 'trainer' && (
                            <div className={`p-4 rounded-xl text-sm font-bold mb-8 text-center border ${status.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleTrainerSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Trainer Name</label>
                                <input
                                    type="text"
                                    value={trainerData.name}
                                    onChange={(e) => setTrainerData({ ...trainerData, name: e.target.value })}
                                    className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Specialty</label>
                                <select
                                    value={trainerData.specialty}
                                    onChange={(e) => setTrainerData({ ...trainerData, specialty: e.target.value })}
                                    className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold cursor-pointer"
                                    required
                                >
                                    <option value="Yoga">Yoga</option>
                                    <option value="HIIT">HIIT</option>
                                    <option value="Strength">Strength</option>
                                    <option value="Cardio">Cardio</option>
                                    <option value="Mixed Martial Arts">Mixed Martial Arts</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Years of Experience</label>
                                <input
                                    type="number"
                                    value={trainerData.experience}
                                    onChange={(e) => setTrainerData({ ...trainerData, experience: parseInt(e.target.value) || '' })}
                                    className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-bold"
                                    min="0"
                                    max="50"
                                    required
                                />
                            </div>
                            <button
                                disabled={loadingTrainer}
                                type="submit"
                                className="w-full bg-electric-blue text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-gym-black transition-all shadow-xl hover:shadow-black/20 mt-8 disabled:opacity-70"
                            >
                                {loadingTrainer ? 'Adding...' : 'Add Trainer'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Admin;

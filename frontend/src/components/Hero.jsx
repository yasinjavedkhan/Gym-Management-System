import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

const Hero = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [bmi, setBmi] = useState(null);

    // BMI Calculator should start empty as per user request to show placeholders

    const calculateBMI = (e) => {
        e.preventDefault();
        if (weight && height) {
            const h = height / 100;
            const val = (weight / (h * h)).toFixed(1);
            setBmi(val);
        }
    };

    const getBMICategory = (val) => {
        if (!val) return null;
        if (val < 18.5) return { label: 'Underweight', color: 'text-yellow-500' };
        if (val < 25) return { label: 'Normal Weight', color: 'text-green-500' };
        if (val < 30) return { label: 'Overweight', color: 'text-orange-500' };
        return { label: 'Obese', color: 'text-red-500' };
    };

    const category = getBMICategory(bmi);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-32 pb-20">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
                {/* ... Left Side Content (Push Your Limits) stays same ... */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col justify-center"
                >
                    <h1 className="text-7xl md:text-[6rem] lg:text-[8rem] font-black leading-[0.9] uppercase mb-8">
                        Push <br />
                        Your <br />
                        <span className="text-electric-blue">Limits.</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
                        Experience the next generation of fitness. State-of-the-art equipment, world-class trainers, and a community built for performance.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-gym-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-electric-blue transition-all shadow-xl hover:shadow-electric-blue/20">
                            Start Today
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                >
                    <div className="bg-gym-black p-10 rounded-[3rem] text-white shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Calculator className="text-electric-blue" size={24} />
                            <h3 className="text-2xl font-bold uppercase">BMI Calculator</h3>
                        </div>

                        <form onSubmit={calculateBMI} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Weight (KG)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 p-4 rounded-xl focus:outline-none focus:border-electric-blue transition-colors text-xl font-bold"
                                    placeholder=""
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Height (CM)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 p-4 rounded-xl focus:outline-none focus:border-electric-blue transition-colors text-xl font-bold"
                                    placeholder=""
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Age</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 p-4 rounded-xl focus:outline-none focus:border-electric-blue transition-colors text-xl font-bold"
                                        placeholder=""
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 p-4 rounded-xl focus:outline-none focus:border-electric-blue transition-colors text-xl font-bold cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled className="text-gym-black"></option>
                                        <option value="Male" className="text-gym-black">Male</option>
                                        <option value="Female" className="text-gym-black">Female</option>
                                    </select>
                                </div>
                            </div>
                            <button className="w-full bg-electric-blue py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all">
                                Calculate Now
                            </button>
                        </form>

                        {bmi && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 pt-8 border-t border-white/10"
                            >
                                <div className="text-center mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-1">Your Result</span>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-6xl font-black text-white">{bmi}</span>
                                        <span className={`text-sm font-black uppercase px-3 py-1 bg-white/5 rounded-full ${category?.color}`}>
                                            {category?.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <BMIRange label="Underweight" range="< 18.5" color="bg-yellow-500" />
                                    <BMIRange label="Healthy" range="18.5 - 24.9" color="bg-green-500" />
                                    <BMIRange label="Overweight" range="25.0 - 29.9" color="bg-orange-500" />
                                    <BMIRange label="Obese" range="≥ 30.0" color="bg-red-500" />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Abstract blobs for decor */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-electric-blue/20 rounded-full blur-[100px] -z-10" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gym-black/20 rounded-full blur-[100px] -z-10" />
                </motion.div>
            </div >
        </section >
    );
};

const BMIRange = ({ label, range, color }) => (
    <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
        <div className={`w-8 h-1 rounded-full mb-2 ${color}`} />
        <span className="text-[10px] font-black uppercase tracking-tighter opacity-70 mb-0.5">{label}</span>
        <span className="text-xs font-bold text-white/90">{range}</span>
    </div>
);

export default Hero;

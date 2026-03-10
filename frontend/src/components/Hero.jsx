import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

const Hero = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [bmi, setBmi] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.weight) setWeight(user.weight.toString());
            if (user.height) setHeight(user.height.toString());
            if (user.age) setAge(user.age.toString());
            if (user.gender && user.gender !== 'Not Specified') setGender(user.gender);
        }
    }, []);

    const calculateBMI = (e) => {
        e.preventDefault();
        if (weight && height) {
            const h = height / 100;
            const val = (weight / (h * h)).toFixed(1);
            setBmi(val);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-7xl md:text-8xl font-black leading-tight uppercase mb-6">
                        Push Your <br />
                        <span className="text-electric-blue">Limits.</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-lg">
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
                            <Calculator className="text-electric-blue" />
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
                                    placeholder="70"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Height (CM)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 p-4 rounded-xl focus:outline-none focus:border-electric-blue transition-colors text-xl font-bold"
                                    placeholder="175"
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
                                        placeholder="25"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 p-4 rounded-xl focus:outline-none focus:border-electric-blue transition-colors text-xl font-bold cursor-pointer"
                                    >
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
                                className="mt-8 pt-8 border-t border-white/10 text-center"
                            >
                                <span className="text-sm font-bold uppercase opacity-50 block mb-1">Your Result</span>
                                <span className="text-5xl font-black text-electric-blue">{bmi}</span>
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

export default Hero;

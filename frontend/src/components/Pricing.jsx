import React, { useState } from 'react';
import { Check, Smartphone, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setSelectedPlan(plan);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await authAPI.updateMembership(selectedPlan.name);
            
            // Update local storage user object
            const currentToken = localStorage.getItem('token');
            const response = await authAPI.getProfile();
            localStorage.setItem('user', JSON.stringify(response.data));
            
            // Signal auth change to Navbar
            window.dispatchEvent(new Event('authChange'));

            setIsProcessing(false);
            setPaymentSuccess(true);
            setTimeout(() => {
                setPaymentSuccess(false);
                setSelectedPlan(null);
            }, 3000);
        } catch (error) {
            console.error("Payment/Update failed:", error);
            setIsProcessing(false);
            alert("Failed to update membership. Please try again.");
        }
    };

    const plans = [
        {
            name: 'Basic',
            price: isYearly ? 9599 : 999,
            features: ['Access to Gym Floor', 'Locker Room Access', '1 Group Class/Month', 'Basic Support'],
            highlight: false
        },
        {
            name: 'Pro',
            price: isYearly ? 14399 : 1499,
            features: ['24/7 Access', 'Unlimited Group Classes', 'Personal Training Session', 'Nutrition Guide', 'Priority Support'],
            highlight: true
        },
        {
            name: 'Elite',
            price: isYearly ? 19199 : 1999,
            features: ['All Pro Features', 'Dedicated Coach', 'Massage & Spa Access', 'Guest Passes', 'Exclusive Events'],
            highlight: false
        }
    ];

    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black uppercase mb-8">Membership Plans</h2>

                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold uppercase transition-colors ${!isYearly ? 'text-gym-black' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-16 h-8 bg-gym-black rounded-full relative p-1 transition-colors hover:bg-electric-blue"
                        >
                            <div className={`w-6 h-6 bg-white rounded-full transition-all ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-bold uppercase transition-colors ${isYearly ? 'text-gym-black' : 'text-gray-400'}`}>Yearly (Save 20%)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-2 transition-all hover:scale-105 ${plan.highlight
                                ? 'border-electric-blue bg-gym-black text-white shadow-2xl md:scale-105 z-10'
                                : 'border-gray-100 bg-gym-gray scale-100'
                                }`}
                        >
                            <h3 className="text-2xl font-black uppercase mb-2">{plan.name}</h3>
                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-5xl font-black">₹{plan.price}</span>
                                <span className="text-sm font-bold uppercase opacity-50 mb-2">/ {isYearly ? 'year' : 'month'}</span>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 font-semibold">
                                        <div className={`p-1 rounded-full ${plan.highlight ? 'bg-electric-blue' : 'bg-gym-black'} text-white`}>
                                            <Check size={14} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan)}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${plan.highlight
                                    ? 'bg-electric-blue text-white hover:brightness-110 shadow-xl shadow-electric-blue/20'
                                    : 'bg-gym-black text-white hover:bg-electric-blue'
                                    }`}>
                                Select Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Modal Overlay */}
            <AnimatePresence>
                {selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gym-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12 w-full max-w-lg shadow-2xl relative"
                        >
                            {/* Close Button */}
                            {!isProcessing && !paymentSuccess && (
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="absolute top-8 right-8 text-gray-400 hover:text-gym-black transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            )}

                            {paymentSuccess ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check size={40} className="text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase mb-4 text-gym-black">Payment Successful</h3>
                                    <p className="text-gray-500 font-bold">Welcome to the {selectedPlan.name} plan!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10 text-center">
                                        <div className="w-16 h-16 bg-electric-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-electric-blue">
                                            <Smartphone size={32} />
                                        </div>
                                        <h3 className="text-3xl font-black uppercase mb-2">Checkout</h3>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                                            {selectedPlan.name} Plan • ₹{selectedPlan.price}/{isYearly ? 'yr' : 'mo'}
                                        </p>
                                    </div>

                                    <form onSubmit={handleCheckout} className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Payment Number</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value="9819394640"
                                                    readOnly
                                                    className="w-full bg-gym-gray border-none p-5 rounded-3xl focus:ring-2 focus:ring-electric-blue transition-all font-black tracking-widest text-2xl text-center text-gym-black shadow-inner"
                                                />
                                                <div className="absolute inset-y-0 right-5 flex items-center pr-3 pointer-events-none">
                                                    <Check size={20} className="text-green-500" />
                                                </div>
                                            </div>
                                            <p className="text-center text-xs font-bold text-gray-400 mt-4 uppercase">
                                                Please complete payment to this number
                                            </p>
                                        </div>

                                        <button
                                            disabled={isProcessing}
                                            type="submit"
                                            className="w-full bg-gym-black text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-electric-blue transition-all shadow-xl hover:shadow-electric-blue/20 flex justify-center items-center gap-2 mt-8"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Verifying Payment...
                                                </>
                                            ) : (
                                                `I Have Paid ₹${selectedPlan.price}`
                                            )}
                                        </button>
                                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 mt-4">Secured Transaction</p>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Pricing;

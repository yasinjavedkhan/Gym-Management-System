import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import Pricing from './components/Pricing';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Admin from './components/Admin';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Schedule />
            <Pricing />
          </main>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schedule" element={<div className="pt-32"><Schedule /></div>} />
        <Route path="/pricing" element={<div className="pt-32"><Pricing /></div>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;

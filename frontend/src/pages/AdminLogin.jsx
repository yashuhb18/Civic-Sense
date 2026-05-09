import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, Mail, Terminal, Fingerprint, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleNextStep = (e) => {
    e.preventDefault();
    if (email && password) {
      setStep(2);
      toast.success('Credentials verified. Requesting security key...');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (securityKey !== 'ADMIN-99') {
      toast.error('ACCESS DENIED: Invalid Security Key');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const success = await adminLogin(email, password);
      setLoading(false);
      if (success) {
        toast.success('Identity Confirmed. Accessing Command Center.');
        navigate('/admin');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative">
      {/* Background Grid Fix */}
      <div className="absolute inset-0 atlas-grid-bg pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-[#00684A] text-white shadow-2xl shadow-[#00684A]/30 mb-8 border-4 border-white">
            <ShieldAlert size={48} />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-[#001E2B] leading-none mb-4" style={{ color: '#001E2B' }}>
            Secure Terminal
          </h1>
          <p className="text-[#00684A] font-bold text-xs uppercase tracking-[0.4em]" style={{ color: '#00684A' }}>Government Access Only</p>
        </div>

        <div className="atlas-card p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNextStep}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin Identifier</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      placeholder="admin@city.gov"
                      className="input-atlas pl-12 h-14"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Passphrase</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input-atlas pl-12 h-14"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-atlas-primary w-full h-14 text-lg shadow-lg shadow-[#00684A]/20"
                >
                  Verify Identity
                  <ArrowRight size={20} />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-[#E3FCF7] flex items-center justify-center mx-auto border border-[#00684A]/20">
                    <Fingerprint className="text-[#00684A] animate-pulse" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#001E2B]" style={{ color: '#001E2B' }}>Secondary Security Key</h3>
                  <p className="text-slate-500 text-xs font-medium" style={{ color: '#64748b' }}>Please enter your physical 2FA hardware key.</p>
                </div>

                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00684A]" size={20} />
                  <input
                    type="password"
                    placeholder="Enter Security Key"
                    className="input-atlas pl-12 h-14 text-center tracking-[1em] text-xl font-bold"
                    value={securityKey}
                    onChange={(e) => setSecurityKey(e.target.value.toUpperCase())}
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-atlas-primary w-full h-14 text-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AUTHENTICATING...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={20} />
                      UNLOCK TERMINAL
                    </span>
                  )}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] font-bold text-slate-400 hover:text-[#00684A] tracking-widest uppercase transition-colors"
                >
                  Back to Credentials
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {/* Credentials Guide Info Box */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded bg-[#E3FCF7]/30 border border-[#00684A]/10 text-center"
          >
            <p className="text-[9px] font-bold text-[#00684A] uppercase tracking-[0.2em] mb-1">Authorization Protocol</p>
            <p className="text-[10px] text-slate-500 font-medium italic">
              User: admin@city.gov | Pass: admin123 | Key: ADMIN-99
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            IP: {Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.X.X | Terminal 04 | Node-V1
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

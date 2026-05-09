import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      {/* Background Grid Fix */}
      <div className="absolute inset-0 atlas-grid-bg pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#00684A] text-white shadow-2xl shadow-[#00684A]/30 mb-6">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900" style={{ color: '#001E2B' }}>Welcome Back</h1>
          <p className="text-slate-500 font-medium" style={{ color: '#64748b' }}>Access your city's infrastructure console.</p>
        </div>

        <form onSubmit={handleSubmit} className="atlas-card p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="name@company.com"
                className="input-atlas pl-12 h-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure Password</label>
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
            disabled={loading}
            className="btn-atlas-primary w-full h-14 text-lg shadow-lg shadow-[#00684A]/20"
          >
            {loading ? 'Verifying...' : 'Sign In to Console'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium space-y-2 flex flex-col">
          <span>
            New to CivicSync?{' '}
            <Link to="/register" className="text-[#00684A] font-bold hover:underline underline-offset-4" style={{ color: '#00684A' }}>
              Create Account
            </Link>
          </span>
          <Link to="/admin/login" className="text-[10px] font-bold text-slate-400 hover:text-[#00684A] uppercase tracking-widest transition-colors">
            Government Official? Access Secure Terminal
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
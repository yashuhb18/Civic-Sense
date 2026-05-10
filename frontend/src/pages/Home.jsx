import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, Sparkles, ShieldCheck, Zap, 
  Globe as GlobeIcon, BarChart3, Users2, Activity, CheckCircle,
  Smartphone, MapPin, Search, Cpu, Lock, ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import GlobeComponent from '../components/Globe';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white min-h-screen selection:bg-[#E3FCF7] pt-16">
      {/* 🏛️ CIVICSYNC HERO */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 atlas-grid-bg pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E3FCF7] border border-[#00684A]/10">
                <div className="w-2 h-2 rounded-full bg-[#00ED64] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00684A]">Live Municipal Pulse Active</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]" style={{ color: '#001E2B' }}>
                Modernize <br />
                Your <span style={{ color: '#00684A' }}>City's Infrastructure.</span>
              </h1>
              <p className="text-lg md:text-xl max-w-xl font-semibold leading-relaxed" style={{ color: '#475569' }}>
                The unified platform for smart municipal management. Bridging the gap between active citizens and efficient government through AI-driven transparency.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {user ? (
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <button className="btn-atlas-primary w-full h-14 text-lg">
                      Enter Dashboard
                      <ArrowRight size={20} />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="w-full sm:w-auto">
                      <button className="btn-atlas-primary w-full h-14 text-lg">
                        Start Reporting Now
                        <ArrowRight size={20} />
                      </button>
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto">
                      <button className="btn-atlas-secondary border-slate-200 text-slate-900 hover:bg-slate-50 w-full h-14 text-lg" style={{ color: '#001E2B' }}>
                        Citizen Login
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right: Globe */}
            <div className="flex items-center justify-center">
              <GlobeComponent />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - RESTORED CIVIC CONTENT */}
      <section className="py-32 container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Activity className="text-[#00684A]" />,
              title: "Instant Transmission",
              desc: "Submit detailed reports with GPS precision and photo evidence in under 30 seconds."
            },
            {
              icon: <ShieldCheck className="text-[#00ED64]" />,
              title: "Authority Verified",
              desc: "Official government integration ensures your complaints are seen by the right officials instantly."
            },
            {
              icon: <Search className="text-[#00684A]" />,
              title: "AI Analysis",
              desc: "Automatic categorization, severity detection, and department routing for every report."
            }
          ].map((feat, i) => (
            <div 
              key={i}
              className="atlas-card p-10 space-y-6"
            >
              <div className="w-12 h-12 rounded bg-slate-50 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900" style={{ color: '#001E2B' }}>{feat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed" style={{ color: '#64748b' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats - RESTORED CIVIC CONTENT */}
      <section className="bg-[#F9FBFA] py-32 border-y border-slate-100 relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Municipal Partners", value: "85+" },
            { label: "Resolved Issues", value: "45.2k" },
            { label: "Citizen Satisfaction", value: "4.9/5" },
            { label: "Avg Response Time", value: "2.4h" }
          ].map((s, i) => (
            <div key={i} className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-[#00684A] tracking-tighter" style={{ color: '#00684A' }}>{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-20 container mx-auto px-6 border-t border-slate-100 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center opacity-60">
          <p className="text-xs font-medium text-slate-500">© 2026 CivicSync. All Rights Reserved.</p>
          <div className="flex gap-8 text-xs font-bold text-[#00684A]">
            <Link to="/admin/login" style={{ color: '#00684A' }}>Gov Portal</Link>
            <a href="#" style={{ color: '#00684A' }}>Security</a>
            <a href="#" style={{ color: '#00684A' }}>Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
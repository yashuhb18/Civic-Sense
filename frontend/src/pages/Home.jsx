import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, ShieldCheck, Activity, Search, CheckCircle2, MapPin, Zap, Lock
} from 'lucide-react';
import { motion, useInView, useAnimation } from 'framer-motion';
import GlobeComponent from '../components/Globe';

// Reusable scroll-triggered wrapper
const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Animated counter for stats
const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    // Extract numeric part and suffix
    const num = parseFloat(value);
    const suffix = value.replace(/[0-9.]/g, '');
    if (isNaN(num)) { setDisplay(value); return; }

    let start = 0;
    const duration = 1400;
    const step = 16;
    const steps = duration / step;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setDisplay(`${num}${suffix}`);
        clearInterval(timer);
      } else {
        const formatted = num % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        setDisplay(`${formatted}${suffix}`);
      }
    }, step);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
};

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Activity size={22} className="text-[#00684A]" />,
      title: 'Instant Transmission',
      desc: 'Submit detailed reports with GPS precision and photo evidence in under 30 seconds.',
      color: 'bg-[#E3FCF7]',
    },
    {
      icon: <ShieldCheck size={22} className="text-emerald-500" />,
      title: 'Authority Verified',
      desc: 'Official government integration ensures your complaints are seen by the right officials instantly.',
      color: 'bg-emerald-50',
    },
    {
      icon: <Search size={22} className="text-[#00684A]" />,
      title: 'AI Analysis',
      desc: 'Automatic categorization, severity detection, and department routing for every report.',
      color: 'bg-[#E3FCF7]',
    },
    {
      icon: <MapPin size={22} className="text-indigo-500" />,
      title: 'Geospatial Mapping',
      desc: 'Interactive city-wide heatmaps to visualize recurring issues and allocate resources effectively.',
      color: 'bg-indigo-50',
    },
    {
      icon: <Zap size={22} className="text-amber-500" />,
      title: 'Real-Time Updates',
      desc: 'Receive push notifications and email alerts the moment authorities take action on your report.',
      color: 'bg-amber-50',
    },
    {
      icon: <Lock size={22} className="text-rose-500" />,
      title: 'Anonymous Mode',
      desc: 'Report sensitive local issues anonymously without sacrificing the ability to track resolution progress.',
      color: 'bg-rose-50',
    },
  ];

  const stats = [
    { label: 'Municipal Partners', value: '85+' },
    { label: 'Resolved Issues', value: '45.2k' },
    { label: 'Citizen Satisfaction', value: '4.9/5' },
    { label: 'Avg Response Time', value: '2.4h' },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-[#E3FCF7] pt-16">

      {/* 🏛️ HERO */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 atlas-grid-bg pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: animated text */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E3FCF7] border border-[#00684A]/10"
              >
                <div className="w-2 h-2 rounded-full bg-[#00ED64] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00684A]">Live Municipal Pulse Active</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
                style={{ color: '#001E2B' }}
              >
                Modernize <br />
                Your <span style={{ color: '#00684A' }}>City's Infrastructure.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl max-w-xl font-semibold leading-relaxed"
                style={{ color: '#475569' }}
              >
                The unified platform for smart municipal management. Bridging the gap between active citizens and efficient government through AI-driven transparency.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                {user ? (
                  <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="w-full sm:w-auto">
                    <button className="btn-atlas-primary w-full h-14 text-lg">
                      {user.role === 'admin' ? 'Enter Command Center' : 'Enter Dashboard'} <ArrowRight size={20} />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="w-full sm:w-auto">
                      <button className="btn-atlas-primary w-full h-14 text-lg">
                        Start Reporting Now <ArrowRight size={20} />
                      </button>
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto">
                      <button className="btn-atlas-secondary border-slate-200 text-slate-900 hover:bg-slate-50 w-full h-14 text-lg" style={{ color: '#001E2B' }}>
                        Citizen Login
                      </button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>

            {/* Right: Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <GlobeComponent />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 📖 ABOUT SECTION */}
      <section className="py-24 container mx-auto px-6 relative z-10 border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-square lg:aspect-[4/3] bg-slate-900 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00684A]/40 to-slate-900 opacity-80 mix-blend-overlay z-10 transition-opacity group-hover:opacity-60" />
                <div className="absolute inset-0 atlas-grid-bg opacity-20" />
                <div className="relative z-20 w-3/4 h-3/4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between transform transition-transform group-hover:scale-105 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="w-16 h-2 rounded bg-white/20" />
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-2 rounded bg-white/20" />
                    <div className="w-5/6 h-2 rounded bg-white/20" />
                    <div className="w-4/6 h-2 rounded bg-white/20" />
                  </div>
                  <div className="mt-8 flex justify-end">
                     <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                       <ArrowRight className="text-white/50" size={20} />
                     </div>
                  </div>
                </div>
             </div>
          </FadeUp>
          <FadeUp delay={0.2} className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00684A]">About CivicSync</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Empowering Citizens. <br />Enabling Governments.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              CivicSync was born from a simple idea: urban problem-solving should be transparent, instantaneous, and data-driven. We replace outdated bureaucratic red tape with real-time geospatial intelligence and machine learning.
            </p>
            <ul className="space-y-4 pt-6">
              {[
                'Open API for Municipal Integration', 
                'End-to-End Encrypted Data Pipelines', 
                'Automated SLA Tracking & Escalation',
                'Predictive Infrastructure Maintenance'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-700 font-bold text-sm">
                  <div className="w-8 h-8 rounded-full bg-[#E3FCF7] flex items-center justify-center text-[#00684A] shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ⚙️ HOW IT WORKS */}
      <section className="bg-slate-900 py-32 relative z-10 text-white overflow-hidden mt-12">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="container mx-auto px-6 relative">
          <FadeUp className="text-center mb-24">
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 force-light-text-emerald">Workflow</p>
             <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight force-light-text">Three Steps to Resolution</h2>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative">
             {/* connecting line for desktop */}
             <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-slate-800" />
             
             {[
               { step: '01', title: 'Capture & Report', desc: 'Snap a photo of the infrastructure issue. Our app automatically tags the exact GPS coordinates and timestamps the evidence.' },
               { step: '02', title: 'AI Processing', desc: 'Our machine learning models analyze the severity, categorize the problem, and route it to the correct department instantly.' },
               { step: '03', title: 'Swift Action', desc: 'Municipal authorities receive a prioritized dashboard to dispatch teams and update your report status in real-time.' }
             ].map((item, i) => (
               <FadeUp key={i} delay={i * 0.15} className="relative z-10 text-center space-y-6">
                 <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full border-8 border-slate-900 flex items-center justify-center shadow-2xl relative z-20">
                   <span className="text-2xl font-black force-light-text-emerald">{item.step}</span>
                 </div>
                 <h3 className="text-2xl font-bold force-light-text">{item.title}</h3>
                 <p className="leading-relaxed font-medium px-4 force-light-text-slate">{item.desc}</p>
               </FadeUp>
             ))}
          </div>
        </div>
      </section>

      {/* ✨ FEATURE CARDS */}
      <section className="py-32 container mx-auto px-6 relative z-10">
        <FadeUp className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00684A] mb-3">Why CivicSync</p>
          <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: '#001E2B' }}>
            Built for the Modern City
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <motion.div
                className="atlas-card p-10 space-y-6 h-full cursor-default flex flex-col"
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,104,74,0.10)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center shrink-0`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  {feat.icon}
                </motion.div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold" style={{ color: '#001E2B' }}>{feat.title}</h3>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: '#64748b' }}>{feat.desc}</p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 📊 STATS — scroll-triggered counter + fade */}
      <section className="bg-[#F9FBFA] py-32 border-y border-slate-100 relative z-10 overflow-hidden">
        {/* Subtle decorative blob */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#00ED64]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00684A] mb-3">Impact at Scale</p>
            <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: '#001E2B' }}>
              Numbers That Speak
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div
                  className="space-y-2 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <p
                    className="text-4xl md:text-5xl font-bold tracking-tighter"
                    style={{ color: '#00684A' }}
                  >
                    <AnimatedNumber value={s.value} />
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    {s.label}
                  </p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
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
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, MessageSquare, 
  Settings, Users, ChevronLeft, LogOut, Activity, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const mainItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Map, label: 'Live Maps', path: '/create-complaint' },
    { icon: Activity, label: 'Activity', path: '/activity' },
  ];

  const configItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help Center', path: '/support' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col p-8 z-50">
      <div className="mb-12 flex items-center gap-3">
        <div className="w-12 h-12 bg-[#00684A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00684A]/20">
          <Activity className="text-[#00ED64]" size={26} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-black tracking-tighter text-[#001E2B] leading-none">CIVIC<span className="text-[#00684A]">SYNC</span></h2>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Pulse Platform</span>
        </div>
      </div>

      <nav className="flex-1 space-y-8">
        <div className="space-y-2">
          {mainItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={index} 
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-[#E3FCF7] dark:bg-emerald-500/10 text-[#00684A]' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#00684A]' : 'group-hover:text-slate-600'} />
                <span className="font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-6 bg-[#00684A] rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="space-y-2">
          <h4 className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 mt-8">Configuration</h4>
          {configItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={`cfg-${index}`} 
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-[#E3FCF7] dark:bg-emerald-500/10 text-[#00684A]' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#00684A]' : 'group-hover:text-slate-600'} />
                <span className="font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-6 bg-[#00684A] rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto space-y-6">
        <div className="p-6 bg-[#001E2B] rounded-[1.5rem] text-white space-y-4 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <h3 className="font-bold relative z-10">UPGRADE PLAN</h3>
          <p className="text-xs text-slate-400 relative z-10 leading-relaxed">Access premium features and city-wide analytics.</p>
          <button className="w-full py-3 bg-[#00ED64] text-[#001E2B] rounded-xl font-black text-xs uppercase tracking-widest relative z-10 hover:bg-[#00c653] transition-colors shadow-lg shadow-[#00ED64]/20">
            Upgrade Now
          </button>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-500 transition-colors w-full group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

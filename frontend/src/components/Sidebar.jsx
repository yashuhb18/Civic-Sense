import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, MessageSquare, 
  Settings, Users, ChevronLeft, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Map, label: 'Maps', path: '/create-complaint' },
    { icon: MessageSquare, label: 'Support', path: '#' },
    { icon: Settings, label: 'Setting', path: '#' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col p-8 z-50">
      <div className="mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Map className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-black tracking-tighter uppercase">CivicSync</h2>
      </div>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' 
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-indigo-600' : 'group-hover:text-slate-600'} />
              <span className="font-bold tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-6 bg-indigo-600 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="p-6 bg-indigo-600 rounded-[2rem] text-white space-y-4 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <h3 className="font-bold relative z-10">UPGRADE PLAN</h3>
          <p className="text-xs text-indigo-100 relative z-10 leading-relaxed">Access premium features and city-wide analytics.</p>
          <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest relative z-10 hover:bg-indigo-50 transition-colors">
            Get Pro
          </button>
        </div>

        <button className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-500 transition-colors w-full">
          <LogOut size={20} />
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

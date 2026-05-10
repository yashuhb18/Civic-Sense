import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Bell, User, LogOut, Lock, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        {/* LOGO - ORIGINAL CONTENT, GREEN STYLING */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-[#00684A] rounded-lg flex items-center justify-center shadow-lg shadow-[#00684A]/20 transition-transform hover:scale-105">
            <ShieldAlert className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 leading-none tracking-tighter">
              CivicSync
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#00684A] mt-1">Municipal Command</span>
          </div>
        </Link>

        {/* Navigation Links - RESTORED TEXT */}
        <div className="hidden md:flex items-center space-x-1">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isActive('/') ? 'text-[#00684A] bg-[#E3FCF7]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Home
          </Link>
          
          {user && user.role !== 'admin' && (
            <>
              <Link 
                to="/dashboard" 
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isActive('/dashboard') ? 'text-[#00684A] bg-[#E3FCF7]' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/create-complaint" 
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isActive('/create-complaint') ? 'text-[#00684A] bg-[#E3FCF7]' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Report Issue
              </Link>
            </>
          )}
          {user && user.role === 'admin' && (
             <Link 
                to="/admin" 
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors text-[#00684A] hover:bg-[#E3FCF7]`}
              >
                Command Center
              </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {(!user || user.role !== 'admin') && (
            <Link 
              to="/admin/login" 
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border border-[#00684A]/20 text-[#00684A] text-[10px] font-bold tracking-widest hover:bg-[#E3FCF7] transition-all"
            >
              <Lock size={12} />
              GOV PORTAL
            </Link>
          )}

          {user ? (
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#E3FCF7] flex items-center justify-center border border-[#00684A]/10">
                <User size={18} className="text-[#00684A]" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#00684A] transition-colors">Sign In</Link>
              <Link to="/register" className="bg-[#00684A] text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-[#00593f] shadow-lg shadow-[#00684A]/20 transition-all active:scale-95">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

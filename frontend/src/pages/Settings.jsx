import React from 'react';
import Sidebar from '../components/Sidebar';
import { User, Bell, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex bg-[#F9FBFA] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-72 p-10 pt-20 lg:pt-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-500 font-medium mt-2">Manage your account preferences and notifications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nav */}
            <div className="col-span-1 space-y-2">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#E3FCF7] text-[#00684A] font-bold">
                <User size={20} /> Profile Info
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 text-slate-500 font-bold transition-all">
                <Bell size={20} /> Notifications
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 text-slate-500 font-bold transition-all">
                <Lock size={20} /> Security
              </button>
            </div>

            {/* Content */}
            <div className="col-span-2 space-y-6">
              <div className="atlas-card p-8 space-y-6">
                <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                    <input type="text" className="input-atlas h-12 mt-1 w-full" defaultValue={user?.name || ''} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                    <input type="email" className="input-atlas h-12 mt-1 w-full bg-slate-50 text-slate-500 cursor-not-allowed border-none" defaultValue={user?.email || ''} readOnly />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</label>
                    <input type="text" className="input-atlas h-12 mt-1 w-full bg-slate-50 text-slate-500 cursor-not-allowed border-none uppercase" defaultValue={user?.role || 'Citizen'} readOnly />
                  </div>
                </div>

                <div className="pt-4">
                  <button className="btn-atlas-primary px-6 py-3">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

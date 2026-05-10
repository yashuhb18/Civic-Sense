import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Bell, Lock, Shield, Smartphone, Mail, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast.success('Password updated successfully!');
  };
  
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
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-[#E3FCF7] text-[#00684A]' : 'hover:bg-slate-50 text-slate-500'}`}
              >
                <User size={20} /> Profile Info
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${activeTab === 'notifications' ? 'bg-[#E3FCF7] text-[#00684A]' : 'hover:bg-slate-50 text-slate-500'}`}
              >
                <Bell size={20} /> Notifications
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-[#E3FCF7] text-[#00684A]' : 'hover:bg-slate-50 text-slate-500'}`}
              >
                <Lock size={20} /> Security
              </button>
            </div>

            {/* Content */}
            <div className="col-span-2 space-y-6">
              
              {activeTab === 'profile' && (
                <div className="atlas-card p-8 space-y-6 animate-slide-up">
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
                    <button className="btn-atlas-primary px-6 py-3" onClick={() => toast.success('Profile updated!')}>Save Changes</button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="atlas-card p-8 space-y-6 animate-slide-up">
                  <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-4">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                          <Mail size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Email Notifications</h4>
                          <p className="text-xs text-slate-500 font-medium mt-1">Receive updates about your reports via email.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00684A]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Push Notifications</h4>
                          <p className="text-xs text-slate-500 font-medium mt-1">Get instant alerts on your device for emergency updates.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00684A]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="atlas-card p-8 space-y-6 animate-slide-up">
                  <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-4">Account Security</h3>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 mb-6">
                      <Shield className="text-amber-600 shrink-0" size={20} />
                      <p className="text-xs text-amber-700 font-medium">Ensure your account is using a long, random password to stay secure.</p>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Password</label>
                      <input type="password" placeholder="••••••••" className="input-atlas h-12 mt-1 w-full" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Password</label>
                      <input type="password" placeholder="••••••••" className="input-atlas h-12 mt-1 w-full" required minLength="6" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="input-atlas h-12 mt-1 w-full" required minLength="6" />
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="flex items-center gap-2 btn-atlas-primary px-6 py-3">
                        <Key size={16} /> Change Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

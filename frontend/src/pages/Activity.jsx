import React from 'react';
import Sidebar from '../components/Sidebar';
import { Activity as ActivityIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Activity = () => {
  const activities = [
    { id: 1, type: 'resolved', title: 'Pothole Fixed - 1st Main Rd', time: '2 hours ago', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 2, type: 'progress', title: 'Streetlight repair in progress', time: '5 hours ago', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 3, type: 'new', title: 'New report submitted: Water leak', time: '1 day ago', icon: AlertCircle, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="flex bg-[#F9FBFA] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-72 p-10 pt-20 lg:pt-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recent Activity</h1>
            <p className="text-slate-500 font-medium mt-2">Track the status of your reports and community updates.</p>
          </div>
          
          <div className="atlas-card p-8">
            <div className="space-y-6">
              {activities.map((act) => (
                <div key={act.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                  <div className={`w-12 h-12 rounded-full ${act.bg} flex items-center justify-center ${act.color} shrink-0`}>
                    <act.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{act.title}</h4>
                    <p className="text-sm font-medium text-slate-500">{act.time}</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors w-full sm:w-auto">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;

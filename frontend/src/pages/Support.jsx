import React from 'react';
import Sidebar from '../components/Sidebar';
import { MessageSquare, FileText, Phone, Mail } from 'lucide-react';

const Support = () => {
  return (
    <div className="flex bg-[#F9FBFA] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-72 p-10 pt-20 lg:pt-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Help Center</h1>
            <p className="text-slate-500 font-medium mt-2">Get assistance and read our reporting guidelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="atlas-card p-8 hover:-translate-y-1 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-[#E3FCF7] rounded-xl flex items-center justify-center text-[#00684A] mb-6">
                <FileText size={24} />
              </div>
              <h3 className="font-black text-xl text-slate-900 mb-2">FAQ & Guidelines</h3>
              <p className="text-slate-500 font-medium">Learn how to capture good evidence and use the platform effectively.</p>
            </div>

            <div className="atlas-card p-8 hover:-translate-y-1 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="font-black text-xl text-slate-900 mb-2">Contact Support</h3>
              <p className="text-slate-500 font-medium">Need human help? Reach out to our 24/7 moderation team.</p>
            </div>
          </div>
          
          <div className="atlas-card p-8 bg-[#001E2B] text-white mt-8">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                   <h3 className="text-xl font-bold mb-2">Emergency Services</h3>
                   <p className="text-slate-400 font-medium text-sm">For immediate life-threatening emergencies, please bypass CivicSync and contact emergency services directly.</p>
                </div>
                <button className="px-6 py-3 bg-[#00ED64] text-[#001E2B] font-bold rounded-xl whitespace-nowrap hover:bg-[#00c653] transition-colors">
                   Call 911 / Emergency
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

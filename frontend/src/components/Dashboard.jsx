import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Plus, Search, Filter, Clock, CheckCircle, AlertCircle, 
  Map as MapIcon, ChevronRight, Activity, TrendingUp,
  LayoutDashboard, Settings, HelpCircle, LogOut, ShieldAlert, MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.get('/issues/my-issues');
        // Fix: Access the issues array from the paginated response object
        setIssues(response.data.issues || []);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'in-progress': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FBFA] pt-16">
      {/* 🟢 ATLAS STYLE SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-[calc(100vh-64px)] top-16">
        <div className="p-6 space-y-8 flex-1">
          <nav className="space-y-1">
            {[
              { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: true },
              { icon: <MapIcon size={18} />, label: 'Live Maps' },
              { icon: <Activity size={18} />, label: 'Activity' },
            ].map((item, i) => (
              <a 
                key={i}
                href="#" 
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all ${item.active ? 'bg-[#E3FCF7] text-[#00684A] border-l-4 border-[#00684A]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 mb-4">Configuration</p>
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">
                <Settings size={18} />
                Settings
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">
                <HelpCircle size={18} />
                Help Center
              </a>
            </nav>
          </div>
        </div>

        <div className="p-4 m-6 bg-[#001E2B] rounded-xl text-white space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#00ED64]">Professional Account</p>
          <p className="text-sm font-medium opacity-80">Access city-wide AI analytics and real-time alerts.</p>
          <button className="w-full py-2 bg-[#00ED64] text-[#001E2B] font-bold rounded text-xs hover:bg-[#00d65a] transition-all">
            Upgrade Now
          </button>
        </div>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors w-full"
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-[#E3FCF7] text-[#00684A] w-fit">
              <ShieldAlert size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Pulse Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight" style={{ color: '#001E2B' }}>Welcome, {user?.name}</h1>
            <p className="text-slate-500 font-medium text-sm" style={{ color: '#64748b' }}>Monitor and manage your community contributions in real-time.</p>
          </div>
          <Link to="/create-complaint">
            <button className="btn-atlas-primary h-14 px-8 shadow-lg shadow-[#00684A]/20">
              <Plus size={20} />
              New Report Cluster
            </button>
          </Link>
        </header>

        {/* 📊 STATS SECTION - ATLAS STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Contributions', value: issues.length, icon: <Activity className="text-[#00684A]" />, color: 'bg-[#E3FCF7]' },
            { label: 'Under AI Review', value: issues.filter(i => i.status === 'pending').length, icon: <Clock className="text-amber-600" />, color: 'bg-amber-50' },
            { label: 'Verified Resolutions', value: issues.filter(i => i.status === 'resolved').length, icon: <CheckCircle className="text-emerald-600" />, color: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="atlas-card p-8 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                <p className="text-4xl font-bold text-slate-900 tracking-tighter" style={{ color: '#001E2B' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 📋 REPORT LIST - ATLAS STYLE */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ color: '#001E2B' }}>Active Deployments</h2>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search reports..."
                  className="input-atlas pl-10 h-10 w-64 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="input-atlas h-10 text-sm w-32"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#E3FCF7] border-t-[#00684A] rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Fetching Data Clusters...</p>
            </div>
          ) : filteredIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredIssues.map((issue) => (
                <motion.div 
                  layout
                  key={issue._id}
                  className="atlas-card group overflow-hidden"
                >
                  <Link to={`/complaint/${issue._id}`}>
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={issue.imageUrl ? `${backendUrl}${issue.imageUrl}` : 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800&q=80'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={issue.title}
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border shadow-sm ${getStatusStyle(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className="px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest bg-white/90 text-slate-900 border border-white/20 shadow-sm">
                          {issue.priority || 'Medium'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#00684A] uppercase tracking-widest">
                        <MapPin size={10} />
                        {issue.department || 'General Public'}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#00684A] transition-colors line-clamp-1" style={{ color: '#001E2B' }}>{issue.title}</h3>
                      <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed" style={{ color: '#64748b' }}>
                        {issue.description}
                      </p>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          ID: {issue._id.slice(-6).toUpperCase()}
                        </span>
                        <ChevronRight className="text-[#00684A] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" size={18} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="atlas-card p-20 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Plus className="text-slate-200" size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900" style={{ color: '#001E2B' }}>No active reports found</p>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Start by reporting an infrastructure issue in your local community.</p>
              </div>
              <Link to="/create-complaint">
                <button className="btn-atlas-secondary">Create First Report</button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
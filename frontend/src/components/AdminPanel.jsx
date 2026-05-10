import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  AlertCircle, CheckCircle, Clock, MapPin, Trash2, CheckCircle2, 
  Activity, ShieldAlert, Users, TrendingUp, Download, Filter, Search,
  Menu, Bell, Settings, LayoutDashboard, Database, Globe, Eye, Image as ImageIcon,
  Terminal, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import IssueMap from './IssueMap';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Authorities State
  const [showAddOfficial, setShowAddOfficial] = useState(false);
  const [newOfficial, setNewOfficial] = useState({ name: '', dept: 'Infrastructure', role: '' });
  const [officials, setOfficials] = useState([
    { id: 1, name: 'Arjun Kumar', initials: 'AK', dept: 'Infrastructure', role: 'Chief Engineer', status: 'Active', color: 'indigo' },
    { id: 2, name: 'Sarah Menon', initials: 'SM', dept: 'Water Supply', role: 'Director', status: 'Active', color: 'emerald' },
    { id: 3, name: 'Ravi P.', initials: 'RP', dept: 'Public Safety', role: 'Coordinator', status: 'Offline', color: 'slate' },
  ]);

  // System Logs State
  const [logs, setLogs] = useState([
    `[${new Date(Date.now() - 500000).toISOString()}] INFO: Gov-Root updated issue 64b3a... status to 'resolved'.`,
    `[${new Date(Date.now() - 360000).toISOString()}] SECURITY: Blocked 3 unauthorized access attempts to /api/admin/purge.`,
    `[${new Date(Date.now() - 120000).toISOString()}] WARN: High volume of reports detected in zone 'Indiranagar'. Scaling auto-categorization workers.`,
    `[${new Date(Date.now() - 45000).toISOString()}] DB_SYNC: Replicated 14 new citizen reports to central MongoDB Atlas shard.`,
    `[${new Date(Date.now() - 10000).toISOString()}] AI_ENGINE: Processed image UUID-8472. Identified 'Pothole' (Confidence: 94%)`,
    `[${new Date().toISOString()}] INFO: Authenticated admin Gov-Root from IP 192.168.1.42`,
  ]);

  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'System Logs') {
      const interval = setInterval(() => {
        const fakeEvents = [
          "AI_ENGINE: Image classification complete. No hazards detected.",
          "NETWORK: Node 47 heartbeat ping successful.",
          "SECURITY: Anonymous connection closed safely.",
          "DB_SYNC: Optimizing geospatial indices...",
          "INFO: Fetching latest satellite overlay.",
          "WARN: High CPU utilization on Worker Node 3.",
          "INFO: User #4912 successfully registered."
        ];
        const event = fakeEvents[Math.floor(Math.random() * fakeEvents.length)];
        setLogs(prev => [...prev, `[${new Date().toISOString()}] ${event}`].slice(-25));
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [issuesRes, statsRes] = await Promise.all([
        api.get('/issues'),
        api.get('/issues/stats')
      ]);
      // Fix: Access the issues array from the paginated response object
      setIssues(issuesRes.data.issues || []);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to sync with central servers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/issues/${id}`, { status });
      toast.success(`Deployment updated to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Protocol failed. Try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Irreversible deletion of government records. Proceed?')) {
      try {
        await api.delete(`/issues/${id}`);
        toast.success('Record purged successfully');
        fetchData();
      } catch (error) {
        toast.error('Action blocked by security layer');
      }
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=100&q=60';
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    return `${backendUrl}${url}`;
  };

  const chartData = [
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'In Progress', value: stats.inProgress, color: '#6366F1' },
    { name: 'Resolved', value: stats.resolved, color: '#00684A' }
  ];

  const COLORS = ['#F59E0B', '#6366F1', '#00684A'];

  const handleAddOfficial = (e) => {
    e.preventDefault();
    if (!newOfficial.name || !newOfficial.role) return;
    const initials = newOfficial.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    setOfficials([...officials, { 
      id: Date.now(), 
      name: newOfficial.name, 
      initials, 
      dept: newOfficial.dept, 
      role: newOfficial.role, 
      status: 'Active', 
      color: 'blue' 
    }]);
    setNewOfficial({ name: '', dept: 'Infrastructure', role: '' });
    setShowAddOfficial(false);
    toast.success('Official access granted.');
  };

  return (
    <div className="flex min-h-screen bg-[#F9FBFA] pt-16">
      {/* 🟢 ADMIN SIDEBAR - ATLAS STYLE */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-[calc(100vh-64px)] top-16">
        <div className="p-6 space-y-8 flex-1">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 mb-4">Command Center</p>
            {[
              { icon: <LayoutDashboard size={18} />, label: 'Overview' },
              { icon: <Globe size={18} />, label: 'City Mesh' },
              { icon: <Users size={18} />, label: 'Authorities' },
              { icon: <Terminal size={18} />, label: 'System Logs' },
            ].map((item, i) => (
              <button 
                key={i}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all ${activeTab === item.label ? 'bg-[#E3FCF7] text-[#00684A] border-l-4 border-[#00684A]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#00684A] flex items-center justify-center text-white font-bold text-xs">A</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 uppercase">Gov-Root</span>
              <span className="text-[9px] font-medium text-emerald-600">Verified Identity</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 lg:ml-64 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-[#E3FCF7] text-[#00684A] w-fit">
              <ShieldAlert size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Global Governance Mode</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'Overview' && 'Municipal Overview'}
              {activeTab === 'City Mesh' && 'Live City Mesh'}
              {activeTab === 'Authorities' && 'Authority Management'}
              {activeTab === 'System Logs' && 'Security & System Logs'}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {activeTab === 'Overview' && 'Central command for cross-departmental issue resolution.'}
              {activeTab === 'City Mesh' && 'Geospatial visualization of active infrastructure reports.'}
              {activeTab === 'Authorities' && 'Manage departmental access and verified officials.'}
              {activeTab === 'System Logs' && 'Audit trail of administrative actions and AI system events.'}
            </p>
          </div>
          {activeTab === 'Overview' && (
            <button className="btn-atlas-secondary">
              <Download size={18} className="text-[#00684A]" />
              Export Health Report
            </button>
          )}
        </header>

        {activeTab === 'City Mesh' && (
          <div className="atlas-card p-2 h-[700px] animate-slide-up z-0 relative">
            <IssueMap />
          </div>
        )}

        {activeTab === 'Authorities' && (
          <div className="atlas-card p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Verified Officials</h3>
              <button onClick={() => setShowAddOfficial(true)} className="px-4 py-2 bg-[#00684A] text-white rounded font-bold text-sm">Add Official</button>
            </div>

            {/* ADD OFFICIAL MODAL */}
            {showAddOfficial && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Grant Official Access</h3>
                  <form onSubmit={handleAddOfficial} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Full Name</label>
                      <input type="text" className="input-atlas h-10 mt-1 text-sm" value={newOfficial.name} onChange={e => setNewOfficial({...newOfficial, name: e.target.value})} required placeholder="E.g. Jane Doe" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Department</label>
                      <select className="input-atlas h-10 mt-1 text-sm" value={newOfficial.dept} onChange={e => setNewOfficial({...newOfficial, dept: e.target.value})}>
                        <option>Infrastructure</option>
                        <option>Water Supply</option>
                        <option>Public Safety</option>
                        <option>Sanitation</option>
                        <option>Transportation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Role / Title</label>
                      <input type="text" className="input-atlas h-10 mt-1 text-sm" value={newOfficial.role} onChange={e => setNewOfficial({...newOfficial, role: e.target.value})} required placeholder="E.g. Senior Inspector" />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setShowAddOfficial(false)} className="flex-1 btn-atlas-secondary">Cancel</button>
                      <button type="submit" className="flex-1 btn-atlas-primary">Add Authority</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <table className="w-full text-left mt-4">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="p-4 rounded-tl-lg">Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-sm">
                {officials.map(official => (
                  <tr key={official.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-${official.color}-100 flex items-center justify-center text-${official.color}-700 font-bold text-xs shrink-0`}>
                        {official.initials}
                      </div>
                      <span className="text-slate-900 font-semibold">{official.name}</span>
                    </td>
                    <td className="p-4 text-slate-600">{official.dept}</td>
                    <td className="p-4 text-slate-600">{official.role}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${official.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {official.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'System Logs' && (
          <div className="atlas-card p-6 bg-slate-900 font-mono text-xs overflow-y-auto h-[600px] animate-slide-up flex flex-col">
            <div className="mb-4 text-slate-400 flex justify-between border-b border-slate-800 pb-4">
              <span className="font-bold tracking-widest">SYSTEM AUDIT TRAIL</span>
              <span className="opacity-50">Press CTRL+C to abort</span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-4 custom-scrollbar">
              {logs.map((log, i) => {
                let colorClass = 'text-emerald-400 !important';
                if (log.includes('WARN')) colorClass = 'text-amber-400 !important';
                if (log.includes('SECURITY') || log.includes('ERROR')) colorClass = 'text-rose-400 !important';
                if (log.includes('INFO') || log.includes('NETWORK')) colorClass = 'text-blue-400 !important';
                if (log.includes('AI_ENGINE')) colorClass = 'text-purple-400 !important';
                
                return (
                  <p key={i} className="leading-relaxed" style={{ color: colorClass.includes('emerald') ? '#34d399' : colorClass.includes('amber') ? '#fbbf24' : colorClass.includes('rose') ? '#fb7185' : colorClass.includes('blue') ? '#60a5fa' : colorClass.includes('purple') ? '#c084fc' : '#34d399' }}>
                    {log}
                  </p>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3" style={{ color: '#34d399' }}>
              <Terminal size={16} />
              <div className="flex-1 flex">
                <span className="mr-2">gov-root@civicsync:~$</span>
                <span className="animate-pulse w-2 h-4 bg-emerald-400 block mt-0.5" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Overview' && (
          <div className="animate-slide-up">
        {/* 📊 CORE METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Ingress', value: stats.total, icon: <Database className="text-slate-600" />, color: 'bg-slate-100' },
            { label: 'Awaiting Action', value: stats.pending, icon: <Clock className="text-amber-600" />, color: 'bg-amber-50' },
            { label: 'In Deployment', value: stats.inProgress, icon: <Activity className="text-indigo-600" />, color: 'bg-indigo-50' },
            { label: 'Completed', value: stats.resolved, icon: <CheckCircle2 className="text-[#00684A]" />, color: 'bg-[#E3FCF7]' },
          ].map((stat, i) => (
            <div key={i} className="atlas-card p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tighter">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 📈 ANALYTICS ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          <div className="xl:col-span-2 atlas-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Incident Distribution</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-50 border border-slate-100">
                <TrendingUp size={14} className="text-[#00684A]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Stats</span>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="atlas-card p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-[#E3FCF7] rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <Activity className="text-[#00684A]" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Health Index</h3>
              <p className="text-slate-500 text-sm font-medium">Municipal performance is currently 12% higher than last quarter.</p>
            </div>
            <div className="w-full pt-6 border-t border-slate-100 flex justify-around">
              <div>
                <p className="text-2xl font-bold text-[#00684A]">98.2%</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">2.1s</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AI Latency</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📋 DEPLOYMENT TABLE - ATLAS STYLE */}
        <div className="atlas-card overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Active Deployments</h3>
              <p className="text-slate-500 text-sm font-medium">Verify and monitor live citizen reports across the city mesh.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter records..."
                  className="input-atlas h-10 pl-9 text-xs w-48"
                />
              </div>
              <button className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-500 hover:text-[#00684A] transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4">Evidence</th>
                  <th className="px-6 py-4">Title & Context</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issues.map((issue) => (
                  <motion.tr 
                    layout
                    key={issue._id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img 
                          src={getFullImageUrl(issue.imageUrl)}
                          alt={issue.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <Link to={`/complaint/${issue._id}`} className="font-bold text-slate-900 group-hover:text-[#00684A] transition-colors hover:underline underline-offset-2">
                          {issue.title}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-mono mt-1">UUID: {issue._id.slice(-12)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${
                        issue.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        issue.status === 'in-progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                        <MapPin size={14} className="text-slate-400" />
                        {issue.department || 'Infrastructure'}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100`}>
                        {issue.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/complaint/${issue._id}`}
                          className="p-2 text-[#00684A] hover:bg-[#E3FCF7] rounded transition-colors"
                          title="View Full Details"
                        >
                          <Eye size={18} />
                        </Link>
                        {issue.status !== 'resolved' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(issue._id, 'in-progress')}
                              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded transition-colors"
                              title="Deploy Team"
                            >
                              <Activity size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(issue._id, 'resolved')}
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded transition-colors"
                              title="Resolve Incident"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(issue._id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                          title="Purge Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;

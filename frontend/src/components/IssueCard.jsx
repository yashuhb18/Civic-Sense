import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Share2, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from './ui/Badge';
import Button from './ui/Button';

const IssueCard = ({ issue, onStatusUpdate, isAdmin = false }) => {
  const statusConfig = {
    submitted: { variant: 'warning', label: 'Submitted' },
    pending: { variant: 'warning', label: 'Pending' },
    'under-review': { variant: 'info', label: 'Under Review' },
    'team-assigned': { variant: 'info', label: 'Team Assigned' },
    'in-progress': { variant: 'info', label: 'In Progress' },
    resolved: { variant: 'success', label: 'Resolved' },
    rejected: { variant: 'danger', label: 'Rejected' }
  };

  const priorityConfig = {
    Low: { variant: 'default' },
    Medium: { variant: 'info' },
    High: { variant: 'warning' },
    Emergency: { variant: 'danger' }
  };

  const getFullImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/600x400?text=CivicSync+No+Image';
    const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${backendUrl}${url}`;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card group hover:border-indigo-500/30 transition-all duration-500"
    >
      <Link to={`/complaint/${issue._id}`}>
        <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8">
          <img 
            src={getFullImageUrl(issue.imageUrl)} 
            alt={issue.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute top-5 right-5 flex gap-2">
            <Badge variant={statusConfig[issue.status]?.variant}>
              {statusConfig[issue.status]?.label}
            </Badge>
            <Badge variant={priorityConfig[issue.priority]?.variant}>
              {issue.priority}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
            <div className="w-full btn-premium btn-premium-primary backdrop-blur-md bg-white/20 border-white/30 text-white hover:bg-white/40">
              View Details
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <Link to={`/complaint/${issue._id}`} className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">{issue.category}</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {issue.title}
            </h3>
          </Link>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <p className="text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed">
          {issue.description}
        </p>

        <div className="flex flex-wrap gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <MapPin size={14} className="text-indigo-500" />
            <span className="line-clamp-1">{issue.location?.address || 'Location Shared'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Clock size={14} className="text-indigo-500" />
            <span>{format(new Date(issue.createdAt), 'MMM dd, yyyy')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-900 dark:text-white ring-4 ring-white dark:ring-slate-900">
              {issue.reportedBy?.name?.[0] || 'U'}
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{issue.reportedBy?.name || 'User'}</p>
              <p className="text-[10px] font-bold text-slate-400">CITIZEN REPORTER</p>
            </div>
          </div>

          {isAdmin && (
            <select 
              value={issue.status}
              onChange={(e) => onStatusUpdate(issue._id, e.target.value)}
              className="text-xs font-black px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="under-review">Under Review</option>
              <option value="team-assigned">Team Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, Clock, AlertCircle, CheckCircle2, 
  ChevronLeft, MessageSquare, Share2, Activity,
  Calendar, Shield, ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../services/api';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const response = await api.get(`/issues/${id}`);
      setIssue(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load issue details');
      navigate('/dashboard');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FBFA]">
      <div className="w-12 h-12 border-4 border-[#E3FCF7] border-t-[#00684A] rounded-full animate-spin"></div>
    </div>
  );

  if (!issue) return null;

  const statusColors = {
    submitted: 'bg-amber-50 text-amber-600 border-amber-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    'under-review': 'bg-blue-50 text-blue-600 border-blue-100',
    'team-assigned': 'bg-cyan-50 text-cyan-600 border-cyan-100',
    'in-progress': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    resolved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected: 'bg-rose-50 text-rose-600 border-rose-100'
  };

  const getIssueImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800&q=80';
    return `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
  };

  const hasValidLocation = issue.location && issue.location.lat && issue.location.lng;

  return (
    <div className="min-h-screen bg-[#F9FBFA] pt-20 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-[#00684A] font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#00684A] transition-colors">
              <Share2 size={18} />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#00684A] transition-colors">
              <MessageSquare size={18} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg group">
              <img 
                src={getIssueImageUrl(issue.imageUrl)} 
                alt={issue.title} 
                className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-3">
                <span className="px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest backdrop-blur-md bg-white/90 shadow-md text-slate-900">
                  {issue.category}
                </span>
                <span className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest border backdrop-blur-md shadow-md ${statusColors[issue.status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                  {issue.status}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {format(new Date(issue.createdAt), 'MMMM dd, yyyy')}
                </div>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <Shield size={12} />
                  Case #{issue._id.slice(-6).toUpperCase()}
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#001E2B' }}>
                {issue.title}
              </h1>
              <p className="text-lg font-medium leading-relaxed" style={{ color: '#64748b' }}>
                {issue.description}
              </p>
            </div>

            {/* AI Analysis Card (if available) */}
            {issue.aiPriorityScore > 0 && (
              <div className="atlas-card p-6 bg-[#E3FCF7]/30 border-[#00684A]/10 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#00684A]">AI Analysis Report</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Priority Score</p>
                    <p className="text-2xl font-bold text-[#00684A]">{issue.aiPriorityScore}/100</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Department</p>
                    <p className="text-sm font-bold" style={{ color: '#001E2B' }}>{issue.department || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Impact</p>
                    <p className="text-xs font-medium text-slate-600">{issue.impactSummary || 'Not assessed'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Location Map */}
            {hasValidLocation && (
              <div className="atlas-card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-[#00684A]" size={18} />
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: '#001E2B' }}>Incident Location</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Lat: {issue.location.lat.toFixed(4)} | Lng: {issue.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={`https://www.google.com/maps?q=${issue.location.lat},${issue.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-atlas-secondary text-xs py-2 px-4"
                  >
                    Open in Google Maps
                  </a>
                </div>
                <div style={{ height: '300px' }}>
                  <MapContainer
                    center={[issue.location.lat, issue.location.lng]}
                    zoom={15}
                    className="h-full w-full z-0"
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[issue.location.lat, issue.location.lng]}>
                      <Popup>
                        <strong>{issue.title}</strong><br />
                        {issue.category} - {issue.status}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Timeline */}
          <div className="space-y-8">
            <div className="atlas-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <Activity size={20} className="text-[#00684A]" />
                <h2 className="text-xl font-bold tracking-tight" style={{ color: '#001E2B' }}>Live Tracking</h2>
              </div>

              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />

                {issue.timeline?.map((event, index) => (
                  <div key={index} className="relative pl-12">
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center ${
                      index === 0 ? 'bg-[#00684A] text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {index === 0 ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                      </p>
                      <h4 className="text-sm font-bold mb-1" style={{ color: '#001E2B' }}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </h4>
                      <p className="text-xs font-medium leading-relaxed" style={{ color: '#64748b' }}>
                        {event.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporter Info */}
            <div className="atlas-card p-8 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">Reported By</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E3FCF7] rounded-full flex items-center justify-center text-[#00684A] font-bold text-lg">
                  {issue.reportedBy?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#001E2B' }}>{issue.reportedBy?.name || 'Citizen'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Identity</p>
                </div>
              </div>
            </div>

            {/* Upvotes */}
            <div className="atlas-card p-8 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">Community Support</h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-[#00684A]">{issue.upvotes?.length || 0}</div>
                <p className="text-xs font-medium text-slate-500">citizens have upvoted this report</p>
              </div>
            </div>

            {/* Assignment */}
            <div className="atlas-card p-8 bg-[#E3FCF7]/30 border-[#00684A]/10">
              <h3 className="font-bold text-xs uppercase tracking-widest text-[#00684A] mb-4">Official Assignment</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                This case has been assigned to the city management team. Updates will appear in the timeline.
              </p>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-[#E3FCF7] text-[#00684A] rounded-lg flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Assigned to</p>
                  <p className="text-xs font-bold" style={{ color: '#001E2B' }}>{issue.department || 'City Works Dept'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;

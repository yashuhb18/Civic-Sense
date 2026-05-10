import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { 
  Camera, MapPin, Send, AlertCircle, CheckCircle, 
  Upload, ShieldAlert, ArrowLeft, Loader2, Sparkles,
  X, Brain, Zap, Target, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map click handler component
const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

// Map center updater component
const MapUpdater = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, 15);
  }, [center, map]);
  return null;
};

const CreateIssue = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946, address: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'Roads', label: 'Roads & Transport', icon: '🛣️' },
    { value: 'Water', label: 'Water Supply', icon: '🚰' },
    { value: 'Electricity', label: 'Electricity', icon: '⚡' },
    { value: 'Waste', label: 'Waste Management', icon: '🗑️' },
    { value: 'Sanitation', label: 'Sanitation', icon: '🧹' },
    { value: 'Safety', label: 'Public Safety', icon: '🛡️' },
    { value: 'Other', label: 'Others', icon: '📦' },
  ];

  // Smart AI auto-categorization based on keywords
  const handleDescriptionChange = (val) => {
    setDescription(val);
    const text = val.toLowerCase();
    if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('drain')) {
      setCategory('Water');
    } else if (text.includes('light') || text.includes('power') || text.includes('electric') || text.includes('pole')) {
      setCategory('Electricity');
    } else if (text.includes('road') || text.includes('pothole') || text.includes('traffic') || text.includes('bridge')) {
      setCategory('Roads');
    } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dump')) {
      setCategory('Waste');
    } else if (text.includes('danger') || text.includes('unsafe') || text.includes('crime') || text.includes('accident')) {
      setCategory('Safety');
    }
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    handleDescriptionChange(val); // Also trigger auto-categorization from title
  };

  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAiResult(null); // Reset previous AI result
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  // 🤖 AI IMAGE ANALYSIS - calls backend /issues/analyze-image
  const analyzeWithAI = async () => {
    if (!image) {
      toast.error('Upload an image first for AI analysis.');
      return;
    }
    setAiLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('language', 'English');

      const response = await api.post('/issues/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;
      setAiResult(data);

      // Auto-fill form fields from AI
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.category) setCategory(data.category);

      toast.success('AI Analysis Complete! Fields auto-populated.');
    } catch (error) {
      toast.error('AI analysis failed. Fill in details manually.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleLocationSelect = (latlng) => {
    setLocation({ lat: latlng.lat, lng: latlng.lng, address: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}` });
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Detecting location...', { id: 'location' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          handleLocationSelect(latlng);
          toast.success('Live location detected!', { id: 'location' });
        },
        (error) => {
          console.error(error);
          toast.error('Failed to detect location. Please ensure location services are allowed in your browser settings.', { id: 'location' });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error('Please select a category.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('priority', priority);
    formData.append('location', JSON.stringify(location));
    if (aiResult?.aiPriorityScore) formData.append('aiPriorityScore', aiResult.aiPriorityScore);
    if (aiResult?.impactSummary) formData.append('impactSummary', aiResult.impactSummary);
    if (aiResult?.department) formData.append('department', aiResult.department);
    if (image) formData.append('image', image);

    try {
      await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Report submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBFA] pt-20 pb-20 selection:bg-[#E3FCF7]">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-[#00684A] font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all mb-4"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#001E2B' }}>
              Report Infrastructure Issue
            </h1>
            <p className="text-slate-500 font-medium" style={{ color: '#64748b' }}>
              Submit a verified incident with AI analysis and precise GPS location.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* ========== LEFT COLUMN: FORM (3/5) ========== */}
              <div className="lg:col-span-3 space-y-8">

                {/* 📸 IMAGE UPLOAD + AI ANALYSIS */}
                <div className="atlas-card p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <Camera className="text-[#00684A]" size={20} />
                      <h3 className="font-bold text-xs uppercase tracking-widest" style={{ color: '#001E2B' }}>
                        Photo Evidence & AI Analysis
                      </h3>
                    </div>
                    {image && (
                      <button
                        type="button"
                        onClick={analyzeWithAI}
                        disabled={aiLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#00684A] text-white text-xs font-bold hover:bg-[#00593f] transition-all shadow-md shadow-[#00684A]/20 disabled:opacity-50"
                      >
                        {aiLoading ? (
                          <><Loader2 className="animate-spin" size={14} /> Analyzing...</>
                        ) : (
                          <><Brain size={14} /> Run AI Analysis</>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden
                      ${dragActive ? 'border-[#00684A] bg-[#E3FCF7]/50 scale-[1.01]' : 'border-slate-200 hover:border-[#00684A]/40 bg-slate-50/50'}
                      ${preview ? 'h-64 border-none' : 'h-48'}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {preview ? (
                      <div className="relative w-full h-full group">
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2">
                            <X size={18} /> Replace Image
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                        <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
                          <Upload size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Drag & Drop or Click to Upload</span>
                      </div>
                    )}
                  </div>

                  {/* 🤖 AI RESULTS PANEL */}
                  <AnimatePresence>
                    {aiResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl bg-[#E3FCF7]/50 border border-[#00684A]/10 p-6 space-y-4"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="text-[#00684A]" size={16} />
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#00684A]">AI Analysis Results</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Priority Score</p>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-[#00684A] h-2 rounded-full transition-all"
                                  style={{ width: `${aiResult.aiPriorityScore || 0}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-[#00684A]">{aiResult.aiPriorityScore || 0}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Department</p>
                            <p className="text-sm font-bold" style={{ color: '#001E2B' }}>
                              <Building2 size={12} className="inline mr-1" />
                              {aiResult.department || 'General'}
                            </p>
                          </div>
                        </div>
                        {aiResult.impactSummary && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Impact Summary</p>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed">{aiResult.impactSummary}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 📝 FORM FIELDS */}
                <div className="atlas-card p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Incident Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Critical Road Damage on Main St"
                      className="input-atlas h-12"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Detailed Description</label>
                    <textarea
                      placeholder="Provide detailed context for the municipal authorities..."
                      className="input-atlas min-h-[120px] py-3 resize-none"
                      value={description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      required
                    />
                  </div>

                  {/* Category Selection - Visual Buttons */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Incident Category
                      {category && <span className="text-[#00684A] ml-2">✓ {category} selected</span>}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-bold transition-all duration-200
                            ${category === cat.value
                              ? 'bg-[#00684A] border-[#00684A] text-white shadow-lg shadow-[#00684A]/20'
                              : 'bg-white border-slate-100 text-slate-600 hover:border-[#00684A]/30'}`}
                        >
                          <span>{cat.icon}</span>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Severity Level</label>
                      <select
                        className="input-atlas h-12 text-sm"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="Low">Low - Minor Issue</option>
                        <option value="Medium">Medium - Normal Priority</option>
                        <option value="High">High - Urgent Response</option>
                        <option value="Emergency">🚨 Emergency - Immediate Action</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          placeholder="Auto-filled from map pin"
                          className="input-atlas pl-11 h-12 text-sm"
                          value={location.address}
                          onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-atlas-primary w-full h-14 text-base shadow-xl shadow-[#00684A]/20"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <Loader2 className="animate-spin" size={20} /> TRANSMITTING...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={18} /> Submit Verified Report
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ========== RIGHT COLUMN: MAP + INFO (2/5) ========== */}
              <div className="lg:col-span-2 space-y-8">

                {/* 🗺️ LIVE MAP - Pin Location */}
                <div className="atlas-card p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <Target className="text-[#00684A]" size={18} />
                      <h3 className="font-bold text-xs uppercase tracking-widest" style={{ color: '#001E2B' }}>
                        Live Map — Pin Location
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={detectLocation}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#E3FCF7] text-[#00684A] text-[10px] font-bold uppercase tracking-widest hover:bg-[#00684A] hover:text-white transition-all"
                    >
                      <MapPin size={12} />
                      Detect Live Location
                    </button>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-200" style={{ height: '350px' }}>
                    <MapContainer
                      center={[location.lat, location.lng]}
                      zoom={13}
                      className="h-full w-full z-0"
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <MapUpdater center={[location.lat, location.lng]} />
                      <LocationPicker onLocationSelect={handleLocationSelect} />
                      <Marker position={[location.lat, location.lng]} />
                    </MapContainer>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Lat: {location.lat.toFixed(4)}</span>
                    <span>Lng: {location.lng.toFixed(4)}</span>
                  </div>
                </div>

                {/* Info Card */}
                <div className="atlas-card p-6 bg-[#E3FCF7]/50 border-[#00684A]/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-[#00684A]" size={18} />
                    <h4 className="font-bold text-[10px] uppercase tracking-widest text-[#00684A]">AI Smart Features</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#00684A] mt-0.5 shrink-0" /> Upload a photo and click <strong>"Run AI Analysis"</strong> to auto-fill all fields.</li>
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#00684A] mt-0.5 shrink-0" /> AI auto-detects category from your title and description.</li>
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#00684A] mt-0.5 shrink-0" /> Click anywhere on the live map to pin the exact GPS location.</li>
                  </ul>
                </div>

                {/* Protocol Notice */}
                <div className="atlas-card p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-[#00684A]" size={18} />
                    <h4 className="font-bold text-[10px] uppercase tracking-widest" style={{ color: '#001E2B' }}>Protocol Notice</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    By submitting this report, you verify that the information is accurate. High-resolution photo evidence increases AI priority scoring and speeds up response time.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateIssue;

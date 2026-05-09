import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, MapPin, AlertCircle, Sparkles, 
  ChevronRight, X, Image as ImageIcon, CheckCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from './ui/Button';
import api from '../services/api';

const IssueForm = ({ onIssueCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads',
    priority: 'Medium',
    lat: '',
    lng: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: 'Roads', label: 'Roads & Transport', icon: '🛣️' },
    { value: 'Water', label: 'Water Supply', icon: '🚰' },
    { value: 'Electricity', label: 'Electricity', icon: '⚡' },
    { value: 'Waste', label: 'Waste Management', icon: '🗑️' },
    { value: 'Safety', label: 'Public Safety', icon: '🛡️' },
    { value: 'Others', label: 'Others', icon: '📦' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImage(e.dataTransfer.files[0]);
    }
  };

  const handleImage = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Smart Category Suggestion (Basic keyword matching)
    if (e.target.name === 'description' || e.target.name === 'title') {
      const text = e.target.value.toLowerCase();
      if (text.includes('water') || text.includes('leak') || text.includes('pipe')) {
        setFormData(prev => ({ ...prev, category: 'Water' }));
      } else if (text.includes('light') || text.includes('power') || text.includes('electric')) {
        setFormData(prev => ({ ...prev, category: 'Electricity' }));
      } else if (text.includes('road') || text.includes('pothole') || text.includes('traffic')) {
        setFormData(prev => ({ ...prev, category: 'Roads' }));
      } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash')) {
        setFormData(prev => ({ ...prev, category: 'Waste' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'lat' || key === 'lng') return;
        data.append(key, formData[key]);
      });
      
      const latValue = parseFloat(formData.lat) || 0;
      const lngValue = parseFloat(formData.lng) || 0;
      
      data.append('location', JSON.stringify({
        lat: latValue,
        lng: lngValue,
        address: 'Manually specified location'
      }));
      
      if (image) {
        data.append('image', image);
      }

      await api.post('/issues', data);

      toast.success('Official report submitted successfully!');
      setFormData({ title: '', description: '', category: 'Roads', priority: 'Medium', lat: '', lng: '' });
      setImage(null);
      setPreview(null);
      if (onIssueCreated) onIssueCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="premium-card max-w-4xl mx-auto space-y-12 animate-slide-up">
      <div className="flex items-center gap-6 mb-4">
        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
          <Sparkles size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight">Report New Issue</h2>
          <p className="text-slate-500 font-medium">Precision civic reporting for immediate action.</p>
        </div>
      </div>

      {/* Image Upload Area */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Visual Evidence</label>
        <div 
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
          className={`relative h-64 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-center items-center justify-center cursor-pointer overflow-hidden
            ${dragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50'}
            ${preview ? 'border-none' : ''}`}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
            accept="image/*"
          />
          
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 w-full h-full"
              >
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-2">
                    <X size={18} />
                    Replace Image
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 p-8"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm mx-auto flex items-center justify-center text-indigo-600">
                  <Upload size={28} />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">Drag & Drop Image</p>
                  <p className="text-sm text-slate-400 font-medium">or click to browse from device</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Complaint Title</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Broken Water Pipe Main St"
            className="input-premium"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Category Selection</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData(p => ({...p, category: cat.value}))}
                className={`flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm transition-all duration-300
                  ${formData.category === cat.value 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Description of Issue</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please provide as much detail as possible..."
          className="input-premium min-h-[160px] resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Priority Level</label>
          <select 
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input-premium"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Emergency">🚨 Emergency</option>
          </select>
        </div>
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Latitude</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
            <input 
              type="number" 
              step="any"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              placeholder="12.9716"
              className="input-premium pl-12"
              required
            />
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Longitude</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
            <input 
              type="number" 
              step="any"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              placeholder="77.5946"
              className="input-premium pl-12"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-16 text-xl rounded-[1.5rem]" 
          isLoading={loading}
        >
          {loading ? 'Processing Protocol...' : 'Transmit Official Report'}
          {!loading && <ChevronRight size={24} />}
        </Button>
      </div>
    </form>
  );
};

export default IssueForm;

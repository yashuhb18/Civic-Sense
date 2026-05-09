import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const IssueMap = ({ category, status }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchIssues();
  }, [category, status]);

  const fetchIssues = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (status) params.status = status;
      const response = await api.get('/issues', { params });
      setIssues(response.data);
    } catch (error) {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (issueId) => {
    try {
      await api.post(`/issues/${issueId}/upvote`);
      fetchIssues();
      toast.success('Vote updated!');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  if (loading) return (
    <div className="h-[500px] w-full flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-200">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading live map data...</p>
      </div>
    </div>
  );

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="h-[600px] w-full rounded-3xl z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {issues.map(issue => (
        issue.location && issue.location.lat && (
          <Marker
            key={issue._id}
            position={[issue.location.lat, issue.location.lng]}
          >
            <Popup className="custom-popup">
              <div className="w-64 overflow-hidden">
                {issue.imageUrl && (
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${issue.imageUrl}`}
                    alt={issue.title}
                    className="w-full h-32 object-cover rounded-t-lg -mt-4 -mx-4 mb-3"
                  />
                )}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 leading-tight">{issue.title}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      issue.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                      issue.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{issue.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center text-slate-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="text-sm font-bold">{issue.upvotes?.length || 0}</span>
                    </div>
                    {user && (
                      <button
                        onClick={() => handleUpvote(issue._id)}
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                      >
                        Upvote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default IssueMap;
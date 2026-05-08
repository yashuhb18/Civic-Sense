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

const getCategoryColor = (category) => {
  const colors = {
    pothole: 'red',
    garbage: 'green',
    streetlight: 'blue',
    other: 'orange'
  };
  return colors[category] || 'gray';
};

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

  if (loading) return <div className="text-center py-8">Loading map...</div>;

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: '500px', width: '100%' }}
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
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{issue.title}</h3>
                <p className="text-sm text-gray-600">{issue.description}</p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">Status:</span> {issue.status}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Category:</span> {issue.category}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Upvotes:</span> {issue.upvotes?.length || 0}
                </p>
                {issue.imageUrl && (
                  <img
                    src={`http://localhost:5000${issue.imageUrl}`}
                    alt="Issue"
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
                {user && (
                  <button
                    onClick={() => handleUpvote(issue._id)}
                    className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                  >
                    Upvote
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default IssueMap;
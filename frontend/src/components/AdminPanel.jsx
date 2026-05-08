import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <p>Welcome Admin {user?.name}!</p>
      <p className="mt-4 text-gray-600">Admin controls will appear here.</p>
    </div>
  );
};

export default AdminPanel;
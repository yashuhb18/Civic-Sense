import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">My Dashboard</h2>
      <p>Welcome {user?.name}! This is your dashboard.</p>
      <p className="mt-4 text-gray-600">Your reported issues will appear here soon.</p>
    </div>
  );
};

export default Dashboard;
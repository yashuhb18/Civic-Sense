import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to Smart Local Problem Reporter</h2>
        <p className="text-gray-600">
          Report civic issues in your area, track their status, and help prioritize problems that matter most to your community.
        </p>
        {!user && (
          <div className="mt-4">
            <p className="text-gray-600">Please login or register to report issues.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
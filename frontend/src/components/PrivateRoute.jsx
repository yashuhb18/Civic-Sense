import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  if (!adminOnly && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;

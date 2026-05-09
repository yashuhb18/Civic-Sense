import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import IssueDetails from './pages/IssueDetails';
import CreateIssue from './pages/CreateIssue';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white transition-colors duration-500">
          <Routes>
            {/* Public Routes with Navbar */}
            <Route path="/" element={<><Navbar /><main className="container mx-auto px-6 py-12"><Home /></main></>} />
            <Route path="/login" element={<><Navbar /><main className="container mx-auto px-6 py-12"><Login /></main></>} />
            <Route path="/register" element={<><Navbar /><main className="container mx-auto px-6 py-12"><Register /></main></>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/create-complaint" element={
              <PrivateRoute>
                <CreateIssue />
              </PrivateRoute>
            } />
            <Route path="/complaint/:id" element={
              <PrivateRoute>
                <IssueDetails />
              </PrivateRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <PrivateRoute adminOnly>
                <AdminPanel />
              </PrivateRoute>
            } />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'hot-toast-atlas',
              success: { iconTheme: { primary: '#00684A', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

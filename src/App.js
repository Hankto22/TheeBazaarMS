import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import DemoBanner from './components/DemoBanner.tsx';
import IOSInstallPrompt from './components/IOSInstallPrompt.js';
import ProtectedRoute from './components/ProtectedRoute';
import Carwash from './pages/Carwash.tsx';
import WashHistory from './pages/WashHistory.tsx';
import Customers from './pages/Customers.tsx';
import Services from './pages/Services.tsx';
import Reports from './pages/Reports.tsx';
import Promos from './pages/Promos.tsx';
import Inventory from './pages/Inventory.tsx';
import Staff from './pages/Staff.tsx';
import Settings from './pages/Settings.tsx';
import reportWebVitals from './reportWebVitals.js';
import { syncPendingChanges } from './api/syncService';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  useEffect(() => {
    syncPendingChanges(); // on load

    const handler = () => {
      syncPendingChanges();
    };

    window.addEventListener('online', handler);
    return () => window.removeEventListener('online', handler);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <DemoBanner />
        <IOSInstallPrompt />
        <Layout>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Carwash /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><WashHistory /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute requiredRole="admin"><Reports /></ProtectedRoute>} />
            <Route path="/promos" element={<ProtectedRoute requiredRole="admin"><Promos /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute requiredRole="admin"><Inventory /></ProtectedRoute>} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

// Call reportWebVitals to measure performance
reportWebVitals();

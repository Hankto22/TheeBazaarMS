import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import DemoBanner from './components/DemoBanner.tsx';
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
import './App.css';

function App() {
  return (
    <Router>
      <DemoBanner />
      <Layout>
        <Routes>
          <Route path="/" element={<Carwash />} />
          <Route path="/history" element={<WashHistory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/promos" element={<Promos />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

// Call reportWebVitals to measure performance
reportWebVitals();

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/TheeBazaar Logo.jpg';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Carwash', icon: '🚗' },
    { path: '/history', label: 'History', icon: '📋' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/services', label: 'Services', icon: '🛠️' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/promos', label: 'Promos', icon: '🎁' },
    { path: '/staff', label: 'Staff', icon: '👷' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/reports', label: 'Reports', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <img src={logo} alt="Thee Bazaar Logo" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold text-blue-600">Thee Bazaar</h1>
              <div className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
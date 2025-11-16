import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState('admin'); // default to admin for demo

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) setRole(savedRole);
  }, []);

  const allNavItems = [
    { path: '/', label: 'Carwash', icon: '🚗', roles: ['admin', 'cashier', 'attendant'] },
    { path: '/history', label: 'History', icon: '📋', roles: ['admin', 'cashier', 'attendant'] },
    { path: '/customers', label: 'Customers', icon: '👥', roles: ['admin', 'cashier', 'attendant'] },
    { path: '/services', label: 'Services', icon: '🛠️', roles: ['admin', 'cashier'] },
    { path: '/inventory', label: 'Inventory', icon: '📦', roles: ['admin'] },
    { path: '/promos', label: 'Promos', icon: '🎁', roles: ['admin', 'cashier'] },
    { path: '/staff', label: 'Staff', icon: '👷', roles: ['admin'] },
    { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['admin', 'cashier'] },
    { path: '/reports', label: 'Reports', icon: '📊', roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <img src="/logo192.jpeg" alt="Thee Bazaar Logo" className="h-12 w-12 rounded-lg object-contain" />
              <h1 className="text-2xl font-bold text-blue-600">Thee Bazaar</h1>
              {/* Desktop Nav */}
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
            {/* Hamburger button (mobile only) */}
            <button
              className="md:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setIsOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="p-4 border-b">
          <button
            className="float-right text-gray-600 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <img src="/logo192.jpeg" alt="Thee Bazaar Logo" className="h-10 w-10 rounded-lg object-contain mb-2" />
          <h2 className="text-lg font-bold text-blue-600">Thee Bazaar</h2>
        </div>
        <div className="p-4">
          {/* Role Selector for Demo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role (Demo)</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                localStorage.setItem('userRole', e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
              <option value="attendant">Attendant</option>
            </select>
          </div>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
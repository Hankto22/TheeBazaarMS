import React, { useEffect, useState } from 'react';
import { getStaff, createStaff, updateStaff, startShift, endShift } from '../services/api';
import type { Staff } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Staff() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier',
    password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await getStaff();
      setStaff(res.data);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, formData);
      } else {
        await createStaff({ ...formData, isActive: true });
      }

      setFormData({ name: '', email: '', role: 'cashier', password: '' });
      setShowForm(false);
      setEditingStaff(null);
      loadStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      password: '', // Don't populate password for security
    });
    setShowForm(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        setShowLoginForm(false);
        setLoginData({ email: '', password: '' });
        loadStaff(); // Refresh to show updated shift info
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  const handleStartShift = async () => {
    if (!user) return;
    try {
      await startShift({ staffId: user.id });
      loadStaff();
    } catch (error) {
      console.error('Error starting shift:', error);
    }
  };

  const handleEndShift = async (shiftId: string) => {
    try {
      await endShift(shiftId);
      loadStaff();
    } catch (error) {
      console.error('Error ending shift:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'cashier', password: '' });
    setEditingStaff(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStaffPerformance = (member: Staff) => {
    const totalShifts = member.shifts?.length || 0;
    const completedShifts = member.shifts?.filter((shift) => shift.endTime).length || 0;
    const totalHours = member.shifts?.reduce((total: number, shift) => {
      if (shift.endTime) {
        return total + (new Date(shift.endTime).getTime() - new Date(shift.startTime).getTime()) / (1000 * 60 * 60);
      }
      return total;
    }, 0) || 0;

    return { totalShifts, completedShifts, totalHours: Math.round(totalHours * 10) / 10 };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👥 Staff Management & Performance</h2>
        <div className="flex space-x-3">
          {!isAuthenticated && (
            <button
              onClick={() => setShowLoginForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Staff Login
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Staff'}
          </button>
        </div>
      </div>

      {isAuthenticated && user && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-green-800 font-semibold">Logged in as: {user.name}</h3>
              <p className="text-green-600">Role: {user.role}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleStartShift}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Start Shift
              </button>
              <button
                onClick={logout}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoginForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Staff Login</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="staff@theebazaar.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginForm(false);
                  setLoginData({ email: '', password: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Staff name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="cashier">Cashier</option>
                  <option value="attendant">Attendant</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="staff@theebazaar.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingStaff ? '(Leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingStaff}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                {editingStaff ? 'Update Staff' : 'Save Staff'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Staff Members</h3>
        </div>

        {staff.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No staff members found. Add your first staff member above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map(member => {
                  const activeShift = member.shifts?.find(shift => !shift.endTime);
                  return (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activeShift ? (
                          <div>
                            <div>Started: {new Date(activeShift.startTime).toLocaleString()}</div>
                            <button
                              onClick={() => handleEndShift(activeShift.id)}
                              className="mt-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            >
                              End Shift
                            </button>
                          </div>
                        ) : (
                          'No active shift'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const perf = getStaffPerformance(member);
                          return (
                            <div>
                              <div>{perf.totalShifts} shifts</div>
                              <div>{perf.totalHours}h worked</div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
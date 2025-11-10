import React, { useEffect, useState } from 'react';
import { getCustomers, createCustomer } from '../services/api';

import type { Customer } from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    loyaltyPoints: 0,
    loyaltyTier: 'Bronze',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer(formData);
      setFormData({ name: '', phone: '', email: '', dateOfBirth: '', loyaltyPoints: 0, loyaltyTier: 'Bronze' });
      setShowForm(false);
      loadCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👥 Customer Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Customer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Email
               </label>
               <input
                 type="email"
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Email address"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Date of Birth (for birthday perks)
               </label>
               <input
                 type="date"
                 value={formData.dateOfBirth}
                 onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Save Customer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
          <h3 className="text-lg font-semibold">Customer List</h3>
        </div>

        {customers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No customers found. Add your first customer above.
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
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loyalty Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birthday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIP Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map(customer => {
                  const totalSpent = customer.transactions?.reduce((sum, tx) => sum + tx.total, 0) ?? 0;
                  const transactions = customer.transactions;
                  const lastVisit = transactions && transactions.length > 0
                    ? new Date(transactions[0]!.createdAt).toLocaleDateString()
                    : 'Never';

                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.transactions?.length ?? 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        KES {totalSpent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        {customer.loyaltyPoints} pts
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : '-'}
                        {(() => {
                          const today = new Date();
                          const birthDate = customer.dateOfBirth ? new Date(customer.dateOfBirth) : null;
                          if (birthDate && birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth()) {
                            return <span className="ml-2 text-yellow-500">🎂</span>;
                          }
                          return null;
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.loyaltyTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                          customer.loyaltyTier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {customer.loyaltyTier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lastVisit}
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
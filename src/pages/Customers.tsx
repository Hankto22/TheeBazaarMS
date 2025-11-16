import React, { useEffect, useState } from 'react';
import { loadCustomers, addCustomer } from '../api/carwashService';

type Customer = {
  id: number | string;
  name: string;
  phone: string;
  loyaltyPoints?: number;
  loyaltyTier?: string;
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadCustomersData();
  }, []);

  const loadCustomersData = async () => {
    try {
      const data = await loadCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name || !phone) return;
    try {
      const updated = await addCustomer({ name, phone });
      setCustomers(updated);
      setName('');
      setPhone('');
    } catch (error) {
      console.error('Error adding customer:', error);
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Customer Management</h2>

        {/* Customers List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Registered Customers</h3>
          {customers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No customers registered. Add your first customer below.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{customer.name}</h4>
                      <p className="text-gray-600 mt-1">{customer.phone}</p>
                      {customer.loyaltyTier && (
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            customer.loyaltyTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                            customer.loyaltyTier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {customer.loyaltyTier} Tier
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {customer.loyaltyPoints || 0} points
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Customer Form */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Customer</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="e.g., John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!name || !phone}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
}
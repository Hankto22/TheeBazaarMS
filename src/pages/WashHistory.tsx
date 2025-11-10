import React, { useEffect, useState } from 'react';
import { getWashHistory, getServices, getCustomers } from '../services/api';
import type { Transaction, Service, Customer } from '../services/api';

export default function WashHistory() {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Filter states
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    serviceId: '',
    customerId: '',
    paymentMethod: '',
    vehicleType: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [history, filters]);

  const loadData = async () => {
    try {
      const [historyRes, servicesRes, customersRes] = await Promise.all([
        getWashHistory(),
        getServices(),
        getCustomers(),
      ]);
      setHistory(historyRes.data);
      setServices(servicesRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...history];

    if (filters.startDate) {
      filtered = filtered.filter(tx => new Date(tx.createdAt) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(tx => new Date(tx.createdAt) <= new Date(filters.endDate + 'T23:59:59'));
    }

    if (filters.serviceId) {
      filtered = filtered.filter(tx => tx.serviceId === filters.serviceId);
    }

    if (filters.customerId) {
      filtered = filtered.filter(tx => tx.customerId === filters.customerId);
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(tx => tx.paymentMethod === filters.paymentMethod);
    }

    if (filters.vehicleType) {
      filtered = filtered.filter(tx => tx.vehicleType === filters.vehicleType);
    }

    setFilteredHistory(filtered);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      serviceId: '',
      customerId: '',
      paymentMethod: '',
      vehicleType: '',
    });
  };

  const getTotalRevenue = () => {
    return filteredHistory.reduce((sum, tx) => sum + tx.total, 0);
  };

  const getTotalTransactions = () => {
    return filteredHistory.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">📋 Wash History</h2>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                value={filters.serviceId}
                onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Services</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                value={filters.customerId}
                onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Customers</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Methods</option>
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                value={filters.vehicleType}
                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="saloon">Saloon</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-blue-700">
              Showing {filteredHistory.length} of {history.length} transactions
            </div>
            <div className="text-sm font-semibold text-blue-800">
              Total Revenue: KES {getTotalRevenue().toFixed(2)}
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No wash history found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tx.service?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.customer ? tx.customer.name : 'Walk-in'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.vehicleType || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      KES {tx.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
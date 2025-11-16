import React, { useEffect, useState } from 'react';
import { loadServices, addService } from '../api/carwashService';

type Service = {
  id: number | string;
  name: string;
  price: number;
  duration?: number;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [editingId, setEditingId] = useState<number | string | null>(null);

  useEffect(() => {
    loadServicesData();
  }, []);

  const loadServicesData = async () => {
    try {
      const data = await loadServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name || !price || !duration) return;
    try {
      const updated = await addService({ name, price: Number(price), duration: Number(duration) });
      setServices(updated);
      setName('');
      setPrice('');
      setDuration('');
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setName(service.name);
    setPrice(service.price);
    setDuration(service.duration || 30);
  };

  const handleUpdate = async () => {
    if (!editingId || !name || !price || !duration) return;
    try {
      const current = services.map(s =>
        s.id === editingId
          ? { ...s, name, price: Number(price), duration: Number(duration) }
          : s
      );
      setServices(current);
      // Update localStorage
      const { setLocalServices } = await import('../utils/localStore');
      setLocalServices(current as any);
      // Reset form
      setEditingId(null);
      setName('');
      setPrice('');
      setDuration('');
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setDuration('');
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🛠️ Services Management</h2>

        {/* Services List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Services</h3>
          {services.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No services available. Add your first service below.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{service.name}</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-1">KES {service.price}</p>
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                      {service.duration || 30} min
                    </span>
                  </div>
                  <button
                    onClick={() => handleEdit(service)}
                    className="w-full bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm"
                  >
                    Edit Service
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Service Form */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                placeholder="e.g., Basic Wash"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KES)
              </label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                placeholder="30"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={!name || !price || !duration}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {editingId ? 'Update Service' : 'Add Service'}
            </button>
            {editingId && (
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { getInventory, addInventoryItem, updateInventory, deleteInventory, recordInventoryUsage } from '../services/api';
import type { Inventory } from '../services/api';

export default function Inventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [showUsageForm, setShowUsageForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    minStock: '10',
    unit: 'pieces',
    supplier: '',
    costPrice: '',
  });
  const [usageData, setUsageData] = useState({
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await getInventory();
      setInventory(res.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        description: formData.description || null,
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock),
        unit: formData.unit,
        supplier: formData.supplier || null,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
      };

      if (editingItem) {
        await updateInventory(editingItem.id.toString(), data);
      } else {
        await addInventoryItem(data);
      }

      setFormData({
        name: '',
        description: '',
        quantity: '',
        minStock: '10',
        unit: 'pieces',
        supplier: '',
        costPrice: '',
      });
      setShowForm(false);
      setEditingItem(null);
      loadInventory();
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const handleEdit = (item: Inventory) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      quantity: item.quantity.toString(),
      minStock: item.minStock.toString(),
      unit: item.unit,
      supplier: item.supplier || '',
      costPrice: item.costPrice?.toString() || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await deleteInventory(id);
        loadInventory();
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  };

  const handleUsageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await recordInventoryUsage(selectedItem!.id, {
        quantity: parseInt(usageData.quantity),
        reason: usageData.reason,
      });
      setUsageData({ quantity: '', reason: '' });
      setShowUsageForm(false);
      setSelectedItem(null);
      loadInventory();
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      quantity: '',
      minStock: '10',
      unit: 'pieces',
      supplier: '',
      costPrice: '',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const getStockStatus = (item: Inventory) => {
    if (item.quantity <= item.minStock) return 'low';
    if (item.quantity <= item.minStock * 1.5) return 'warning';
    return 'good';
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
        <h2 className="text-2xl font-bold text-gray-800">📦 Inventory Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Car Shampoo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pieces">Pieces</option>
                  <option value="liters">Liters</option>
                  <option value="bottles">Bottles</option>
                  <option value="cans">Cans</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Stock Level *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price (KES)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Item description"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                {editingItem ? 'Update Item' : 'Save Item'}
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

      {showUsageForm && selectedItem && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Record Usage: {selectedItem.name}
          </h3>
          <form onSubmit={handleUsageSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Used *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.quantity}
                  required
                  value={usageData.quantity}
                  onChange={(e) => setUsageData({ ...usageData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason *
                </label>
                <select
                  required
                  value={usageData.reason}
                  onChange={(e) => setUsageData({ ...usageData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select reason</option>
                  <option value="wash">Used in wash</option>
                  <option value="restock">Supplier restock</option>
                  <option value="damage">Damaged/lost</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Record Usage
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUsageForm(false);
                  setSelectedItem(null);
                  setUsageData({ quantity: '', reason: '' });
                }}
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
          <h3 className="text-lg font-semibold">Inventory Items</h3>
        </div>

        {inventory.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No inventory items found. Add your first item above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map(item => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          stockStatus === 'low' ? 'bg-red-100 text-red-800' :
                          stockStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {stockStatus === 'low' ? 'Low Stock' :
                           stockStatus === 'warning' ? 'Warning' : 'Good'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.supplier || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowUsageForm(true);
                          }}
                          className="text-orange-600 hover:text-orange-900"
                          disabled={item.quantity === 0}
                        >
                          Use
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
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
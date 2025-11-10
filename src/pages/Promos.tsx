import React, { useEffect, useState } from 'react';
import { getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode, type PromoCode } from '../services/api';

export default function Promos() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<{
    code: string;
    discount: string;
    type: 'percentage' | 'fixed';
    expiry: string;
    usageLimit: string;
  }>({
    code: '',
    discount: '',
    type: 'percentage',
    expiry: '',
    usageLimit: '',
  });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const res = await getPromoCodes();
      setPromos(res.data);
    } catch (error) {
      console.error('Error loading promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        discount: parseFloat(formData.discount),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        expiry: formData.expiry ? new Date(formData.expiry).toISOString() : null,
      };

      if (editingPromo) {
        await updatePromoCode(editingPromo.id, data);
      } else {
        await createPromoCode({
          ...data,
          usageCount: 0,
          createdAt: new Date().toISOString(),
        });
      }

      setFormData({ code: '', discount: '', type: 'percentage', expiry: '', usageLimit: '' });
      setShowForm(false);
      setEditingPromo(null);
      loadPromos();
    } catch (error) {
      console.error('Error saving promo:', error);
    }
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      discount: promo.discount.toString(),
      type: promo.type,
      expiry: (promo.expiry ? new Date(promo.expiry).toISOString().split('T')[0] : '') as string,
      usageLimit: promo.usageLimit?.toString() || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        await deletePromoCode(id);
        loadPromos();
      } catch (error) {
        console.error('Error deleting promo:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ code: '', discount: '', type: 'percentage', expiry: '', usageLimit: '' });
    setEditingPromo(null);
    setShowForm(false);
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
        <h2 className="text-2xl font-bold text-gray-800">🎁 Promo Code Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Promo Code'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingPromo ? 'Edit Promo Code' : 'Add New Promo Code'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="WELCOME20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={formData.type === 'percentage' ? '20' : '100'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Unlimited"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                {editingPromo ? 'Update Promo' : 'Save Promo'}
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
          <h3 className="text-lg font-semibold">Active Promo Codes</h3>
        </div>

        {promos.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No promo codes found. Add your first promo code above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promos.map(promo => {
                  const isExpired = promo.expiry && new Date() > new Date(promo.expiry);
                  const isLimitReached = promo.usageLimit && promo.usageCount >= promo.usageLimit;
                  const status = isExpired ? 'Expired' : isLimitReached ? 'Limit Reached' : 'Active';

                  return (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {promo.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.discount}{promo.type === 'percentage' ? '%' : ' KES'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.usageCount || 0}{promo.usageLimit ? `/${promo.usageLimit}` : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.expiry ? new Date(promo.expiry).toLocaleDateString() : 'No expiry'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          status === 'Active' ? 'bg-green-100 text-green-800' :
                          status === 'Expired' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(promo)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
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
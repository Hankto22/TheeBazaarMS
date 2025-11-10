import React, { useEffect, useState } from 'react';
import { getBusinessSettings, updateBusinessSettings } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    taxRate: 0,
    currency: 'KES',
    receiptFooter: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getBusinessSettings();
      const data = res.data;
      setSettings(data);
      setFormData({
        name: data.name || '',
        logo: data.logo || '',
        taxRate: data.taxRate || 0,
        currency: data.currency || 'KES',
        receiptFooter: data.receiptFooter || '',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBusinessSettings({
        ...formData,
        taxRate: parseFloat(formData.taxRate.toString()),
      });
      await loadSettings(); // Refresh to show updated settings
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
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
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">⚙️ Business Settings</h2>
          <p className="text-gray-600 mt-1">Configure your business information and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Business Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Thee Bazaar Carwash"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to use default logo</p>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Tax rate applied to all transactions (0 = no tax)</p>
            </div>
          </div>

          {/* Device Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Printer Configuration
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select printer...</option>
                  <option value="thermal">Thermal Printer (80mm)</option>
                  <option value="standard">Standard Printer (A4)</option>
                  <option value="receipt">Receipt Printer</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Configure receipt printing device</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barcode Scanner
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select scanner...</option>
                  <option value="usb">USB Barcode Scanner</option>
                  <option value="bluetooth">Bluetooth Scanner</option>
                  <option value="camera">Camera-based Scanner</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Configure barcode scanning device</p>
              </div>
            </div>
          </div>

          {/* Receipt Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Receipt Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receipt Footer Text
              </label>
              <textarea
                value={formData.receiptFooter}
                onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thank you for choosing Thee Bazaar Carwash!"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">This text will appear at the bottom of all receipts</p>
            </div>
          </div>

          {/* Backup & Data Management */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Backup & Management</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Options
                </label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Create Backup
                  </button>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Restore from Backup
                  </button>
                  <button
                    type="button"
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Export All Data
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Backup your business data or export for external use</p>
              </div>
            </div>
          </div>

          {/* Current Settings Preview */}
          {settings && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Current Settings Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Business Name:</span>
                  <span className="ml-2 text-blue-600">{settings.name}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Currency:</span>
                  <span className="ml-2 text-blue-600">{settings.currency}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Tax Rate:</span>
                  <span className="ml-2 text-blue-600">{settings.taxRate}%</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Logo:</span>
                  <span className="ml-2 text-blue-600">{settings.logo || 'Default'}</span>
                </div>
              </div>
              {settings.receiptFooter && (
                <div className="mt-4">
                  <span className="font-medium text-blue-700">Receipt Footer:</span>
                  <p className="mt-1 text-blue-600 italic">"{settings.receiptFooter}"</p>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { getServices, recordWash, getCustomers, validatePromoCode } from '../services/api';
import ReceiptModal from '../components/ReceiptModal';

export default function Carwash() {
  const [services, setServices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [vehicleType, setVehicleType] = useState<string>('saloon');
  const [discount, setDiscount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoValidation, setPromoValidation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  useEffect(() => {
    getServices().then(res => setServices(res));
    getCustomers().then(res => setCustomers(res));
  }, []);

  const handlePromoValidation = async () => {
    if (!promoCode.trim()) return;
    try {
      const result = await validatePromoCode(promoCode);
      setPromoValidation(result.data);
    } catch (error) {
      setPromoValidation({ valid: false, message: 'Invalid promo code' });
    }
  };

  const handleRecord = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      let finalPrice = selected.price;

      if (promoValidation?.valid) {
        if (promoValidation.type === 'percentage') {
          finalPrice = selected.price * (1 - promoValidation.discount / 100);
        } else {
          finalPrice = Math.max(0, selected.price - promoValidation.discount);
        }
      } else if (discount > 0) {
        finalPrice = selected.price * (1 - discount / 100);
      }

      const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const result = await recordWash({
        serviceId: selected.id,
        customerId: selectedCustomer?.id || null,
        quantity,
        price: finalPrice,
        paymentMethod,
        vehicleType,
        discount: promoValidation?.valid ? promoValidation.discount : discount,
        promoCode,
        promoCodeId: promoValidation?.id || null,
        receiptNumber,
      });
      setLastTransaction({ ...result.data, receiptNumber, service: selected, customer: selectedCustomer });
      setShowReceipt(true);
      setSelected(null);
      setSelectedCustomer(null);
      setQuantity(1);
      setPaymentMethod('cash');
      setDiscount(0);
      setPromoCode('');
      setPromoValidation(null);
    } catch (error) {
      alert('Error recording wash. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="bg-white rounded-lg shadow-md p-6"
        style={{
          backgroundImage: `url(/TheeBazaar Logo.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px',
        }}
      >
        <div className="bg-white bg-opacity-90 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🚗 Carwash Services</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="saloon">Saloon</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service
              </label>
              <select
                onChange={(e) => setSelected(services.find((s) => s.id === e.target.value))}
                value={selected?.id || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - KES {s.price} ({s.duration} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer (Optional)
              </label>
              <select
                onChange={(e) => setSelectedCustomer(customers.find((c) => c.id === e.target.value) || null)}
                value={selectedCustomer?.id || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Walk-in customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} {c.phone && `(${c.phone})`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter promo code"
                />
                <button
                  onClick={handlePromoValidation}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Apply
                </button>
              </div>
              {promoValidation && (
                <p className={`text-sm mt-1 ${promoValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {promoValidation.valid ? `Valid: ${promoValidation.discount}${promoValidation.type === 'percentage' ? '%' : ' KES'} off` : promoValidation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Math.min(100, +e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                disabled={promoValidation?.valid}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
              </select>
            </div>

            {selected && (
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-blue-800">Order Summary</h3>
                <p className="text-blue-700">Service: {selected.name}</p>
                <p className="text-blue-700">Quantity: {quantity}</p>
                <p className="text-blue-700">Vehicle: {vehicleType}</p>
                {promoValidation?.valid && (
                  <p className="text-blue-700">
                    Promo Discount: {promoValidation.type === 'percentage' ? `${promoValidation.discount}%` : `KES ${promoValidation.discount}`}
                  </p>
                )}
                {discount > 0 && !promoValidation?.valid && <p className="text-blue-700">Additional Discount: {discount}%</p>}
                <p className="text-blue-700 font-bold">
                  Total: KES {(() => {
                    let price = selected.price;
                    if (promoValidation?.valid) {
                      if (promoValidation.type === 'percentage') {
                        price = selected.price * (1 - promoValidation.discount / 100);
                      } else {
                        price = Math.max(0, selected.price - promoValidation.discount);
                      }
                    } else if (discount > 0) {
                      price = selected.price * (1 - discount / 100);
                    }
                    return (price * quantity).toFixed(2);
                  })()}
                </p>
              </div>
            )}

            <button
              onClick={handleRecord}
              disabled={!selected || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Recording...' : 'Record Wash'}
            </button>
          </div>
        </div>
      </div>

      {showReceipt && (
        <ReceiptModal
          transaction={lastTransaction}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
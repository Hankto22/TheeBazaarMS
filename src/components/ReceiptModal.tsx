import React from 'react';

interface Transaction {
  receiptNumber: string;
  service?: { name: string };
  customer?: { name: string };
  vehicleType?: string;
  quantity: number;
  discount: number;
  paymentMethod: string;
  total: number;
  createdAt: string;
}

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="text-center mb-4">
            <img src="/TheeBazaar Logo.jpg" alt="Thee Bazaar Logo" className="h-12 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Thee Bazaar Carwash</h2>
            <p className="text-sm text-gray-600">Receipt #{transaction.receiptNumber}</p>
          </div>

          <div className="border-t border-b py-4 space-y-2">
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{transaction.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{transaction.customer?.name || 'Walk-in'}</span>
            </div>
            <div className="flex justify-between">
              <span>Vehicle Type:</span>
              <span>{transaction.vehicleType || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{transaction.quantity}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>KES {transaction.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Payment:</span>
              <span>{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>KES {transaction.total}</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Thank you for your business!</p>
            <p>{new Date(transaction.createdAt).toLocaleString()}</p>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={printReceipt}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Print Receipt
            </button>
            <button
              onClick={() => window.open(`/receipt/${transaction.receiptNumber}`, '_blank')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              View PDF
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
import { useEffect, useState } from 'react';
import { getWashHistory } from '../services/api';

export default function WashHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getWashHistory().then(res => setHistory(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Wash History</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Service</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map(tx => (
            <tr key={tx.id}>
              <td>{tx.service.name}</td>
              <td>{tx.quantity}</td>
              <td>KES {tx.total}</td>
              <td>{new Date(tx.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
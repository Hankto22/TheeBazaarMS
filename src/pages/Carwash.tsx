import { useEffect, useState } from 'react';
import { getServices, recordWash } from '../services/api';

export default function Carwash() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getServices().then(res => setServices(res.data));
  }, []);

  const handleRecord = async () => {
    await recordWash({
      serviceId: selected.id,
      quantity,
      price: selected.price,
    });
    alert('Wash recorded!');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Carwash Services</h2>
      <select onChange={e => setSelected(services.find(s => s.id === e.target.value))}>
        <option>Select service</option>
        {services.map(s => (
          <option key={s.id} value={s.id}>{s.name} - KES {s.price}</option>
        ))}
      </select>
      <input
        type="number"
        value={quantity}
        onChange={e => setQuantity(+e.target.value)}
        className="border p-2 mt-2"
      />
      <button onClick={handleRecord} className="btn-primary mt-4">Record Wash</button>
    </div>
  );
}
// src/api/carwashService.ts
import axios from './axiosConfig';
import {
  getLocalServices,
  setLocalServices,
  getLocalCustomers,
  setLocalCustomers,
  addPendingChange,
} from '../utils/localStore';

const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

export async function loadServices() {
  // 1️⃣ try localStorage first
  let local = getLocalServices();
  if (local.length > 0) return local;

  // 2️⃣ then demo data
  try {
    const demoRes = await fetch('/demo-data/services.json');
    const demo = await demoRes.json();
    setLocalServices(demo);
    return demo;
  } catch {
    return [];
  }
}

export async function loadCustomers() {
  let local = getLocalCustomers();
  if (local.length > 0) return local;

  try {
    const demoRes = await fetch('/demo-data/customers.json');
    const demo = await demoRes.json();
    setLocalCustomers(demo);
    return demo;
  } catch {
    return [];
  }
}

export async function addService(service: { name: string; price: number; duration?: number }) {
  const current = getLocalServices();
  const newService = {
    id: Date.now(), // simple client id
    name: service.name,
    price: service.price,
    duration: service.duration || 30,
  };
  const updated = [...current, newService];
  setLocalServices(updated);

  addPendingChange({ type: 'service:add', payload: newService });

  if (isOnline()) {
    // optional: try push to backend
    try {
      await axios.post('/carwash/services', newService);
      // you may also remove this from pending queue in sync logic
    } catch {
      // keep pending
    }
  }

  return updated;
}

export async function addCustomer(customer: { name: string; phone: string }) {
  const current = getLocalCustomers();
  const newCustomer = {
    id: Date.now(),
    ...customer,
  };
  const updated = [...current, newCustomer];
  setLocalCustomers(updated);

  addPendingChange({ type: 'customer:add', payload: newCustomer });

  if (isOnline()) {
    try {
      await axios.post('/carwash/customers', newCustomer);
    } catch {
      // keep pending
    }
  }

  return updated;
}
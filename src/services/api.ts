import axios from 'axios';
import { initDB, saveOfflineTransaction, getAllFromIndexedDB, cacheData, syncPendingData, isOnline } from './offlineStorage';

// Type definitions
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  loyaltyPoints: number;
  loyaltyTier: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  serviceId: string;
  customerId?: string;
  total: number;
  createdAt: string;
  paymentMethod: string;
  vehicleType?: string;
  quantity: number;
  service?: Service;
  customer?: Customer;
  discount?: number;
  receiptNumber?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  shifts?: Shift[];
}

export interface Shift {
  id: string;
  staffId: string;
  startTime: string;
  endTime?: string;
}

export interface Inventory {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: string;
  minStock: number;
  supplier: string | null;
  costPrice: number | null;
  createdAt: string;
  updatedAt: string;
  usages?: InventoryUsage[];
}

export interface InventoryUsage {
  id: string;
  itemId: string;
  quantity: number;
  reason: string;
  transactionId?: string;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  expiry?: string | null;
  usageLimit?: number | null;
  usageCount: number;
  createdAt?: string;
}

export interface Settings {
  id: string;
  name: string;
  logo?: string;
  taxRate: number;
  currency: string;
  receiptFooter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reports {
  totalTransactions: number;
  totalRevenue: number;
  serviceStats: Array<{
    serviceName: string;
    count: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    name: string;
    totalVisits: number;
    totalSpent: number;
    loyaltyTier: string;
    loyaltyPoints: number;
  }>;
  revenueByMonth: any[];
  paymentMethodStats: any[];
  vehicleTypeStats: any[];
  promoUsageStats: any[];
  lowStockAlerts: any[];
}

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Initialize IndexedDB
initDB();

// Use raw API instance to ensure baseURL works correctly
const offlineApi = api;

// Offline-aware API functions
export const getServices = async (): Promise<Service[]> => {
  try {
    const res = await api.get('/carwash/services');
    return res.data;
  } catch (err) {
    console.warn('API failed, loading demo services');
    const fallback = await fetch('/demo-data/services.json');
    return await fallback.json();
  }
};

export const createService = (data: Omit<Service, 'id' | 'createdAt'>) => offlineApi.post('/carwash/services', data);
export const recordWash = async (data: any) => {
  try {
    return await offlineApi.post('/carwash/record', data);
  } catch (error) {
    if (!isOnline()) {
      return { data: await saveOfflineTransaction({ endpoint: '/carwash/record', data }) };
    }
    throw error;
  }
};

export const getWashHistory = (): Promise<{ data: Transaction[] }> => offlineApi.get('/carwash/history');

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const res = await api.get('/carwash/customers');
    return res.data;
  } catch (err) {
    console.warn('API failed, loading demo customers');
    const fallback = await fetch('/demo-data/customers.json');
    return await fallback.json();
  }
};

export const createCustomer = (data: Omit<Customer, 'id' | 'transactions'>) => offlineApi.post('/carwash/customers', data);
export const updateService = (id: string, data: Partial<Service>) => offlineApi.put(`/carwash/services/${id}`, data);
export const deleteService = (id: string) => offlineApi.delete(`/carwash/services/${id}`);
export const getReports = () => offlineApi.get('/carwash/reports');

// Inventory
export const getInventory = async (): Promise<{ data: Inventory[] }> => {
  try {
    return await offlineApi.get('/carwash/inventory');
  } catch (error) {
    if (!isOnline()) {
      const cached = await getAllFromIndexedDB('inventory');
      return { data: cached };
    }
    throw error;
  }
};

export const addInventoryItem = (data: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>) => offlineApi.post('/carwash/inventory', data);
export const updateInventory = (id: string, data: Partial<Inventory>) => offlineApi.put(`/carwash/inventory/${id}`, data);
export const deleteInventory = (id: string) => offlineApi.delete(`/carwash/inventory/${id}`);
export const recordInventoryUsage = (id: string, data: any) => offlineApi.post(`/carwash/inventory/${id}/usage`, data);

// Promo Codes
export const getPromoCodes = async (): Promise<{ data: PromoCode[] }> => {
  try {
    return await offlineApi.get('/carwash/promos');
  } catch (error) {
    if (!isOnline()) {
      const cached = await getAllFromIndexedDB('promos');
      return { data: cached };
    }
    throw error;
  }
};

export const createPromoCode = (data: Omit<PromoCode, 'id'>) => offlineApi.post('/carwash/promos', data);
export const updatePromoCode = (id: string, data: Partial<PromoCode>) => offlineApi.put(`/carwash/promos/${id}`, data);
export const deletePromoCode = (id: string) => offlineApi.delete(`/carwash/promos/${id}`);
export const validatePromoCode = (code: string) => offlineApi.post('/carwash/promos/validate', { code });

// Staff
export const getStaff = async (): Promise<{ data: Staff[] }> => {
  try {
    return await offlineApi.get('/carwash/staff');
  } catch (error) {
    if (!isOnline()) {
      const cached = await getAllFromIndexedDB('staff');
      return { data: cached };
    }
    throw error;
  }
};

export const createStaff = (data: Omit<Staff, 'id' | 'shifts'>) => offlineApi.post('/carwash/staff', data);
export const updateStaff = (id: string, data: Partial<Staff>) => offlineApi.put(`/carwash/staff/${id}`, data);
export const staffLogin = (data: { email: string; password: string }) => offlineApi.post('/carwash/staff/login', data);
export const startShift = (data: { staffId: string }) => offlineApi.post('/carwash/staff/shift', data);
export const endShift = (id: string) => offlineApi.put(`/carwash/staff/shift/${id}/end`);

// Settings
export const getBusinessSettings = (): Promise<{ data: Settings }> => offlineApi.get('/carwash/settings');
export const updateBusinessSettings = (data: Partial<Settings>) => offlineApi.put('/carwash/settings', data);

// Receipts
export const getReceipt = (number: string) => offlineApi.get(`/carwash/receipts/${number}`);
export const emailReceipt = (number: string, email: string) => offlineApi.post(`/carwash/receipts/${number}/email`, { email });

// Sync function
export const syncOfflineData = async () => {
  await syncPendingData(async (item: any) => {
    if (item.endpoint === '/carwash/record') {
      await offlineApi.post(item.endpoint, item.data);
    }
  });
};
// src/utils/localStore.ts
type CarwashService = {
  id: number;
  name: string;
  price: number;
  duration?: number;
};

type CarwashCustomer = {
  id: number;
  name: string;
  phone: string;
};

type PendingChange =
  | { type: 'service:add'; payload: CarwashService }
  | { type: 'service:update'; payload: CarwashService }
  | { type: 'customer:add'; payload: CarwashCustomer }
  | { type: 'customer:update'; payload: CarwashCustomer };

const LS_KEYS = {
  services: 'tb_services',
  customers: 'tb_customers',
  pending: 'tb_pending_changes',
} as const;

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalServices(): CarwashService[] {
  return read<CarwashService[]>(LS_KEYS.services) || [];
}

export function setLocalServices(services: CarwashService[]) {
  write(LS_KEYS.services, services);
}

export function getLocalCustomers(): CarwashCustomer[] {
  return read<CarwashCustomer[]>(LS_KEYS.customers) || [];
}

export function setLocalCustomers(customers: CarwashCustomer[]) {
  write(LS_KEYS.customers, customers);
}

export function getPendingChanges(): PendingChange[] {
  return read<PendingChange[]>(LS_KEYS.pending) || [];
}

export function setPendingChanges(changes: PendingChange[]) {
  write(LS_KEYS.pending, changes);
}

export function addPendingChange(change: PendingChange) {
  const current = getPendingChanges();
  current.push(change);
  setPendingChanges(current);
}
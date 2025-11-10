import { openDB } from 'idb';

const DB_NAME = 'TheeBazaarOffline';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Services store
      if (!db.objectStoreNames.contains('services')) {
        db.createObjectStore('services', { keyPath: 'id' });
      }

      // Customers store
      if (!db.objectStoreNames.contains('customers')) {
        db.createObjectStore('customers', { keyPath: 'id' });
      }

      // Transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id' });
      }

      // Pending sync store
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id' });
      }

      // Inventory store
      if (!db.objectStoreNames.contains('inventory')) {
        db.createObjectStore('inventory', { keyPath: 'id' });
      }

      // Staff store
      if (!db.objectStoreNames.contains('staff')) {
        db.createObjectStore('staff', { keyPath: 'id' });
      }

      // Promo codes store
      if (!db.objectStoreNames.contains('promos')) {
        db.createObjectStore('promos', { keyPath: 'id' });
      }
    },
  });
};

// Generic CRUD operations
export const saveToIndexedDB = async (storeName: string, data: any) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.put(data);
  await tx.done;
};

export const getFromIndexedDB = async (storeName: string, id: string) => {
  const db = await initDB();
  return db.get(storeName, id);
};

export const getAllFromIndexedDB = async (storeName: string) => {
  const db = await initDB();
  return db.getAll(storeName);
};

export const deleteFromIndexedDB = async (storeName: string, id: string) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.delete(id);
  await tx.done;
};

// Offline transaction handling
export const saveOfflineTransaction = async (transaction: any) => {
  const offlineTx = {
    ...transaction,
    id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    offline: true,
    createdAt: new Date().toISOString(),
  };

  await saveToIndexedDB('pendingSync', offlineTx);
  return offlineTx;
};

export const getPendingSync = async () => {
  return getAllFromIndexedDB('pendingSync');
};

export const removeFromPendingSync = async (id: string) => {
  await deleteFromIndexedDB('pendingSync', id);
};

// Cache management
export const cacheData = async (storeName: string, data: any[]) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  // Clear existing data
  await store.clear();

  // Add new data
  for (const item of data) {
    await store.put(item);
  }

  await tx.done;
};

// Network status detection
export const isOnline = () => {
  return navigator.onLine;
};

// Sync when back online
export const syncPendingData = async (apiCall: Function) => {
  if (!isOnline()) return;

  const pendingData = await getPendingSync();

  for (const item of pendingData) {
    try {
      await apiCall(item);
      await removeFromPendingSync(item.id);
    } catch (error) {
      console.error('Sync failed for item:', item.id, error);
    }
  }
};
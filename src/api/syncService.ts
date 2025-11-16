// src/api/syncService.ts
import axios from './axiosConfig';
import {
  getPendingChanges,
  setPendingChanges,
} from '../utils/localStore';

const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

export async function syncPendingChanges() {
  if (!isOnline()) return;

  const pending = getPendingChanges();
  if (!pending.length) return;

  const stillPending = [];

  for (const change of pending) {
    try {
      switch (change.type) {
        case 'service:add':
        case 'service:update':
          await axios.post('/carwash/services/sync', change.payload);
          break;
        case 'customer:add':
        case 'customer:update':
          await axios.post('/carwash/customers/sync', change.payload);
          break;
      }
      // success: do not re-add to stillPending
    } catch {
      // failed: keep it to try later
      stillPending.push(change);
    }
  }

  setPendingChanges(stillPending);
}
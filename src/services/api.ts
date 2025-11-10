import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getServices = () => api.get('/carwash/services');
export const recordWash = (data) => api.post('/carwash/record', data);
export const getWashHistory = () => api.get('/carwash/history');
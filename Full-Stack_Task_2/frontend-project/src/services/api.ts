import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth services
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  checkAuth: () => api.get('/auth/check'),
};

// Car services
export const carAPI = {
  getAll: () => api.get('/cars'),
  create: (car: { PlateNumber: string; DriverName: string; PhoneNumber: string }) =>
    api.post('/cars', car),
  update: (plateNumber: string, car: { DriverName: string; PhoneNumber: string }) =>
    api.put(`/cars/${plateNumber}`, car),
  delete: (plateNumber: string) => api.delete(`/cars/${plateNumber}`),
};

// ParkingSlot services
export const parkingSlotAPI = {
  getAll: () => api.get('/parking-slots'),
  create: (slot: { SlotNumber: string; SlotStatus?: string }) =>
    api.post('/parking-slots', slot),
};

// ParkingRecord services
export const parkingRecordAPI = {
  getAll: () => api.get('/parking-records'),
  create: (record: { PlateNumber: string; SlotNumber: string; EntryTime?: string }) =>
    api.post('/parking-records', record),
  updateExit: (recordId: number, exitTime?: string) =>
    api.put(`/parking-records/${recordId}/exit`, { ExitTime: exitTime }),
};

// Payment services
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  create: (recordId: number) => api.post('/payments', { RecordID: recordId }),
};

// Reports services
export const reportAPI = {
  getDaily: (date?: string) => api.get('/reports/daily', { params: { date } }),
};

// Bill services
export const billAPI = {
  getBill: (recordId: number) => api.get(`/bill/${recordId}`),
};

export default api;

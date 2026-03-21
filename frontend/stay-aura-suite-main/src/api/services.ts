import apiClient from './axios';

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string; role?: string; phone?: string }) =>
    apiClient.post('/auth/register', data),
  getProfile: () => apiClient.get('/auth/profile'),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const userApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id: string | number) => apiClient.get(`/users/${id}`),
  update: (id: string | number, data: any) => apiClient.put(`/users/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/users/${id}`),
};

// ─── Rooms ───────────────────────────────────────────────────────────────────
export const roomApi = {
  getAll: () => apiClient.get('/rooms'),
  getAvailable: () => apiClient.get('/rooms/available'),
  getById: (id: string | number) => apiClient.get(`/rooms/${id}`),
  create: (data: any) => apiClient.post('/rooms', data),
  update: (id: string | number, data: any) => apiClient.put(`/rooms/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/rooms/${id}`),
  updateAvailability: (id: string | number, available: boolean) =>
    apiClient.patch(`/rooms/${id}/availability`, null, { params: { available } }),
};

// ─── Reservations ─────────────────────────────────────────────────────────────
export const reservationApi = {
  getAll: () => apiClient.get('/reservations'),
  getById: (id: string) => apiClient.get(`/reservations/${id}`),
  getByUser: (userId: string | number) => apiClient.get(`/reservations/user/${userId}`),
  create: (data: any) => apiClient.post('/reservations', data),
  cancel: (id: string) => apiClient.put(`/reservations/${id}/cancel`),
  checkIn: (id: string) => apiClient.put(`/reservations/${id}/check-in`),
  checkOut: (id: string) => apiClient.put(`/reservations/${id}/check-out`),
};

// ─── Guests ───────────────────────────────────────────────────────────────────
export const guestApi = {
  getAll: () => apiClient.get('/guests'),
  getById: (id: string) => apiClient.get(`/guests/${id}`),
  create: (data: any) => apiClient.post('/guests', data),
  getByReservation: (reservationId: string) =>
    apiClient.get(`/guests/reservation/${reservationId}`),
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentApi = {
  getAll: () => apiClient.get('/payments'),
  getById: (id: string | number) => apiClient.get(`/payments/${id}`),
  getInvoice: (id: string | number) => apiClient.get(`/payments/${id}/invoice`),
  getByReservation: (reservationId: string) =>
    apiClient.get(`/payments/reservation/${reservationId}`),
  createOrder: (data: { reservationId: string; amount: number; currency?: string }) =>
    apiClient.post('/payments/order', data),
  verifyPayment: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    customerEmail?: string;
  }) => apiClient.post('/payments/verify', data),
};

// ─── Staff ────────────────────────────────────────────────────────────────────
export const staffApi = {
  getAll: () => apiClient.get('/staff'),
  getById: (id: string | number) => apiClient.get(`/staff/${id}`),
  create: (data: any) => apiClient.post('/staff', data),
  update: (id: string | number, data: any) => apiClient.put(`/staff/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/staff/${id}`),
};

// ─── Inventory ────────────────────────────────────────────────────────────────
export const inventoryApi = {
  getAll: () => apiClient.get('/inventory'),
  getById: (id: string | number) => apiClient.get(`/inventory/${id}`),
  create: (data: any) => apiClient.post('/inventory', data),
  update: (id: string | number, data: any) => apiClient.put(`/inventory/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/inventory/${id}`),
};

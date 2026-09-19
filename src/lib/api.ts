import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Products ────────────────────────────────────────────
export const productsApi = {
  getAll: (params?: { cat?: string; q?: string; sellerId?: number }) =>
    api.get('/products', { params }).then(r => r.data),

  getOne: (id: number) =>
    api.get(`/products/${id}`).then(r => r.data),

  create: (data: any) =>
    api.post('/products', data).then(r => r.data),

  update: (id: number, data: any) =>
    api.put(`/products/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/products/${id}`).then(r => r.data),
};

// ─── Sellers ─────────────────────────────────────────────
export const sellersApi = {
  getAll: (q?: string) =>
    api.get('/sellers', { params: { q } }).then(r => r.data),

  getOne: (id: number) =>
    api.get(`/sellers/${id}`).then(r => r.data),

  getProducts: (id: number) =>
    api.get(`/sellers/${id}/products`).then(r => r.data),
};

// ─── Banners ─────────────────────────────────────────────
export const bannersApi = {
  getAll: (type?: 'HERO' | 'SIDE') =>
    api.get('/banners', { params: { type } }).then(r => r.data),

  create: (data: any) =>
    api.post('/banners', data).then(r => r.data),

  update: (id: number, data: any) =>
    api.put(`/banners/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/banners/${id}`).then(r => r.data),
};

export default api;

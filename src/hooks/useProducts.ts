import useSWR from 'swr';
import { productsApi, sellersApi, bannersApi } from '@/lib/api';
import { Product, Seller, Banner } from '@/types';

// ─── Products ────────────────────────────────────────────
export function useProducts(filters?: { cat?: string; q?: string; sellerId?: number }) {
  const key = ['products', filters?.cat, filters?.q, filters?.sellerId].filter(Boolean).join('-');
  return useSWR<Product[]>(key, () => productsApi.getAll(filters));
}

export function useProduct(id: number) {
  return useSWR<Product>(id ? `product-${id}` : null, () => productsApi.getOne(id));
}

// ─── Sellers ─────────────────────────────────────────────
export function useSellers(q?: string) {
  return useSWR<Seller[]>(['sellers', q].filter(Boolean).join('-'), () => sellersApi.getAll(q));
}

export function useSeller(id: number) {
  return useSWR<Seller>(id ? `seller-${id}` : null, () => sellersApi.getOne(id));
}

// ─── Banners ─────────────────────────────────────────────
export function useBanners(type?: 'HERO' | 'SIDE') {
  return useSWR<Banner[]>(['banners', type].filter(Boolean).join('-'), () => bannersApi.getAll(type));
}

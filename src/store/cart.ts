import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Lightweight cart item (no full Product object needed)
export interface CartLineItem {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  qty: number;
}

interface AddItemArgs {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  qty?: number;
}

interface CartStore {
  items: CartLineItem[];
  addItem: (args: AddItemArgs) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: ({ productId, name, price, imageUrl, qty = 1 }) => {
        set(state => {
          const existing = state.items.find(i => i.productId === productId);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === productId ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { productId, name, price, imageUrl, qty }] };
        });
      },

      removeItem: (productId) =>
        set(state => ({ items: state.items.filter(i => i.productId !== productId) })),

      updateQty: (productId, qty) => {
        if (qty <= 0) { get().removeItem(productId); return; }
        set(state => ({
          items: state.items.map(i => i.productId === productId ? { ...i, qty } : i),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    { name: 'optima-cart' }
  )
);

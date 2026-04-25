import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.productId === item.productId
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, qty: i.qty + 1 }
                  : i
              ),
            };
          }
          return { items: [...s.items, { ...item, qty: 1 }] };
        }),
      removeItem: (id) =>
        set((s) => ({
          items: s.items.filter((i) => i.productId !== id),
        })),
      updateQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === id ? { ...i, qty } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "shopcart-storage" }
  )
);

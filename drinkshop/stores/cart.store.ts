import { create } from "zustand";
import axios from "axios";
import { Cart } from "@/types/cart.type";

interface CartState {
  cart: Cart | null;
  isChange: boolean;
  fetchCart: (userId: string) => Promise<void>;
  setCart: (cart: Cart | null) => void;
  setIsChange: (value: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isChange: false,

  fetchCart: async (userId) => {
    if (!userId) {
      set({ cart: null });
      return;
    }
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE}/carts?userId=${userId}`
    );
    set({ cart: res.data[0] || null });
  },

  setCart: (cart) => set({ cart }),

  setIsChange: (value) => set({ isChange: value }),
}));

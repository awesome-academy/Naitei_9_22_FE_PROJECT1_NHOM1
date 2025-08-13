import { create } from "zustand";
import { UserWithoutPassword } from "@/types/user.types";
import { getToken, removeToken, setToken } from "@/lib/utils";

interface UserState {
  user: UserWithoutPassword | null;
  setUser: (user: UserWithoutPassword | null) => void;
  clearUser: () => void;
  initUser: () => void; // Load từ token khi vào web
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => {
    removeToken();
    set({ user: null });
  },

  initUser: () => {
    const userFromToken = getToken();
    if (userFromToken) {
      set({ user: userFromToken });
    }
  },
}));

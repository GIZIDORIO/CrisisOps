import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("crisisops_token", token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem("crisisops_token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "crisisops_auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

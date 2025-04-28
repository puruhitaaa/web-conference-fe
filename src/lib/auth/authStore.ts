import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

// Store terpisah untuk kredensial sementara (tidak di-persist ke localStorage)
export const useCredentialsStore = create<{
  email: string;
  password: string;
  setCredentials: (email: string, password: string) => void;
  clearCredentials: () => void;
}>((set) => ({
  email: "",
  password: "",
  setCredentials: (email, password) => set({ email, password }),
  clearCredentials: () => set({ email: "", password: "" }),
}));

// Store utama yang di-persist (tanpa kredensial sensitif)
export interface AuthState {
  token: string | null;
  tokenType: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (token: string, tokenType: string, user: User) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tokenType: null,
      user: null,
      isAuthenticated: false,

      login: (token, tokenType, user) => {
        set({
          token,
          tokenType,
          user,
          isAuthenticated: true,
        });
        return true;
      },

      logout: () => {
        console.log("Logged out");
        // Bersihkan kredensial dari store terpisah saat logout
        useCredentialsStore.getState().clearCredentials();
        set({
          token: null,
          tokenType: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth", // localStorage key
      partialize: (state) => ({
        token: state.token,
        tokenType: state.tokenType,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

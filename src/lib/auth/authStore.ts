import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/auth"

// Types for our authentication state
export interface AuthState {
  token: string | null
  tokenType: string | null
  user: User | null
  isAuthenticated: boolean

  // Actions
  login: (token: string, tokenType: string, user: User) => boolean
  logout: () => void
}

// Create auth store with localStorage persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      tokenType: null,
      user: null,
      isAuthenticated: false,

      // Actions
      login: (token, tokenType, user) => {
        set({
          token,
          tokenType,
          user,
          isAuthenticated: true,
        })
        return true
      },

      logout: () => {
        set({
          token: null,
          tokenType: null,
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "auth", // localStorage key
    }
  )
)

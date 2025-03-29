import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { User } from "@/types/auth"

// Types for our authentication state
export interface AuthState {
  token: string | null
  tokenType: string | null
  user: User | null
  isAuthenticated: boolean
}

// Initial state when not authenticated
const initialState: AuthState = {
  token: null,
  tokenType: null,
  user: null,
  isAuthenticated: false,
}

// Main auth atom with localStorage persistence
export const authAtom = atomWithStorage<AuthState>("auth", initialState)

// Derived atoms for convenience
export const isAuthenticatedAtom = atom((get) => get(authAtom).isAuthenticated)
export const userAtom = atom((get) => get(authAtom).user)
export const tokenAtom = atom((get) => get(authAtom).token)

// Auth functions
export const login = (
  token: string,
  tokenType: string,
  user: User,
  setAuth: (update: AuthState) => void
) => {
  setAuth({
    token,
    tokenType,
    user,
    isAuthenticated: true,
  })
  return true
}

export const logout = (setAuth: (update: AuthState) => void) => {
  setAuth(initialState)
}

// Function to get auth header for API requests
export const getAuthHeader = (state: AuthState) => {
  if (state.token && state.tokenType) {
    return { Authorization: `${state.tokenType} ${state.token}` }
  }
  return {}
}

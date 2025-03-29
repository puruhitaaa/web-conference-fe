import { redirect } from "@tanstack/react-router"
import { useAuthStore } from "./authStore"

/**
 * Check if user is authenticated and redirect to login if not
 */
export const requireAuth = () => {
  const auth = useAuthStore.getState()

  if (!auth.isAuthenticated || !auth.user) {
    throw redirect({
      to: "/login",
    })
  }

  return auth
}

/**
 * Check if user has access to ICODSA routes (Super Admin or ICODSA Admin)
 */
export const requireIcodsaAccess = () => {
  const auth = requireAuth()

  // Only Super Admin (1) and ICODSA Admin (2) can access
  if (auth.user?.role !== 1 && auth.user?.role !== 2) {
    throw redirect({ to: "/" })
  }

  return auth
}

/**
 * Check if user has access to ICICYTA routes (Super Admin or ICICYTA Admin)
 */
export const requireIcicytaAccess = () => {
  const auth = requireAuth()

  // Only Super Admin (1) and ICICYTA Admin (3) can access
  if (auth.user?.role !== 1 && auth.user?.role !== 3) {
    throw redirect({ to: "/" })
  }

  return auth
}

/**
 * Check if user is a Super Admin
 */
export const requireSuperAdmin = () => {
  const auth = requireAuth()

  // Only Super Admin (1) can access
  if (auth.user?.role !== 1) {
    throw redirect({ to: "/" })
  }

  return auth
}

import "../index.css"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"
import type { AuthState } from "@/lib/auth/authStore"

interface MyRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: AuthState | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [queryClient] = useState(
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
          },
        },
      })
    )
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <Outlet />
            <Toaster position='bottom-right' reverseOrder={true} />
          </ThemeProvider>
        </QueryClientProvider>
        <TanStackRouterDevtools />
      </>
    )
  },
})

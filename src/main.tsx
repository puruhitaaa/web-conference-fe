import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import AuthProvider from "react-auth-kit"
import { store } from "./lib/auth/store"

import { createRouter, RouterProvider } from "@tanstack/react-router"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"
import type { AuthState } from "./types/auth"

// Import the NotFound component
import NotFound from "./components/not-found"
// Create a new router instance
const router = createRouter({
  routeTree,
  context: { auth: null },
  defaultNotFoundComponent: () => <NotFound />,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// Render the app
function InnerApp() {
  const auth: AuthState | null = useAuthUser()
  return <RouterProvider router={router} context={{ auth }} />
}

const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider store={store}>
        <InnerApp />
      </AuthProvider>
    </StrictMode>
  )
}

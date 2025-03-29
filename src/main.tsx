import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { Provider, useAtom } from "jotai"
import { authAtom } from "./lib/auth/authStore"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"
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
  const [auth, _test] = useAtom(authAtom)
  return <RouterProvider router={router} context={{ auth }} />
}

const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Provider>
        <InnerApp />
      </Provider>
    </StrictMode>
  )
}

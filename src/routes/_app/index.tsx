import { Dashboard } from "@/components/dashboard"
import { createFileRoute } from "@tanstack/react-router"
// import viteLogo from '/vite.svg'

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Dashboard />
}

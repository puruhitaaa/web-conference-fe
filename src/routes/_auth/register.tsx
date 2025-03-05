import { RegisterForm } from "@/components/auth/register-form"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <RegisterForm />
    </div>
  )
}

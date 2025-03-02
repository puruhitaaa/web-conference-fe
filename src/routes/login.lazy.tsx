import { LoginForm } from '@/components/auth/login-form'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoginForm />
    </div>
  )
}

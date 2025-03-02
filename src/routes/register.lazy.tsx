import { RegisterForm } from '@/components/auth/register-form'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <RegisterForm />
    </div>
  )
}

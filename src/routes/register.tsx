import { RegisterForm } from '@/components/auth/register-form'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    // TODO: Redirect to the previous page
    if (context?.auth) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <RegisterForm />
    </div>
  )
}

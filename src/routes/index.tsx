import { createFileRoute, redirect } from '@tanstack/react-router'
// import viteLogo from '/vite.svg'

// import reactLogo from '../assets/react.svg'
// import tailwindLogo from '../assets/tailwind.svg'
// import tanstackLogo from '../assets/tanstack.png'

// import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context?.auth) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <h1 className='text-4xl font-bold'>Hello World</h1>
    </div>
  )
}

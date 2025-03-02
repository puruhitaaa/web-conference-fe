import viteLogo from '/vite.svg'
import { useState } from 'react'

import { createLazyFileRoute } from '@tanstack/react-router'

import reactLogo from '../assets/react.svg'
import tailwindLogo from '../assets/tailwind.svg'
import tanstackLogo from '../assets/tanstack.png'

import { Button } from '@/components/ui/button'

export const Route = createLazyFileRoute('/')({
  component: App,
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='min-h-screen flex items-center justify-center'>
        <h1 className='text-4xl font-bold'>Hello World</h1>
      </div>
    </>
  )
}

export default App

import { createFileRoute } from "@tanstack/react-router"
// import viteLogo from '/vite.svg'

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className='min-h-screen flex items-center justify-center'>
        <h1 className='text-4xl font-bold'>Hello World</h1>
      </div>
    </>
  )
}

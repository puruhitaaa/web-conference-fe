import { createLazyFileRoute } from "@tanstack/react-router"
import { LoaTable } from "@/components/icicyta/loa-table"

export const Route = createLazyFileRoute("/_app/icicyta/loa")({
  component: LoaComponent,
})

function LoaComponent() {
  return (
    <div className='container mx-auto py-10 px-5'>
      <h1 className='text-2xl font-bold mb-6'>ICICYTA Letter of Acceptance</h1>
      <LoaTable />
    </div>
  )
}

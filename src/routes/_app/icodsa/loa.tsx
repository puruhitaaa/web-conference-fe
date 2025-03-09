import { createFileRoute } from "@tanstack/react-router"
import { LoaTable } from "@/components/icodsa/loa-table"

export const Route = createFileRoute("/_app/icodsa/loa")({
  component: LoaComponent,
})

function LoaComponent() {
  return (
    <div className='container mx-auto py-10 px-5'>
      <h1 className='text-2xl font-bold mb-6'>ICODSA Letter of Acceptance</h1>
      <LoaTable />
    </div>
  )
}

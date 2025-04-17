import { createLazyFileRoute } from "@tanstack/react-router"
import { InvoiceTable } from "@/components/icicyta/invoice-table"

export const Route = createLazyFileRoute("/_app/icicyta/invoice")({
  component: InvoiceComponent,
})

function InvoiceComponent() {
  return (
    <div className='container mx-auto py-10 px-5'>
      <h1 className='text-2xl font-bold mb-6'>ICICYTA Invoice</h1>
      <InvoiceTable />
    </div>
  )
}

import { createFileRoute } from "@tanstack/react-router"
import { InvoiceTable } from "@/components/icodsa/invoice-table"

export const Route = createFileRoute("/_app/icodsa/invoice")({
  component: InvoiceComponent,
})

function InvoiceComponent() {
  return (
    <div className='container mx-auto py-10 px-5'>
      <h1 className='text-2xl font-bold mb-6'>ICODSA Invoice</h1>
      <InvoiceTable />
    </div>
  )
}

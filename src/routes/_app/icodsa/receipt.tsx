import { createFileRoute } from "@tanstack/react-router"
import { ReceiptTable } from "@/components/icodsa/receipt-table"

export const Route = createFileRoute("/_app/icodsa/receipt")({
  component: ReceiptComponent,
})

function ReceiptComponent() {
  return (
    <div className='container mx-auto py-10 px-5'>
      <h1 className='text-2xl font-bold mb-6'>ICODSA Receipt</h1>
      <ReceiptTable />
    </div>
  )
}

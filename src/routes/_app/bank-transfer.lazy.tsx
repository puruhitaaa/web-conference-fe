import { createLazyFileRoute } from "@tanstack/react-router"
import { BankTransferTable } from "@/components/bank-transfer/bank-transfer-table"

export const Route = createLazyFileRoute("/_app/bank-transfer")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='container mx-auto py-10 px-5'>
      <h1 className='text-2xl font-bold mb-6'>Bank Transfer</h1>
      <BankTransferTable />
    </div>
  )
}

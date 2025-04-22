import { createLazyFileRoute } from "@tanstack/react-router"
import { VirtualAccountTable } from "@/components/virtual-account/virtual-account-table"

export const Route = createLazyFileRoute("/_app/virtual-accounts")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='container mx-auto py-10 px-5'>
      <h1 className='text-2xl font-bold mb-6'>Virtual Accounts</h1>
      <VirtualAccountTable />
    </div>
  )
}

import { AccountManagementTable } from "@/components/account-management/accounts-table"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_app/manage-account")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='container mx-auto py-10 px-5'>
      <h1 className='text-2xl font-bold mb-6'>Manage Account</h1>
      <AccountManagementTable />
    </div>
  )
}

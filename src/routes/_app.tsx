import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context }) => {
    if (!context?.auth) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='relative w-full'>
        <SidebarTrigger className='absolute top-6 left-4' />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

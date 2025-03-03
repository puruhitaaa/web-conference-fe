import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createFileRoute, redirect } from "@tanstack/react-router";
// import viteLogo from '/vite.svg'

// import reactLogo from '../assets/react.svg'
// import tailwindLogo from '../assets/tailwind.svg'
// import tanstackLogo from '../assets/tanstack.png'

// import { Button } from '@/components/ui/button'

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context?.auth) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative w-full">
        <SidebarTrigger className="absolute top-6 left-4" />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold">Hello World</h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

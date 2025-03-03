import * as React from "react";
import { Circle, Home } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "ICODSA",
      url: "#",
      icon: Circle,
      items: [
        {
          title: "LoA",
          url: "/icodsa/loa",
        },
        {
          title: "Invoice",
          url: "/icodsa/invoice",
        },
        {
          title: "Receipt",
          url: "/icodsa/receipt",
        },
      ],
    },
    {
      title: "ICICYTA",
      url: "#",
      icon: Circle,
      items: [
        {
          title: "LoA",
          url: "/icicyta/loa",
        },
        {
          title: "Invoice",
          url: "/icicyta/invoice",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuthUser() as { user: { id: string; email: string } };

  console.log(auth);
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

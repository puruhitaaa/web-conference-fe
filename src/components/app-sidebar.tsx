import * as React from "react";
import { Banknote, Circle, CreditCard, Home, Plus } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/auth/authStore";
import { Logo } from "@/components/ui/logo";

// Define menu items
const DASHBOARD_ITEM = {
  title: "Dashboard",
  url: "/",
  icon: Home,
};

const ICODSA_ITEM = {
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
};

const ICICYTA_ITEM = {
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
      title: "Receipt",
      url: "/icicyta/receipt",
    },
  ],
};

const BANK_TRANSFER_ITEM = {
  title: "Bank Transfer",
  url: "/bank-transfer",
  icon: Banknote,
};

const VIRTUAL_ACCOUNT_ITEM = {
  title: "Virtual Accounts",
  url: "/virtual-accounts",
  icon: CreditCard,
};

const ACCOUNT_MANAGEMENT = {
  title: "Manage Account",
  url: "/manage-account",
  icon: Plus,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  // Determine visible menu items based on the user's role
  // Role 1: Super Admin - can see all
  // Role 2: ICODSA Admin - can only see ICODSA
  // Role 3: ICICYTA Admin - can only see ICICYTA
  const getNavItems = () => {
    const items = [DASHBOARD_ITEM];

    // Super Admin can access everything
    if (user.role === 1) {
      items.push(
        ICODSA_ITEM,
        ICICYTA_ITEM,
        BANK_TRANSFER_ITEM,
        VIRTUAL_ACCOUNT_ITEM,
        ACCOUNT_MANAGEMENT
      );
    }
    // ICODSA Admin can only access ICODSA
    else if (user.role === 2) {
      items.push(ICODSA_ITEM, BANK_TRANSFER_ITEM);
    }
    // ICICYTA Admin can only access ICICYTA
    else if (user.role === 3) {
      items.push(ICICYTA_ITEM, BANK_TRANSFER_ITEM);
    }

    return items;
  };

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarContent>
        <div className="px-4 py-4">
          <Logo className="mx-auto" />
        </div>
        <NavMain items={getNavItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

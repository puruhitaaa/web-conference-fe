"use client"

import { ChevronsUpDown, LogOut, Moon, Sun } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "@tanstack/react-router"
import type { User } from "@/types/auth"
import api from "@/lib/axios-config"
import { authRoutes } from "@/api"
import { useAuthStore } from "@/lib/auth/authStore"
import { useTheme } from "./theme-provider"

export function NavUser({ user }: { user: User }) {
  const logout = useAuthStore((state) => state.logout)
  const { theme, setTheme } = useTheme()
  const { isMobile } = useSidebar()
  const navigate = useNavigate({ from: "/" })

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint before signing out client-side
      await api.post(authRoutes.logout)
      // Use zustand logout function
      logout()
      navigate({
        to: "/login",
        replace: true,
      })
    } catch (error) {
      console.error("Logout failed", error)
      // Still sign out client-side even if the API call fails
      logout()
      navigate({
        to: "/login",
        replace: true,
      })
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? "bottom" : "right"}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className='flex flex-col gap-1'>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className='text-white' />
                ) : (
                  <Moon className='text-black' />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='bg-red-700 hover:!bg-red-500 cursor-pointer text-white hover:!text-white'
              onClick={handleLogout}
            >
              <LogOut className='text-white' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Pages that should not have the sidebar
  const authPages = ["/auth/login", "/auth/sign-up", "/auth/error", "/auth/sign-up-success", "/"]
  const shouldShowSidebar = !authPages.includes(pathname)

  if (!shouldShowSidebar) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

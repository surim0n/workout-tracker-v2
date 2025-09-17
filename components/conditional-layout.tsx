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
      <SidebarInset className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
        <div className="relative min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-tl from-amber-50/30 via-transparent to-pink-50/30" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

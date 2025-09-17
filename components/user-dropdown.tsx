"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserDropdownProps {
  user?: any
  profile?: any
}

export function UserDropdown({ user, profile }: UserDropdownProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const userInitials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "U"

  const displayName = profile?.full_name || user?.email || "User"

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
          {userInitials}
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-medium truncate max-w-32">{displayName}</span>
          <span className="text-xs text-muted-foreground truncate max-w-32">
            {user?.email}
          </span>
        </div>
      </div>
      <Button 
        onClick={handleLogout} 
        disabled={isLoggingOut}
        variant="ghost"
        className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
      </Button>
    </div>
  )
}
"use client"

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  user: { id: string; email: string }
  profile: any
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.full_name || user.email}!</h1>
        <p className="text-muted-foreground mt-1">Ready to crush your fitness goals today?</p>
      </div>
      <SignOutButton />
    </div>
  )
}

function SignOutButton() {
  const handleSignOut = async () => {
    // Auth disabled for development
    alert("Sign out disabled in development mode")
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}

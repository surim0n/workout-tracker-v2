"use client"

import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface DashboardHeaderProps {
  user: User | any // Allow demo user object
  profile: any
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const isDemoUser = user?.id === "demo-user"

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {profile?.full_name || profile?.display_name || user.email}!
          {isDemoUser && <span className="text-sm text-muted-foreground ml-2">(Demo Mode)</span>}
        </h1>
        <p className="text-muted-foreground mt-1">Ready to crush your fitness goals today?</p>
      </div>
      {!isDemoUser && <SignOutButton />}
      {isDemoUser && (
        <Button variant="outline" asChild>
          <a href="/auth/login">Sign In</a>
        </Button>
      )}
    </div>
  )
}

function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}

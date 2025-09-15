import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentWorkouts } from "@/components/dashboard/recent-workouts"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get recent workouts
  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select(`
      id,
      name,
      duration_minutes,
      created_at,
      workout_exercises (
        id,
        exercises (
          name,
          category
        )
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get workout stats
  const { data: workoutStats } = await supabase
    .from("workouts")
    .select("id, duration_minutes, created_at")
    .eq("user_id", data.user.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader user={data.user} profile={profile} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <QuickStats workouts={workoutStats || []} />
          <QuickActions />
        </div>

        <RecentWorkouts workouts={recentWorkouts || []} />
      </div>
    </div>
  )
}

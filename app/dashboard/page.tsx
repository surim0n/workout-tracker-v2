import { createClient } from "@/lib/supabase/server"
import { WorkoutCharts } from "@/components/dashboard/workout-charts"
import { HeroSection } from "@/components/dashboard/hero-section"
import { EnhancedStats } from "@/components/dashboard/enhanced-stats"
import { EnhancedRecentWorkouts } from "@/components/dashboard/enhanced-recent-workouts"

const demoUser = {
  id: "demo-user",
  email: "demo@example.com",
  user_metadata: {
    full_name: "Demo User",
  },
}

const demoProfile = {
  id: "demo-user",
  full_name: "Demo User",
  created_at: new Date().toISOString(),
}

const demoWorkouts = [
  {
    id: "1",
    name: "Upper Body Strength",
    duration_minutes: 45,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    workout_exercises: [
      { id: "1", exercises: { name: "Bench Press", category: "strength" } },
      { id: "2", exercises: { name: "Pull-ups", category: "strength" } },
    ],
  },
  {
    id: "2",
    name: "Cardio Session",
    duration_minutes: 30,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    workout_exercises: [{ id: "3", exercises: { name: "Running", category: "cardio" } }],
  },
  {
    id: "3",
    name: "Leg Day",
    duration_minutes: 60,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    workout_exercises: [
      { id: "4", exercises: { name: "Squats", category: "strength" } },
      { id: "5", exercises: { name: "Deadlifts", category: "strength" } },
    ],
  },
]

const demoWorkoutStats = [
  { id: "1", duration_minutes: 45, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "2", duration_minutes: 30, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "3", duration_minutes: 60, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "4", duration_minutes: 40, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "5", duration_minutes: 35, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  let user = data?.user
  let profile = null
  let recentWorkouts = null
  let workoutStats = null

  if (user) {
    // Get user profile
    const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = userProfile

    // Get recent workouts
    const { data: userRecentWorkouts } = await supabase
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
    recentWorkouts = userRecentWorkouts

    // Get workout stats
    const { data: userWorkoutStats } = await supabase
      .from("workouts")
      .select("id, duration_minutes, created_at")
      .eq("user_id", user.id)
    workoutStats = userWorkoutStats
  } else {
    // Use demo data
    user = demoUser
    profile = demoProfile
    recentWorkouts = demoWorkouts
    workoutStats = demoWorkoutStats
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <HeroSection user={user} profile={profile} workoutStats={workoutStats || []} />

      <EnhancedStats workouts={workoutStats || []} />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Progress Overview</h2>
        </div>
        <WorkoutCharts workouts={workoutStats || []} />
      </div>

      <EnhancedRecentWorkouts workouts={recentWorkouts || []} />
    </div>
  )
}

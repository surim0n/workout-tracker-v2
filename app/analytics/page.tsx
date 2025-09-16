import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsSummary } from "@/components/analytics/analytics-summary"
import { WorkoutBreakdown } from "@/components/analytics/workout-breakdown"
import { ExerciseAnalytics } from "@/components/analytics/exercise-analytics"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get comprehensive workout data
  const { data: workouts } = await supabase
    .from("workouts")
    .select(`
      id,
      name,
      notes,
      duration_minutes,
      created_at,
      workout_exercises (
        id,
        sets,
        reps,
        weight,
        distance,
        duration_seconds,
        exercises (
          id,
          name,
          category,
          muscle_groups
        )
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-chart-3/10 via-chart-4/5 to-transparent p-8 backdrop-blur-sm border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-chart-3/5 to-chart-4/5" />
          <div className="relative z-10 flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="glass-button">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Analytics & Insights
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">Deep dive into your fitness data and patterns</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <AnalyticsSummary workouts={workouts || []} />
          <WorkoutBreakdown workouts={workouts || []} />
          <ExerciseAnalytics workouts={workouts || []} />
        </div>
      </div>
    </div>
  )
}

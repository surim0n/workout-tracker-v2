import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProgressCharts } from "@/components/progress/progress-charts"
import { ExerciseProgress } from "@/components/progress/exercise-progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ProgressPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get workout data for progress tracking
  const { data: workouts } = await supabase
    .from("workouts")
    .select(`
      id,
      name,
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
          category
        )
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: true })

  // Get unique exercises for progress tracking
  const exerciseMap = new Map()
  workouts?.forEach((workout) => {
    workout.workout_exercises.forEach((we) => {
      if (!exerciseMap.has(we.exercises.id)) {
        exerciseMap.set(we.exercises.id, we.exercises)
      }
    })
  })
  const uniqueExercises = Array.from(exerciseMap.values())

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
            <p className="text-muted-foreground mt-1">Visualize your fitness journey and improvements</p>
          </div>
        </div>

        <div className="space-y-8">
          <ProgressCharts workouts={workouts || []} />
          <ExerciseProgress workouts={workouts || []} exercises={uniqueExercises} />
        </div>
      </div>
    </div>
  )
}

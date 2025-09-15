import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WorkoutsList } from "@/components/workouts/workouts-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function WorkoutsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get all workouts for the user
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
          name,
          category
        )
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Workouts</h1>
            <p className="text-muted-foreground mt-1">Track your fitness journey and see your progress</p>
          </div>
          <Button asChild>
            <Link href="/workouts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Workout
            </Link>
          </Button>
        </div>

        <WorkoutsList workouts={workouts || []} />
      </div>
    </div>
  )
}

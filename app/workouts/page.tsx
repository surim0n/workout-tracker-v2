import { createClient } from "@/lib/supabase/server"
import { WorkoutsList } from "@/components/workouts/workouts-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const demoWorkouts = [
  {
    id: "1",
    name: "Upper Body Strength",
    notes: "Focus on progressive overload",
    duration_minutes: 45,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    workout_exercises: [
      {
        id: "1",
        sets: 4,
        reps: 8,
        weight: 185,
        distance: null,
        duration_seconds: null,
        exercises: { name: "Bench Press", category: "strength" },
      },
      {
        id: "2",
        sets: 3,
        reps: 10,
        weight: null,
        distance: null,
        duration_seconds: null,
        exercises: { name: "Pull-ups", category: "strength" },
      },
    ],
  },
  {
    id: "2",
    name: "Cardio Session",
    notes: "Morning run in the park",
    duration_minutes: 30,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    workout_exercises: [
      {
        id: "3",
        sets: 1,
        reps: null,
        weight: null,
        distance: 5.2,
        duration_seconds: 1800,
        exercises: { name: "Running", category: "cardio" },
      },
    ],
  },
  {
    id: "3",
    name: "Leg Day",
    notes: "Heavy squats and deadlifts",
    duration_minutes: 60,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    workout_exercises: [
      {
        id: "4",
        sets: 5,
        reps: 5,
        weight: 225,
        distance: null,
        duration_seconds: null,
        exercises: { name: "Squats", category: "strength" },
      },
      {
        id: "5",
        sets: 3,
        reps: 5,
        weight: 275,
        distance: null,
        duration_seconds: null,
        exercises: { name: "Deadlifts", category: "strength" },
      },
    ],
  },
]

export default async function WorkoutsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  let workouts = null

  if (data?.user) {
    // Get all workouts for the authenticated user
    const { data: userWorkouts } = await supabase
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
    workouts = userWorkouts
  } else {
    // Use demo data
    workouts = demoWorkouts
  }

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

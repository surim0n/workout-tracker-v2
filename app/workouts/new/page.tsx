import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewWorkoutForm } from "@/components/workouts/new-workout-form"

export default async function NewWorkoutPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get available exercises
  const { data: exercises } = await supabase.from("exercises").select("*").order("name")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Log New Workout</h1>
            <p className="text-muted-foreground mt-1">Add exercises and track your performance</p>
          </div>

          <NewWorkoutForm exercises={exercises || []} userId={data.user.id} />
        </div>
      </div>
    </div>
  )
}

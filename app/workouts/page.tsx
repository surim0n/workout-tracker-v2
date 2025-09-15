import { WorkoutsList } from "@/components/workouts/workouts-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function WorkoutsPage() {
  // Mock workouts data (auth disabled)
  const mockWorkouts: any[] = []

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

        <WorkoutsList workouts={mockWorkouts} />
      </div>
    </div>
  )
}

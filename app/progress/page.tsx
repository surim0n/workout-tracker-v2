import { ProgressCharts } from "@/components/progress/progress-charts"
import { ExerciseProgress } from "@/components/progress/exercise-progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProgressPage() {
  // Mock data (auth disabled)
  const mockWorkouts: any[] = []
  const uniqueExercises: any[] = []

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
          <ProgressCharts workouts={mockWorkouts} />
          <ExerciseProgress workouts={mockWorkouts} exercises={uniqueExercises} />
        </div>
      </div>
    </div>
  )
}

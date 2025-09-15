import { AnalyticsSummary } from "@/components/analytics/analytics-summary"
import { WorkoutBreakdown } from "@/components/analytics/workout-breakdown"
import { ExerciseAnalytics } from "@/components/analytics/exercise-analytics"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  // Mock workout data (auth disabled)
  const mockWorkouts: any[] = []

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
            <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
            <p className="text-muted-foreground mt-1">Deep dive into your fitness data and patterns</p>
          </div>
        </div>

        <div className="space-y-8">
          <AnalyticsSummary workouts={mockWorkouts} />
          <WorkoutBreakdown workouts={mockWorkouts} />
          <ExerciseAnalytics workouts={mockWorkouts} />
        </div>
      </div>
    </div>
  )
}

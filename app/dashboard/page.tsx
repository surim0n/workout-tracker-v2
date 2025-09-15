import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentWorkouts } from "@/components/dashboard/recent-workouts"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  // Mock data for development (auth disabled)
  const mockUser = {
    id: "demo-user",
    email: "demo@example.com"
  }

  const mockProfile = {
    id: "demo-user",
    full_name: "Demo User",
    created_at: new Date().toISOString()
  }

  // Mock recent workouts data
  const mockRecentWorkouts: any[] = []

  // Mock workout stats
  const mockWorkoutStats: any[] = []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader user={mockUser} profile={mockProfile} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <QuickStats workouts={mockWorkoutStats} />
          <QuickActions />
        </div>

        <RecentWorkouts workouts={mockRecentWorkouts} />
      </div>
    </div>
  )
}
